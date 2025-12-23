import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const users = client.db().collection('users');
          const user = await users.findOne({ email: credentials.email });
          if (!user || !user.password) return null;
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;
          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            image: user.image,
            linkedin: user.linkedin
          };
        } catch (error) {
          console.error('Credentials auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.provider = account.provider;
        
        try {
          const client = await clientPromise;
          const users = client.db().collection('users');
          const existingUser = await users.findOne({ email: user.email });
          
          if (existingUser) {
            // Update existing user
            const updates = { 
              lastLogin: new Date(),
              provider: account.provider 
            };
            
            if (!existingUser.image && user.image) updates.image = user.image;
            if (!existingUser.name && user.name) updates.name = user.name;
            
            await users.updateOne({ email: user.email }, { $set: updates });
            
            token.id = existingUser._id.toString();
            token.linkedin = existingUser.linkedin;
          } else {
            // Create new user for OAuth
            const newUser = {
              name: user.name || '',
              email: user.email,
              image: user.image || null,
              provider: account.provider,
              createdAt: new Date(),
              lastLogin: new Date()
            };
            
            const result = await users.insertOne(newUser);
            token.id = result.insertedId.toString();
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.provider = token.provider;
        session.user.linkedin = token.linkedin;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow all sign-ins
      return true;
    }
  }
};

export default NextAuth(authOptions);

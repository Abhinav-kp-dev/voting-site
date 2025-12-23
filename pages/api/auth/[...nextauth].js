import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
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
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // LinkedIn OAuth with OpenID Connect scopes (your app only has OIDC permissions)
    {
      id: "linkedin",
      name: "LinkedIn",
      type: "oauth",
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      issuer: "https://www.linkedin.com/oauth",
      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
      },
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || 'LinkedIn User',
          email: profile.email,
          image: profile.picture,
          linkedin: `https://www.linkedin.com/in/${profile.sub}`,
        };
      },
      checks: ["state"],
      idToken: true,
    }
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback - Provider:', account.provider);
      console.log('SignIn callback - User:', user);
      return true;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.provider = token.provider;
      return session;
    }
  }
};

export default NextAuth(authOptions);
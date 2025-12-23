
# voting-site

# Online Voting Platform (Next.js + MongoDB)

Simple MERN-style voting app using Next.js for frontend and API routes, NextAuth for OAuth (Google & LinkedIn) and credentials, and MongoDB for storage.

Features
- Signup / Login (email+password)
- OAuth Login: Google and LinkedIn (via NextAuth)
- Forgot Password (generates reset link printed in server logs in development)
- View team with 2 candidates and LinkedIn links
- One-time vote per authenticated user
- After voting, see list of voters with links to their LinkedIn profiles

Setup
1. Install dependencies:

```bash
npm install
```

2. Create a MongoDB database (MongoDB Atlas recommended) and set `MONGODB_URI`.
3. Copy `.env.example` to `.env.local` and fill in values (Google/LinkedIn OAuth credentials and NEXTAUTH_SECRET).
4. Run the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000` then click any team to view candidates. The app seeds a sample team automatically on first load.

Notes
- For LinkedIn link on voters: users can provide their LinkedIn URL at signup. If logging in via LinkedIn provider, the profile data may populate a field but we still prompt/allow editing in profile (not implemented here).
- Password reset link is printed to server console in development. For production, integrate an email provider.

Deployment
- Deploy to Vercel and set environment variables in the Vercel dashboard. Use MongoDB Atlas for the DB.
7263625 (Initial commit)

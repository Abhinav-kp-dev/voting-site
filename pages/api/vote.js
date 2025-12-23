import clientPromise from '../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Not authenticated' });
    if (req.method !== 'POST') return res.status(405).end();
    
    const { teamSlug, candidateId } = req.body;
    if (!teamSlug || !candidateId) return res.status(400).json({ error: 'Missing fields' });
    
    const client = await clientPromise;
    const db = client.db();
    const votes = db.collection('votes');
    const users = db.collection('users');
    
    // Check if user already voted
    const already = await votes.findOne({ teamSlug, userEmail: session.user.email });
    if (already) return res.status(400).json({ error: 'Already voted' });
    
    // Get user info for voter display
    const user = await users.findOne({ email: session.user.email });
    
    // Record the vote
    await votes.insertOne({ 
      teamSlug, 
      candidateId, 
      userEmail: session.user.email, 
      name: user?.name || session.user.name || '', 
      linkedin: user?.linkedin || session.user.linkedin || '',
      votedAt: new Date()
    });
    
    // Get all voters for this team
    const voters = await votes.find({ teamSlug }).toArray();
    res.json({ ok: true, voters });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

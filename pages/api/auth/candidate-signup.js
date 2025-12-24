import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { name, email, password, linkedin, organization } = req.body;
  
  if (!name || !email || !password || !linkedin) {
    return res.status(400).json({ error: 'Name, email, password, and LinkedIn are required' });
  }

  if (!linkedin.includes('linkedin.com')) {
    return res.status(400).json({ error: 'Please provide a valid LinkedIn URL' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    
    // Check if user already exists
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create candidate user
    await users.insertOne({ 
      name, 
      email, 
      password: hashed, 
      linkedin,
      organization: organization || '',
      role: 'candidate',
      createdAt: new Date()
    });
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Candidate signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password, linkedin } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const client = await clientPromise;
  const users = client.db().collection('users');
  const exists = await users.findOne({ email });
  if (exists) return res.status(400).json({ error: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const result = await users.insertOne({ name, email, password: hashed, linkedin: linkedin || null });
  res.json({ ok: true });
}

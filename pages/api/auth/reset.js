import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
  const client = await clientPromise;
  const users = client.db().collection('users');
  const user = await users.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
  const hashed = await bcrypt.hash(password, 10);
  await users.updateOne({ _id: user._id }, { $set: { password: hashed }, $unset: { resetToken: '', resetExpires: '' } });
  res.json({ ok: true });
}

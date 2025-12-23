import clientPromise from '../../../lib/mongodb';
import { randomBytes } from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const client = await clientPromise;
  const users = client.db().collection('users');
  const user = await users.findOne({ email });
  if (!user) return res.status(200).json({ ok: true });
  const token = randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000;
  await users.updateOne({ email }, { $set: { resetToken: token, resetExpires: expires } });
  const resetLink = `${process.env.NEXTAUTH_URL}/reset/${token}`;
  console.log('Password reset link (development):', resetLink);
  res.json({ ok: true, message: 'Reset link created (check server logs in dev)' });
}

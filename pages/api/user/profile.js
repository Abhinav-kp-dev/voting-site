import clientPromise from '../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection('users');

  if (req.method === 'GET') {
    const user = await users.findOne({ email: session.user.email });
    return res.json({
      email: session.user.email,
      name: user?.name || session.user.name,
      linkedin: user?.linkedin || '',
      image: session.user.image || null
    });
  }

  if (req.method === 'PUT') {
    const { linkedin, name } = req.body;
    
    const updateData = {};
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (name !== undefined) updateData.name = name;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    await users.updateOne(
      { email: session.user.email },
      { 
        $set: updateData,
        $setOnInsert: { email: session.user.email, createdAt: new Date() }
      },
      { upsert: true }
    );

    return res.json({ ok: true });
  }

  return res.status(405).end();
}

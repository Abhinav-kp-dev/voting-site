import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const teams = db.collection('teams');
  const existing = await teams.findOne({ slug: 'team-alpha' });
  if (existing) return res.json({ ok: true, message: 'seed exists' });
  const team = {
    name: 'Team Alpha',
    slug: 'team-alpha',
    candidates: [
      { id: 'c1', name: 'Alice Johnson', bio: 'Experienced engineer', linkedin: 'https://www.linkedin.com/in/alice-johnson' },
      { id: 'c2', name: 'Bob Smith', bio: 'Product leader', linkedin: 'https://www.linkedin.com/in/bob-smith' }
    ]
  };
  await teams.insertOne(team);
  res.json({ ok: true });
}

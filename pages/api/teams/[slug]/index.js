import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
  const { slug } = req.query;
  const client = await clientPromise;
  const teams = client.db().collection('teams');
  const team = await teams.findOne({ slug });
  if (!team) return res.status(404).json({ error: 'Not found' });
  res.json({ team });
}

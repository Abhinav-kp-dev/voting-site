import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const teams = client.db().collection('teams');
  const t = await teams.find().toArray();
  res.json({ teams: t.map(({ _id, ...rest }) => rest) });
}

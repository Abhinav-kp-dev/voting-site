import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
  const { slug } = req.query;
  const client = await clientPromise;
  const votes = client.db().collection('votes');
  const v = await votes.find({ teamSlug: slug }).toArray();
  res.json({ voters: v });
}

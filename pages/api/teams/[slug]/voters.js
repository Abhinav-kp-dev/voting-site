import clientPromise from '../../../../lib/mongodb';

export default async function handler(req, res) {
  const { slug } = req.query;
  const client = await clientPromise;
  const db = client.db();
  const votes = db.collection('votes');
  
  // Get all votes with candidate info
  const v = await votes.find({ teamSlug: slug }).toArray();
  
  // Calculate vote counts per candidate
  const voteCounts = {};
  v.forEach(vote => {
    voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1;
  });
  
  res.json({ 
    voters: v,
    voteCounts,
    totalVotes: v.length
  });
}

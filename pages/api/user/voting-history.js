import clientPromise from '../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  const client = await clientPromise;
  const db = client.db();
  const votes = db.collection('votes');
  const teams = db.collection('teams');

  // Get all votes by this user
  const userVotes = await votes.find({ userEmail: session.user.email })
    .sort({ votedAt: -1 })
    .toArray();

  // Enrich with team and candidate info
  const enrichedVotes = await Promise.all(userVotes.map(async (vote) => {
    const team = await teams.findOne({ slug: vote.teamSlug });
    let candidateName = vote.candidateId;
    
    if (team) {
      const candidate = team.candidates?.find(c => c.id === vote.candidateId);
      if (candidate) candidateName = candidate.name;
    }

    return {
      _id: vote._id,
      teamSlug: vote.teamSlug,
      teamName: team?.name || vote.teamSlug,
      candidateId: vote.candidateId,
      candidateName,
      votedAt: vote.votedAt
    };
  }));

  return res.json({ votes: enrichedVotes });
}

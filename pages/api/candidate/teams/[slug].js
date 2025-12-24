import clientPromise from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  const { slug } = req.query;
  const client = await clientPromise;
  const db = client.db();
  const teams = db.collection('teams');
  const votes = db.collection('votes');

  // Get the team and verify ownership
  const team = await teams.findOne({ slug });
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  if (team.createdBy !== session.user.email) {
    return res.status(403).json({ error: 'Not authorized to modify this team' });
  }

  if (req.method === 'GET') {
    const voteCount = await votes.countDocuments({ teamSlug: slug });
    return res.json({ 
      team: { ...team, voteCount, _id: undefined }
    });
  }

  if (req.method === 'PUT') {
    const { name, description, deadline, candidates } = req.body;

    if (!name || !candidates || candidates.length !== 2) {
      return res.status(400).json({ error: 'Name and exactly 2 candidates are required' });
    }

    await teams.updateOne(
      { slug },
      {
        $set: {
          name,
          description: description || '',
          deadline: deadline ? new Date(deadline) : null,
          candidates: candidates.map((c, i) => ({
            id: c.id || String(i + 1),
            name: c.name,
            bio: c.bio || '',
            linkedin: c.linkedin
          })),
          updatedAt: new Date()
        }
      }
    );

    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    // Delete team and all associated votes
    await teams.deleteOne({ slug });
    await votes.deleteMany({ teamSlug: slug });
    return res.json({ ok: true });
  }

  res.status(405).end();
}

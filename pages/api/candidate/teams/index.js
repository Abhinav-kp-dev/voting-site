import clientPromise from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  const client = await clientPromise;
  const db = client.db();
  const teams = db.collection('teams');
  const votes = db.collection('votes');

  if (req.method === 'GET') {
    // Get teams created by this user
    const userTeams = await teams.find({ createdBy: session.user.email }).toArray();
    
    // Get vote counts for each team
    const teamsWithStats = await Promise.all(userTeams.map(async (team) => {
      const voteCount = await votes.countDocuments({ teamSlug: team.slug });
      return {
        ...team,
        voteCount,
        _id: undefined
      };
    }));

    return res.json({ teams: teamsWithStats });
  }

  if (req.method === 'POST') {
    const { name, slug, candidates, description, deadline } = req.body;

    if (!name || !slug || !candidates || candidates.length !== 2) {
      return res.status(400).json({ error: 'Name, slug, and exactly 2 candidates are required' });
    }

    // Check if slug already exists
    const existing = await teams.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'A team with this URL already exists' });
    }

    // Create the team
    await teams.insertOne({
      name,
      slug,
      description: description || '',
      deadline: deadline ? new Date(deadline) : null,
      candidates: candidates.map((c, i) => ({
        id: c.id || String(i + 1),
        name: c.name,
        bio: c.bio || '',
        linkedin: c.linkedin
      })),
      createdBy: session.user.email,
      createdAt: new Date()
    });

    return res.json({ ok: true });
  }

  res.status(405).end();
}

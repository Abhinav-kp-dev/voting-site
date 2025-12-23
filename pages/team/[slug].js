import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function TeamPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const [team, setTeam] = useState(null);
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/teams/${slug}`).then((r) => r.json()).then((d) => setTeam(d.team));
    fetch(`/api/teams/${slug}/voters`).then((r) => r.json()).then((d) => setVoters(d.voters || []));
  }, [slug]);

  async function vote(candidateId) {
    if (!session) return signIn();
    const res = await fetch('/api/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ teamSlug: slug, candidateId }) });
    const data = await res.json();
    if (data.error) return alert(data.error);
    setVoters(data.voters);
  }

  if (!team) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{team.name}</h1>
      <div style={{ display: 'flex', gap: 20 }}>
        {team.candidates.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ddd', padding: 12, width: 300 }}>
            <h3>{c.name}</h3>
            <p>{c.bio}</p>
            <p>
              <a href={c.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </p>
            <button onClick={() => vote(c.id)}>Vote</button>
          </div>
        ))}
      </div>

      <h2>Voters</h2>
      <ul>
        {voters.map((v) => (
          <li key={v._id}>
            <a href={v.linkedin || '#'} target="_blank" rel="noreferrer">{v.name || v.userEmail}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

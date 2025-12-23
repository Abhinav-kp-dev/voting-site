import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function load() {
      await fetch('/api/teams/seed').then(() => {});
      const res = await fetch('/api/teams');
      const data = await res.json();
      setTeams(data.teams || []);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Voting Platform</h1>
      
      {status === 'loading' && <p>Loading...</p>}
      
      {session ? (
        <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
          <p>Welcome, {session.user.name || session.user.email}!</p>
          {session.user.image && (
            <img src={session.user.image} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          )}
          <button onClick={() => signOut()} style={{ marginLeft: 10, padding: 5 }}>Sign Out</button>
        </div>
      ) : (
        <p>
          <Link href="/login">Login</Link> or <Link href="/signup">Sign up</Link> to vote
        </p>
      )}

      <h2>Teams</h2>
      <ul>
        {teams.map((t) => (
          <li key={t.slug} style={{ marginBottom: 10 }}>
            <Link href={`/team/${t.slug}`} style={{ fontSize: 18 }}>{t.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

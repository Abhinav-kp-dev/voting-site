import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CandidateDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/candidate/login');
    } else if (status === 'authenticated') {
      fetchTeams();
    }
  }, [status, router]);

  async function fetchTeams() {
    const res = await fetch('/api/candidate/teams');
    const data = await res.json();
    setTeams(data.teams || []);
    setLoading(false);
  }

  async function deleteTeam(slug) {
    if (!confirm('Are you sure you want to delete this team?')) return;
    await fetch(`/api/candidate/teams/${slug}`, { method: 'DELETE' });
    fetchTeams();
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#FDF8F3',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e8e0d8',
      padding: '16px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: 20,
      fontWeight: 700,
      color: '#1a1a1a',
      textDecoration: 'none',
    },
    badge: {
      backgroundColor: '#1a1a1a',
      color: '#fff',
      padding: '4px 10px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      marginLeft: 8,
      textTransform: 'uppercase',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    },
    userName: {
      color: '#666',
      fontSize: 14,
    },
    logoutBtn: {
      padding: '8px 16px',
      backgroundColor: 'transparent',
      border: '1px solid #e0d8d0',
      borderRadius: 8,
      fontSize: 14,
      color: '#666',
      cursor: 'pointer',
    },
    main: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '40px',
    },
    pageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 40,
    },
    pageTitle: {
      fontSize: 32,
      fontWeight: 700,
      color: '#1a1a1a',
    },
    createBtn: {
      padding: '14px 24px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    teamsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 24,
    },
    teamCard: {
      backgroundColor: '#fff',
      border: '1px solid #e8e0d8',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    teamName: {
      fontSize: 20,
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: 8,
    },
    teamSlug: {
      fontSize: 13,
      color: '#888',
      marginBottom: 16,
    },
    teamStats: {
      display: 'flex',
      gap: 16,
      marginBottom: 20,
      paddingBottom: 20,
      borderBottom: '1px solid #f0ebe6',
    },
    stat: {
      textAlign: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 700,
      color: '#1a1a1a',
    },
    statLabel: {
      fontSize: 12,
      color: '#888',
    },
    teamActions: {
      display: 'flex',
      gap: 12,
    },
    actionBtn: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
      textAlign: 'center',
      textDecoration: 'none',
    },
    editBtn: {
      backgroundColor: '#fafafa',
      border: '1px solid #e0d8d0',
      color: '#1a1a1a',
    },
    viewBtn: {
      backgroundColor: '#1a1a1a',
      border: 'none',
      color: '#fff',
    },
    deleteBtn: {
      backgroundColor: 'transparent',
      border: '1px solid #fecaca',
      color: '#dc2626',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 40px',
      backgroundColor: '#fff',
      borderRadius: 16,
      border: '1px solid #e8e0d8',
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: '#1a1a1a',
      marginBottom: 8,
    },
    emptyText: {
      color: '#888',
      marginBottom: 24,
    },
    loadingContainer: {
      minHeight: '100vh',
      backgroundColor: '#FDF8F3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  if (status === 'loading' || loading) {
    return (
      <div style={styles.loadingContainer}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={styles.logo}>VotePlatform</Link>
          <span style={styles.badge}>Candidate</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.userName}>{session?.user?.name || session?.user?.email}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Your Teams</h1>
          <button onClick={() => router.push('/candidate/create-team')} style={styles.createBtn}>
            <span>+</span> Create Team
          </button>
        </div>

        {teams.length > 0 ? (
          <div style={styles.teamsGrid}>
            {teams.map((team) => (
              <div key={team.slug} style={styles.teamCard}>
                <h3 style={styles.teamName}>{team.name}</h3>
                <p style={styles.teamSlug}>/team/{team.slug}</p>
                <div style={styles.teamStats}>
                  <div style={styles.stat}>
                    <div style={styles.statValue}>{team.candidates?.length || 0}</div>
                    <div style={styles.statLabel}>Candidates</div>
                  </div>
                  <div style={styles.stat}>
                    <div style={styles.statValue}>{team.voteCount || 0}</div>
                    <div style={styles.statLabel}>Votes</div>
                  </div>
                </div>
                <div style={styles.teamActions}>
                  <Link 
                    href={`/candidate/edit-team/${team.slug}`} 
                    style={{...styles.actionBtn, ...styles.editBtn}}
                  >
                    Edit
                  </Link>
                  <Link 
                    href={`/team/${team.slug}`} 
                    target="_blank"
                    style={{...styles.actionBtn, ...styles.viewBtn}}
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => deleteTeam(team.slug)}
                    style={{...styles.actionBtn, ...styles.deleteBtn}}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🗳️</div>
            <h3 style={styles.emptyTitle}>No teams yet</h3>
            <p style={styles.emptyText}>Create your first voting team to get started</p>
            <button onClick={() => router.push('/candidate/create-team')} style={styles.createBtn}>
              <span>+</span> Create Team
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [editingLinkedin, setEditingLinkedin] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVotingHistory();
      fetchUserProfile();
    }
  }, [status]);

  async function fetchVotingHistory() {
    try {
      const res = await fetch('/api/user/voting-history');
      const data = await res.json();
      setVotingHistory(data.votes || []);
    } catch (err) {
      console.error('Failed to fetch voting history');
    }
    setLoading(false);
  }

  async function fetchUserProfile() {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      setLinkedinUrl(data.linkedin || '');
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  }

  async function updateLinkedin(e) {
    e.preventDefault();
    if (!linkedinUrl.includes('linkedin.com')) {
      alert('Please enter a valid LinkedIn URL');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedin: linkedinUrl })
      });
      const data = await res.json();
      if (data.ok) {
        setEditingLinkedin(false);
      }
    } catch (err) {
      alert('Failed to update LinkedIn');
    }
    setSaving(false);
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
    backLink: {
      color: '#666',
      textDecoration: 'none',
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    logo: {
      color: '#1a1a1a',
      fontSize: 20,
      fontWeight: 700,
      textDecoration: 'none',
    },
    signOutBtn: {
      padding: '10px 20px',
      backgroundColor: '#fff',
      border: '1px solid #e0d8d0',
      borderRadius: 8,
      fontSize: 14,
      color: '#666',
      cursor: 'pointer',
    },
    main: {
      maxWidth: 800,
      margin: '0 auto',
      padding: '40px',
    },
    profileCard: {
      backgroundColor: '#fff',
      border: '1px solid #e8e0d8',
      borderRadius: 16,
      padding: 32,
      marginBottom: 32,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 32,
      fontWeight: 600,
      marginBottom: 20,
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      objectFit: 'cover',
      marginBottom: 20,
    },
    userName: {
      fontSize: 28,
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: '#666',
      marginBottom: 24,
    },
    linkedinSection: {
      borderTop: '1px solid #e8e0d8',
      paddingTop: 20,
    },
    linkedinLabel: {
      fontSize: 14,
      fontWeight: 500,
      color: '#444',
      marginBottom: 8,
    },
    linkedinValue: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    linkedinLink: {
      color: '#0077b5',
      textDecoration: 'none',
      fontSize: 15,
    },
    editBtn: {
      background: 'none',
      border: 'none',
      color: '#666',
      cursor: 'pointer',
      fontSize: 14,
      textDecoration: 'underline',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      backgroundColor: '#fafafa',
      border: '1px solid #e0d8d0',
      borderRadius: 8,
      fontSize: 15,
      color: '#1a1a1a',
      outline: 'none',
    },
    saveBtn: {
      padding: '12px 20px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
    },
    cancelBtn: {
      padding: '12px 20px',
      backgroundColor: '#fff',
      border: '1px solid #e0d8d0',
      borderRadius: 8,
      fontSize: 14,
      color: '#666',
      cursor: 'pointer',
    },
    historyCard: {
      backgroundColor: '#fff',
      border: '1px solid #e8e0d8',
      borderRadius: 16,
      padding: 32,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    voteList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    voteItem: {
      padding: '16px 0',
      borderBottom: '1px solid #f0ebe6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    voteInfo: {
      flex: 1,
    },
    votedFor: {
      fontSize: 16,
      fontWeight: 600,
      color: '#1a1a1a',
      marginBottom: 4,
    },
    voteTeam: {
      fontSize: 14,
      color: '#666',
    },
    voteDate: {
      fontSize: 13,
      color: '#888',
    },
    viewBtn: {
      padding: '8px 16px',
      backgroundColor: '#f5f0eb',
      border: 'none',
      borderRadius: 6,
      fontSize: 13,
      color: '#1a1a1a',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    noVotes: {
      textAlign: 'center',
      padding: '40px 0',
      color: '#888',
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
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link href="/" style={styles.backLink}>
          ← Back to Home
        </Link>
        <Link href="/" style={styles.logo}>
          VotePlatform
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/' })} style={styles.signOutBtn}>
          Sign Out
        </button>
      </header>

      <main style={styles.main}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          {session.user.image ? (
            <img src={session.user.image} alt="" style={styles.avatarImage} />
          ) : (
            <div style={styles.avatar}>
              {(session.user.name || session.user.email || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <h1 style={styles.userName}>{session.user.name || 'User'}</h1>
          <p style={styles.userEmail}>{session.user.email}</p>

          <div style={styles.linkedinSection}>
            <p style={styles.linkedinLabel}>LinkedIn Profile</p>
            {editingLinkedin ? (
              <form onSubmit={updateLinkedin} style={{ display: 'flex', gap: 12 }}>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  style={styles.input}
                  required
                  autoFocus
                />
                <button type="submit" disabled={saving} style={styles.saveBtn}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setEditingLinkedin(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
              </form>
            ) : (
              <div style={styles.linkedinValue}>
                {linkedinUrl ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077b5">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <a href={linkedinUrl} target="_blank" rel="noreferrer" style={styles.linkedinLink}>
                      {linkedinUrl.replace('https://', '').replace('www.', '')}
                    </a>
                  </>
                ) : (
                  <span style={{ color: '#888' }}>Not linked</span>
                )}
                <button onClick={() => setEditingLinkedin(true)} style={styles.editBtn}>
                  {linkedinUrl ? 'Edit' : 'Add LinkedIn'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Voting History */}
        <div style={styles.historyCard}>
          <h2 style={styles.sectionTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="M12 6v6l4 2"></path>
            </svg>
            Voting History
          </h2>
          {votingHistory.length > 0 ? (
            <ul style={styles.voteList}>
              {votingHistory.map((vote) => (
                <li key={vote._id} style={styles.voteItem}>
                  <div style={styles.voteInfo}>
                    <p style={styles.votedFor}>Voted for: {vote.candidateName || vote.candidateId}</p>
                    <p style={styles.voteTeam}>Team: {vote.teamName || vote.teamSlug}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={styles.voteDate}>
                      {new Date(vote.votedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <Link href={`/team/${vote.teamSlug}`} style={styles.viewBtn}>
                      View Team →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={styles.noVotes}>
              <p>You haven't voted in any elections yet.</p>
              <Link href="/" style={{ color: '#1a1a1a', fontWeight: 600 }}>
                Browse available teams →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

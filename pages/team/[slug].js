import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TeamPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const [team, setTeam] = useState(null);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/teams/${slug}`).then((r) => r.json()).then((d) => setTeam(d.team));
    fetch(`/api/teams/${slug}/voters`).then((r) => r.json()).then((d) => setVoters(d.voters || []));
  }, [slug]);

  async function vote(candidateId) {
    if (!session) return signIn();
    setLoading(true);
    const res = await fetch('/api/vote', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ teamSlug: slug, candidateId }) 
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) return alert(data.error);
    setVoters(data.voters);
    setVoted(true);
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      borderBottom: '1px solid #222',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backLink: {
      color: '#888',
      textDecoration: 'none',
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      transition: 'color 0.2s',
    },
    logo: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 700,
      textDecoration: 'none',
    },
    main: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '60px 40px',
    },
    teamHeader: {
      textAlign: 'center',
      marginBottom: 60,
    },
    teamName: {
      color: '#fff',
      fontSize: 48,
      fontWeight: 800,
      marginBottom: 12,
      letterSpacing: '-2px',
    },
    teamDescription: {
      color: '#888',
      fontSize: 18,
      maxWidth: 500,
      margin: '0 auto',
    },
    candidatesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 24,
      marginBottom: 60,
    },
    candidateCard: {
      backgroundColor: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: 16,
      padding: 32,
      transition: 'all 0.3s ease',
    },
    candidateImage: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      backgroundColor: '#222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 32,
      marginBottom: 20,
    },
    candidateName: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 8,
    },
    candidateBio: {
      color: '#888',
      fontSize: 15,
      lineHeight: 1.6,
      marginBottom: 20,
    },
    linkedinLink: {
      color: '#0077b5',
      textDecoration: 'none',
      fontSize: 14,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 24,
      transition: 'opacity 0.2s',
    },
    voteBtn: {
      width: '100%',
      padding: '14px 24px',
      backgroundColor: '#fff',
      color: '#000',
      border: 'none',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    voteBtnDisabled: {
      backgroundColor: '#333',
      color: '#666',
      cursor: 'not-allowed',
    },
    votersSection: {
      backgroundColor: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: 16,
      padding: 32,
    },
    votersTitle: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    votersList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    voterItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 0',
      borderBottom: '1px solid #222',
    },
    voterAvatar: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      color: '#666',
    },
    voterInfo: {
      flex: 1,
    },
    voterName: {
      color: '#fff',
      fontSize: 15,
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
    noVoters: {
      color: '#666',
      fontSize: 15,
      textAlign: 'center',
      padding: '40px 0',
    },
    loadingContainer: {
      minHeight: '100vh',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 18,
    },
  };

  if (!team) {
    return (
      <div style={styles.loadingContainer}>
        <div>Loading team...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Link 
          href="/" 
          style={styles.backLink}
          onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = '#888'}
        >
          ← Back to Teams
        </Link>
        <Link href="/" style={styles.logo}>
          VotePlatform
        </Link>
        <div style={{ width: 100 }}></div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Team Header */}
        <div style={styles.teamHeader}>
          <h1 style={styles.teamName}>{team.name}</h1>
          <p style={styles.teamDescription}>
            Choose your preferred candidate from the options below
          </p>
        </div>

        {/* Candidates Grid */}
        <div style={styles.candidatesGrid}>
          {team.candidates.map((candidate, index) => (
            <div 
              key={candidate.id} 
              style={styles.candidateCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#444';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#222';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.candidateImage}>
                {candidate.name.charAt(0).toUpperCase()}
              </div>
              <h3 style={styles.candidateName}>{candidate.name}</h3>
              <p style={styles.candidateBio}>{candidate.bio}</p>
              {candidate.linkedin && (
                <a 
                  href={candidate.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  style={styles.linkedinLink}
                  onMouseEnter={(e) => e.target.style.opacity = 0.7}
                  onMouseLeave={(e) => e.target.style.opacity = 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  View LinkedIn Profile
                </a>
              )}
              <button 
                onClick={() => vote(candidate.id)}
                disabled={loading || voted}
                style={{
                  ...styles.voteBtn,
                  ...((loading || voted) ? styles.voteBtnDisabled : {})
                }}
                onMouseEnter={(e) => {
                  if (!loading && !voted) e.target.style.backgroundColor = '#e5e5e5';
                }}
                onMouseLeave={(e) => {
                  if (!loading && !voted) e.target.style.backgroundColor = '#fff';
                }}
              >
                {loading ? 'Voting...' : voted ? '✓ Vote Submitted' : `Vote for ${candidate.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Voters Section */}
        <div style={styles.votersSection}>
          <h2 style={styles.votersTitle}>
            <span>👥</span>
            Voters ({voters.length})
          </h2>
          {voters.length > 0 ? (
            <ul style={styles.votersList}>
              {voters.map((voter) => (
                <li key={voter._id} style={styles.voterItem}>
                  <div style={styles.voterAvatar}>
                    {(voter.name || voter.userEmail || '?').charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.voterInfo}>
                    {voter.linkedin ? (
                      <a 
                        href={voter.linkedin} 
                        target="_blank" 
                        rel="noreferrer"
                        style={styles.voterName}
                        onMouseEnter={(e) => e.target.style.color = '#0077b5'}
                        onMouseLeave={(e) => e.target.style.color = '#fff'}
                      >
                        {voter.name || voter.userEmail}
                      </a>
                    ) : (
                      <span style={styles.voterName}>
                        {voter.name || voter.userEmail}
                      </span>
                    )}
                  </div>
                  {voter.linkedin && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077b5">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.noVoters}>No votes yet. Be the first to vote!</p>
          )}
        </div>
      </main>
    </div>
  );
}

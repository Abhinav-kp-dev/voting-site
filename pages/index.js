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

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#fafafa',
    },
    header: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    logo: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 500,
      opacity: 0.9,
      transition: 'opacity 0.2s',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      border: '2px solid #fff',
    },
    userName: {
      fontSize: 14,
      fontWeight: 500,
    },
    signOutBtn: {
      backgroundColor: 'transparent',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.3)',
      padding: '8px 16px',
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    hero: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '80px 40px',
      textAlign: 'center',
    },
    heroTitle: {
      fontSize: 56,
      fontWeight: 800,
      marginBottom: 16,
      letterSpacing: '-2px',
      lineHeight: 1.1,
    },
    heroSubtitle: {
      fontSize: 20,
      opacity: 0.7,
      fontWeight: 400,
      maxWidth: 500,
      margin: '0 auto',
    },
    main: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '60px 40px',
    },
    sectionTitle: {
      fontSize: 32,
      fontWeight: 700,
      marginBottom: 40,
      letterSpacing: '-1px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    teamsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: 24,
    },
    teamCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 32,
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #eee',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
    },
    teamName: {
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 8,
      color: '#000',
    },
    teamDescription: {
      fontSize: 15,
      color: '#666',
      marginBottom: 20,
    },
    teamMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      paddingTop: 20,
      borderTop: '1px solid #eee',
    },
    metaItem: {
      fontSize: 13,
      color: '#999',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    viewBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#000',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      marginTop: 20,
      border: 'none',
    },
    authPrompt: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 40,
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #eee',
      marginBottom: 40,
    },
    authTitle: {
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 12,
    },
    authText: {
      fontSize: 16,
      color: '#666',
      marginBottom: 24,
    },
    authButtons: {
      display: 'flex',
      gap: 16,
      justifyContent: 'center',
    },
    primaryBtn: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '14px 32px',
      borderRadius: 8,
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none',
      display: 'inline-block',
      border: 'none',
    },
    secondaryBtn: {
      backgroundColor: '#fff',
      color: '#000',
      padding: '14px 32px',
      borderRadius: 8,
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none',
      display: 'inline-block',
      border: '2px solid #000',
    },
    footer: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px',
      textAlign: 'center',
      marginTop: 60,
    },
    footerText: {
      fontSize: 14,
      opacity: 0.6,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>VotePlatform</div>
        <nav style={styles.nav}>
          {session ? (
            <div style={styles.userInfo}>
              {session.user.image && (
                <img src={session.user.image} alt="Profile" style={styles.avatar} />
              )}
              <Link href="/profile" style={{ ...styles.userName, textDecoration: 'none', color: '#fff' }}>
                {session.user.name || session.user.email}
              </Link>
              <button onClick={() => signOut()} style={styles.signOutBtn}>
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/candidate/login" style={styles.navLink}>Candidate Portal</Link>
              <Link href="/login" style={styles.navLink}>Sign In</Link>
              <Link href="/signup" style={{...styles.signOutBtn, textDecoration: 'none'}}>Get Started</Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Vote for Your Team</h1>
        <p style={styles.heroSubtitle}>
          Make your voice heard. Cast your vote and see real-time results.
        </p>
      </section>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Auth Prompt for non-logged in users */}
        {!session && status !== 'loading' && (
          <div style={styles.authPrompt}>
            <h2 style={styles.authTitle}>Ready to Vote?</h2>
            <p style={styles.authText}>Sign in with Google or LinkedIn to cast your vote</p>
            <div style={styles.authButtons}>
              <Link href="/login" style={styles.primaryBtn}>Sign In</Link>
              <Link href="/signup" style={styles.secondaryBtn}>Create Account</Link>
            </div>
            <p style={{ marginTop: 24, fontSize: 14, color: '#888' }}>
              Want to create your own voting team?{' '}
              <Link href="/candidate/signup" style={{ color: '#000', fontWeight: 600 }}>Register as Candidate</Link>
            </p>
          </div>
        )}

        {/* Teams Section */}
        <h2 style={styles.sectionTitle}>
          <span>🗳️</span> Active Teams
        </h2>
        
        {status === 'loading' ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading teams...</p>
        ) : (
          <div style={styles.teamsGrid}>
            {teams.map((team) => (
              <Link href={`/team/${team.slug}`} key={team.slug} style={styles.teamCard}>
                <h3 style={styles.teamName}>{team.name}</h3>
                <p style={styles.teamDescription}>
                  Vote for your preferred candidate from this team
                </p>
                <div style={styles.teamMeta}>
                  <span style={styles.metaItem}>
                    👥 {team.candidates?.length || 2} Candidates
                  </span>
                  <span style={styles.metaItem}>
                    ✓ {team.totalVotes || 0} Votes
                  </span>
                </div>
                <div style={styles.viewBtn}>
                  View Team →
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 VotePlatform. All rights reserved.</p>
      </footer>
    </div>
  );
}

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

// Simple confetti component
function Confetti({ active }) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (active) {
      const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3'];
      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 3,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [active]);
  
  if (!active || particles.length === 0) return null;
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map((p, i) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall 3s ease-out ${i * 0.02}s forwards`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function TeamPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const [team, setTeam] = useState(null);
  const [voters, setVoters] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [pendingCandidateId, setPendingCandidateId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/teams/${slug}`).then((r) => r.json()).then((d) => {
      setTeam(d.team);
      if (d.team?.deadline) {
        const deadline = new Date(d.team.deadline);
        if (deadline < new Date()) {
          setIsExpired(true);
        }
      }
    });
    fetchVoters();
  }, [slug]);
  
  const fetchVoters = async () => {
    const res = await fetch(`/api/teams/${slug}/voters`);
    const d = await res.json();
    setVoters(d.voters || []);
    setVoteCounts(d.voteCounts || {});
    setTotalVotes(d.totalVotes || 0);
  };

  // Countdown timer
  useEffect(() => {
    if (!team?.deadline) return;
    
    const updateTimer = () => {
      const deadline = new Date(team.deadline);
      const now = new Date();
      const diff = deadline - now;
      
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [team?.deadline]);

  // Auto-refresh votes every 30 seconds
  useEffect(() => {
    if (!slug) return;
    const interval = setInterval(fetchVoters, 30000);
    return () => clearInterval(interval);
  }, [slug]);

  async function vote(candidateId, linkedin = null) {
    if (!session) return signIn();
    if (isExpired) return alert('Voting has ended for this team.');
    
    setLoading(true);
    const res = await fetch('/api/vote', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ teamSlug: slug, candidateId, linkedin }) 
    });
    const data = await res.json();
    setLoading(false);
    
    if (data.requireLinkedin) {
      setPendingCandidateId(candidateId);
      setShowLinkedinModal(true);
      return;
    }
    
    if (data.expired) {
      setIsExpired(true);
      return alert('Voting deadline has passed.');
    }
    
    if (data.error) return alert(data.error);
    
    // Success! Show confetti and update voters
    setVoters(data.voters);
    setVoted(true);
    setShowLinkedinModal(false);
    setShowConfetti(true);
    
    // Refresh vote counts
    await fetchVoters();
    
    setTimeout(() => setShowConfetti(false), 4000);
  }

  async function submitLinkedinAndVote(e) {
    e.preventDefault();
    if (!linkedinUrl.includes('linkedin.com')) {
      alert('Please enter a valid LinkedIn URL');
      return;
    }
    await vote(pendingCandidateId, linkedinUrl);
  }

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getVotePercentage = (candidateId) => {
    if (totalVotes === 0) return 0;
    return Math.round(((voteCounts[candidateId] || 0) / totalVotes) * 100);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#FDF8F3',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      borderBottom: '1px solid #e8e0d8',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    backLink: {
      color: '#666',
      textDecoration: 'none',
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      transition: 'color 0.2s',
    },
    logo: {
      color: '#1a1a1a',
      fontSize: 20,
      fontWeight: 700,
      textDecoration: 'none',
    },
    shareBtn: {
      padding: '10px 20px',
      backgroundColor: copied ? '#22c55e' : '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      transition: 'all 0.2s',
    },
    main: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '60px 40px',
    },
    teamHeader: {
      textAlign: 'center',
      marginBottom: 40,
    },
    teamName: {
      color: '#1a1a1a',
      fontSize: 48,
      fontWeight: 800,
      marginBottom: 12,
      letterSpacing: '-2px',
    },
    teamDescription: {
      color: '#666',
      fontSize: 18,
      maxWidth: 600,
      margin: '0 auto 24px',
      lineHeight: 1.6,
    },
    deadlineBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 24px',
      backgroundColor: '#fff',
      border: '1px solid #e8e0d8',
      borderRadius: 50,
      marginTop: 16,
    },
    expiredBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 24px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 50,
      marginTop: 16,
      color: '#dc2626',
      fontWeight: 600,
    },
    timerDigit: {
      backgroundColor: '#1a1a1a',
      color: '#fff',
      padding: '6px 10px',
      borderRadius: 6,
      fontSize: 16,
      fontWeight: 700,
      fontFamily: 'monospace',
    },
    timerSeparator: {
      color: '#1a1a1a',
      fontWeight: 700,
      fontSize: 18,
    },
    resultsCard: {
      backgroundColor: '#fff',
      border: '1px solid #e8e0d8',
      borderRadius: 16,
      padding: 32,
      marginBottom: 40,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    resultsTitle: {
      color: '#1a1a1a',
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    resultItem: {
      marginBottom: 20,
    },
    resultHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    resultName: {
      fontSize: 16,
      fontWeight: 600,
      color: '#1a1a1a',
    },
    resultStats: {
      fontSize: 14,
      color: '#666',
    },
    progressBar: {
      height: 12,
      backgroundColor: '#f0ebe6',
      borderRadius: 6,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 6,
      transition: 'width 0.5s ease',
    },
    candidatesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 24,
      marginBottom: 40,
    },
    candidateCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e8e0d8',
      borderRadius: 16,
      padding: 32,
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    candidateImage: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      backgroundColor: '#f5f0eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 32,
      marginBottom: 20,
      color: '#1a1a1a',
    },
    candidateName: {
      color: '#1a1a1a',
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 8,
    },
    candidateBio: {
      color: '#666',
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
      backgroundColor: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    voteBtnDisabled: {
      backgroundColor: '#ccc',
      color: '#888',
      cursor: 'not-allowed',
    },
    votersSection: {
      backgroundColor: '#ffffff',
      border: '1px solid #e8e0d8',
      borderRadius: 16,
      padding: 32,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    votersTitle: {
      color: '#1a1a1a',
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
      borderBottom: '1px solid #e8e0d8',
    },
    voterAvatar: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#f5f0eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      color: '#1a1a1a',
    },
    voterInfo: {
      flex: 1,
    },
    voterName: {
      color: '#1a1a1a',
      fontSize: 15,
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
    noVoters: {
      color: '#888',
      fontSize: 15,
      textAlign: 'center',
      padding: '40px 0',
    },
    loadingContainer: {
      minHeight: '100vh',
      backgroundColor: '#FDF8F3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1a1a1a',
      fontSize: 18,
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 32,
      width: '100%',
      maxWidth: 420,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 15,
      color: '#666',
      marginBottom: 24,
      lineHeight: 1.5,
    },
    modalInput: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: '#fafafa',
      border: '1px solid #e0d8d0',
      borderRadius: 10,
      fontSize: 15,
      color: '#1a1a1a',
      boxSizing: 'border-box',
      marginBottom: 16,
      outline: 'none',
    },
    modalBtn: {
      width: '100%',
      padding: '14px 20px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: 12,
    },
    modalCancelBtn: {
      width: '100%',
      padding: '14px 20px',
      backgroundColor: 'transparent',
      color: '#666',
      border: '1px solid #e0d8d0',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 500,
      cursor: 'pointer',
    },
  };

  const progressColors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

  if (!team) {
    return (
      <div style={styles.loadingContainer}>
        <div>Loading team...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Confetti active={showConfetti} />
      
      {/* Header */}
      <header style={styles.header}>
        <Link 
          href="/" 
          style={styles.backLink}
          onMouseEnter={(e) => e.target.style.color = '#1a1a1a'}
          onMouseLeave={(e) => e.target.style.color = '#666'}
        >
          ← Back to Teams
        </Link>
        <Link href="/" style={styles.logo}>
          VotePlatform
        </Link>
        <button 
          onClick={copyLink}
          style={styles.shareBtn}
          onMouseEnter={(e) => { if (!copied) e.target.style.backgroundColor = '#333'; }}
          onMouseLeave={(e) => { if (!copied) e.target.style.backgroundColor = '#1a1a1a'; }}
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share
            </>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Team Header */}
        <div style={styles.teamHeader}>
          <h1 style={styles.teamName}>{team.name}</h1>
          <p style={styles.teamDescription}>
            {team.description || 'Choose your preferred candidate from the options below'}
          </p>
          
          {/* Deadline Timer */}
          {isExpired ? (
            <div style={styles.expiredBadge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Voting has ended
            </div>
          ) : timeLeft && (
            <div style={styles.deadlineBadge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span style={{ color: '#666', fontSize: 14, marginRight: 8 }}>Time remaining:</span>
              {timeLeft.days > 0 && (
                <>
                  <span style={styles.timerDigit}>{timeLeft.days}d</span>
                  <span style={styles.timerSeparator}>:</span>
                </>
              )}
              <span style={styles.timerDigit}>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span style={styles.timerSeparator}>:</span>
              <span style={styles.timerDigit}>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span style={styles.timerSeparator}>:</span>
              <span style={styles.timerDigit}>{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Live Results */}
        {totalVotes > 0 && (
          <div style={styles.resultsCard}>
            <h3 style={styles.resultsTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Live Results
              <span style={{ fontSize: 14, fontWeight: 400, color: '#666' }}>
                • {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
              </span>
            </h3>
            {team.candidates.map((candidate, index) => {
              const percentage = getVotePercentage(candidate.id);
              const count = voteCounts[candidate.id] || 0;
              return (
                <div key={candidate.id} style={styles.resultItem}>
                  <div style={styles.resultHeader}>
                    <span style={styles.resultName}>{candidate.name}</span>
                    <span style={styles.resultStats}>
                      {count} vote{count !== 1 ? 's' : ''} • {percentage}%
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${percentage}%`,
                        backgroundColor: progressColors[index % progressColors.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Candidates Grid */}
        <div style={styles.candidatesGrid}>
          {team.candidates.map((candidate, index) => {
            const percentage = getVotePercentage(candidate.id);
            const count = voteCounts[candidate.id] || 0;
            return (
              <div 
                key={candidate.id} 
                style={styles.candidateCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c9c1b9';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e0d8';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                }}
              >
                <div style={styles.candidateImage}>
                  {candidate.name.charAt(0).toUpperCase()}
                </div>
                <h3 style={styles.candidateName}>{candidate.name}</h3>
                {totalVotes > 0 && (
                  <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f8f5f1', borderRadius: 8, display: 'inline-block' }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: progressColors[index % progressColors.length] }}>
                      {percentage}%
                    </span>
                    <span style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>
                      ({count} vote{count !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
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
                  disabled={loading || voted || isExpired}
                  style={{
                    ...styles.voteBtn,
                    ...((loading || voted || isExpired) ? styles.voteBtnDisabled : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && !voted && !isExpired) e.target.style.backgroundColor = '#333';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && !voted && !isExpired) e.target.style.backgroundColor = '#1a1a1a';
                  }}
                >
                  {loading ? 'Voting...' : voted ? '✓ Vote Submitted' : isExpired ? 'Voting Closed' : `Vote for ${candidate.name}`}
                </button>
              </div>
            );
          })}
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
                  {voter.linkedin ? (
                    <a 
                      href={voter.linkedin} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        textDecoration: 'none',
                        flex: 1,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector('.voter-name').style.color = '#0077b5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector('.voter-name').style.color = '#1a1a1a';
                      }}
                    >
                      <div style={styles.voterAvatar}>
                        {(voter.name || voter.userEmail || '?').charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.voterInfo}>
                        <span className="voter-name" style={styles.voterName}>
                          {voter.name || voter.userEmail}
                        </span>
                        <div style={{ fontSize: 12, color: '#0077b5', marginTop: 2 }}>
                          View LinkedIn Profile →
                        </div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077b5">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  ) : (
                    <>
                      <div style={styles.voterAvatar}>
                        {(voter.name || voter.userEmail || '?').charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.voterInfo}>
                        <span style={styles.voterName}>
                          {voter.name || voter.userEmail}
                        </span>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                          No LinkedIn profile
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.noVoters}>No votes yet. Be the first to vote!</p>
          )}
        </div>
      </main>

      {/* LinkedIn Modal */}
      {showLinkedinModal && (
        <div style={styles.modalOverlay} onClick={() => setShowLinkedinModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#0077b5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <h2 style={styles.modalTitle}>Link Your LinkedIn</h2>
            </div>
            <p style={styles.modalSubtitle}>
              To ensure transparency, we require all voters to provide their LinkedIn profile. 
              Your profile will be visible to other voters.
            </p>
            <form onSubmit={submitLinkedinAndVote}>
              <input
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                style={styles.modalInput}
                required
                autoFocus
              />
              <button 
                type="submit" 
                style={styles.modalBtn}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit & Vote'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowLinkedinModal(false)}
                style={styles.modalCancelBtn}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

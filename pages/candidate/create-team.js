import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CreateTeam() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamSlug, setTeamSlug] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [votingDeadline, setVotingDeadline] = useState('');
  const [candidates, setCandidates] = useState([
    { id: '1', name: '', bio: '', linkedin: '' },
    { id: '2', name: '', bio: '', linkedin: '' }
  ]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/candidate/login');
    }
  }, [status, router]);

  // Auto-generate slug from team name
  useEffect(() => {
    const slug = teamName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setTeamSlug(slug);
  }, [teamName]);

  function updateCandidate(id, field, value) {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate
    if (!teamName || !teamSlug) {
      alert('Please enter a team name');
      return;
    }

    const validCandidates = candidates.filter(c => c.name && c.linkedin);
    if (validCandidates.length !== 2) {
      alert('Please fill in details for exactly 2 candidates (name and LinkedIn required)');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/candidate/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: teamName,
        slug: teamSlug,
        description: teamDescription,
        deadline: votingDeadline || null,
        candidates: validCandidates
      })
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
      return;
    }

    router.push('/candidate/dashboard');
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
    main: {
      maxWidth: 700,
      margin: '0 auto',
      padding: '40px',
    },
    pageTitle: {
      fontSize: 32,
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: 8,
    },
    pageSubtitle: {
      color: '#666',
      marginBottom: 40,
    },
    section: {
      backgroundColor: '#fff',
      border: '1px solid #e8e0d8',
      borderRadius: 16,
      padding: 32,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 600,
      color: '#1a1a1a',
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      display: 'block',
      marginBottom: 8,
      color: '#444',
      fontSize: 14,
      fontWeight: 500,
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: '#fafafa',
      border: '1px solid #e0d8d0',
      borderRadius: 10,
      fontSize: 15,
      color: '#1a1a1a',
      boxSizing: 'border-box',
      outline: 'none',
    },
    slugPreview: {
      marginTop: 8,
      fontSize: 13,
      color: '#888',
    },
    candidateCard: {
      backgroundColor: '#fafafa',
      border: '1px solid #e8e0d8',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    },
    candidateHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    candidateNumber: {
      fontSize: 14,
      fontWeight: 600,
      color: '#1a1a1a',
    },
    removeBtn: {
      background: 'none',
      border: 'none',
      color: '#dc2626',
      cursor: 'pointer',
      fontSize: 14,
    },
    addCandidateBtn: {
      width: '100%',
      padding: '14px 20px',
      backgroundColor: '#fff',
      border: '2px dashed #e0d8d0',
      borderRadius: 10,
      fontSize: 15,
      color: '#888',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    actions: {
      display: 'flex',
      gap: 16,
      justifyContent: 'flex-end',
    },
    cancelBtn: {
      padding: '14px 24px',
      backgroundColor: '#fff',
      border: '1px solid #e0d8d0',
      borderRadius: 10,
      fontSize: 15,
      color: '#666',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    submitBtn: {
      padding: '14px 32px',
      backgroundColor: '#1a1a1a',
      border: 'none',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      color: '#fff',
      cursor: 'pointer',
    },
  };

  if (status === 'loading') {
    return <div style={styles.container}><div style={{ padding: 40 }}>Loading...</div></div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link href="/candidate/dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </header>

      <main style={styles.main}>
        <h1 style={styles.pageTitle}>Create New Team</h1>
        <p style={styles.pageSubtitle}>Set up your voting team and add candidates</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Team Details</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Board of Directors Election"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>URL Slug</label>
              <input
                type="text"
                value={teamSlug}
                onChange={(e) => setTeamSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="board-election"
                style={styles.input}
                required
              />
              <p style={styles.slugPreview}>
                Your team will be accessible at: /team/{teamSlug || 'your-slug'}
              </p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Describe what this voting is about..."
                style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Voting Deadline <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></label>
              <input
                type="datetime-local"
                value={votingDeadline}
                onChange={(e) => setVotingDeadline(e.target.value)}
                style={styles.input}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p style={styles.slugPreview}>
                Leave empty for no deadline
              </p>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Candidates (2 Required)</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>Teams must have exactly 2 candidates</p>
            
            {candidates.map((candidate, index) => (
              <div key={candidate.id} style={styles.candidateCard}>
                <div style={styles.candidateHeader}>
                  <span style={styles.candidateNumber}>Candidate {index + 1}</span>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Name</label>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => updateCandidate(candidate.id, 'name', e.target.value)}
                    placeholder="Full name"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Bio / Description</label>
                  <input
                    type="text"
                    value={candidate.bio}
                    onChange={(e) => updateCandidate(candidate.id, 'bio', e.target.value)}
                    placeholder="Brief description or qualifications"
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={candidate.linkedin}
                    onChange={(e) => updateCandidate(candidate.id, 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/profile"
                    style={styles.input}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            <Link href="/candidate/dashboard" style={styles.cancelBtn}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

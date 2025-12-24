import { signIn, getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CandidateLogin() {
  const router = useRouter();
  const { error } = router.query;
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.role === 'candidate') {
        router.push('/candidate/dashboard');
      }
    });
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await signIn('credentials', { redirect: false, email, password, isCandidate: 'true' });
    setLoading(false);
    if (res?.error) alert('Login failed: ' + res.error);
    else window.location.href = '/candidate/dashboard';
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#FDF8F3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '48px 40px',
      borderRadius: '16px',
      border: '1px solid #e8e0d8',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    },
    badge: {
      display: 'inline-block',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 20,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    title: {
      color: '#1a1a1a',
      fontSize: '28px',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      color: '#666',
      fontSize: '15px',
      textAlign: 'center',
      marginBottom: '32px',
    },
    errorBox: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      color: '#dc2626',
      padding: '14px 16px',
      borderRadius: '10px',
      marginBottom: '24px',
      fontSize: '14px',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#444',
      fontSize: '14px',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: '#fafafa',
      border: '1px solid #e0d8d0',
      borderRadius: '10px',
      fontSize: '15px',
      color: '#1a1a1a',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    inputFocused: {
      borderColor: '#b8b0a8',
      backgroundColor: '#fff',
    },
    submitBtn: {
      width: '100%',
      padding: '14px 20px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px',
    },
    submitBtnDisabled: {
      backgroundColor: '#ccc',
      color: '#888',
      cursor: 'not-allowed',
    },
    signupText: {
      textAlign: 'center',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e8e0d8',
      color: '#888',
      fontSize: '14px',
    },
    signupLink: {
      color: '#1a1a1a',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px',
    },
    voterLink: {
      textAlign: 'center',
      marginTop: '16px',
      color: '#888',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center' }}>
          <span style={styles.badge}>Candidate Portal</span>
        </div>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to manage your teams</p>

        {error && (
          <div style={styles.errorBox}>
            {error === 'CredentialsSignin' ? 'Invalid email or password' : error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              required
              style={{
                ...styles.input,
                ...(focusedInput === 'email' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              required
              style={{
                ...styles.input,
                ...(focusedInput === 'password' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {})
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.signupText}>
          Don't have an account?
          <Link href="/candidate/signup" style={styles.signupLink}>
            Register as Candidate
          </Link>
        </p>

        <p style={styles.voterLink}>
          <Link href="/login" style={{ color: '#666', textDecoration: 'none' }}>
            ← Back to Voter Login
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CandidateSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.role === 'candidate') {
        router.push('/candidate/dashboard');
      }
    });
  }, [router]);

  async function handle(e) {
    e.preventDefault();
    setLoading(true);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const linkedin = e.target.linkedin.value;
    const organization = e.target.organization.value;
    
    const res = await fetch('/api/auth/candidate-signup', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ name, email, password, linkedin, organization }) 
    });
    
    const data = await res.json();
    setLoading(false);
    
    if (data.error) {
      alert('Signup failed: ' + data.error);
      return;
    }
    
    setSuccess(true);
    setTimeout(() => router.push('/candidate/login'), 2000);
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
    successBox: {
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      color: '#16a34a',
      padding: '24px',
      borderRadius: '12px',
      textAlign: 'center',
    },
    successTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    successText: {
      fontSize: '14px',
      opacity: 0.8,
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
    labelOptional: {
      color: '#888',
      fontWeight: '400',
      marginLeft: '4px',
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
    loginText: {
      textAlign: 'center',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e8e0d8',
      color: '#888',
      fontSize: '14px',
    },
    loginLink: {
      color: '#1a1a1a',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px',
    },
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 20 }}>✓</div>
          <div style={styles.successBox}>
            <h2 style={styles.successTitle}>Account Created!</h2>
            <p style={styles.successText}>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center' }}>
          <span style={styles.badge}>Candidate Portal</span>
        </div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register to create and manage voting teams</p>

        <form onSubmit={handle}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              required
              style={{
                ...styles.input,
                ...(focusedInput === 'name' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              placeholder="John Doe"
            />
          </div>

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
              minLength={6}
              style={{
                ...styles.input,
                ...(focusedInput === 'password' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Organization / Company
              <span style={styles.labelOptional}>(optional)</span>
            </label>
            <input
              type="text"
              name="organization"
              style={{
                ...styles.input,
                ...(focusedInput === 'organization' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('organization')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Your Company Inc."
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>LinkedIn Profile URL</label>
            <input
              type="url"
              name="linkedin"
              required
              style={{
                ...styles.input,
                ...(focusedInput === 'linkedin' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('linkedin')}
              onBlur={() => setFocusedInput(null)}
              placeholder="https://linkedin.com/in/yourprofile"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?
          <Link href="/candidate/login" style={styles.loginLink}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

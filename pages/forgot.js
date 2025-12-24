import { useState } from 'react';
import Link from 'next/link';

export default function Forgot() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  async function handle(e) {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    await fetch('/api/auth/forgot', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ email }) 
    });
    setLoading(false);
    setSent(true);
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    card: {
      backgroundColor: '#0a0a0a',
      padding: '48px 40px',
      borderRadius: '16px',
      border: '1px solid #222',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    logo: {
      width: '48px',
      height: '48px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      fontSize: '24px',
    },
    title: {
      color: '#ffffff',
      fontSize: '28px',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      color: '#888',
      fontSize: '15px',
      textAlign: 'center',
      marginBottom: '32px',
    },
    successBox: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      color: '#22c55e',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px',
    },
    successText: {
      margin: '0 0 8px 0',
      fontSize: '15px',
    },
    successNote: {
      margin: 0,
      fontSize: '13px',
      opacity: 0.8,
    },
    inputGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#ccc',
      fontSize: '14px',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: '#111',
      border: '1px solid #333',
      borderRadius: '10px',
      fontSize: '15px',
      color: '#fff',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    inputFocused: {
      borderColor: '#fff',
      backgroundColor: '#0a0a0a',
    },
    submitBtn: {
      width: '100%',
      padding: '14px 20px',
      backgroundColor: '#fff',
      color: '#000',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    submitBtnDisabled: {
      backgroundColor: '#333',
      color: '#666',
      cursor: 'not-allowed',
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '24px',
      color: '#888',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🔑</div>
        <h1 style={styles.title}>Forgot Password</h1>
        <p style={styles.subtitle}>
          {sent ? 'Check your email' : 'Enter your email to reset your password'}
        </p>

        {sent ? (
          <div>
            <div style={styles.successBox}>
              <p style={styles.successText}>
                Password reset instructions have been sent to your email.
              </p>
              <p style={styles.successNote}>
                <strong>Dev Note:</strong> Check server logs for the reset link.
              </p>
            </div>
            
            <Link 
              href="/login" 
              style={styles.backLink}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = '#888'}
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          <div>
            <form onSubmit={handle}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="you@example.com"
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'email' ? styles.inputFocused : {})
                  }}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  ...(loading ? styles.submitBtnDisabled : {})
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#e5e5e5')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#fff')}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <Link 
              href="/login" 
              style={styles.backLink}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = '#888'}
            >
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

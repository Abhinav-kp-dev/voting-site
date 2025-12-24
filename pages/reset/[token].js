import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

export default function Reset() {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  async function handle(e) {
    e.preventDefault();
    setLoading(true);
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/reset', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ token, password }) 
    });
    const data = await res.json();
    setLoading(false);
    
    if (data.error) {
      alert(data.error);
      return;
    }
    
    alert('Password reset successfully!');
    router.push('/login');
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
    inputGroup: {
      marginBottom: '20px',
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
      marginTop: '8px',
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
        <div style={styles.logo}>🔐</div>
        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>Enter your new password below</p>

        <form onSubmit={handle}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(focusedInput === 'password' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              name="confirmPassword" 
              type="password" 
              required 
              minLength={6}
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(focusedInput === 'confirm' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('confirm')}
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
            {loading ? 'Resetting...' : 'Reset Password'}
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
    </div>
  );
}

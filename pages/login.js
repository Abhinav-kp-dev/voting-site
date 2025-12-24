import { signIn, getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const { error } = router.query;
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    getSession().then(session => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await signIn('credentials', { redirect: false, email, password });
    setLoading(false);
    if (res?.error) alert('Login failed: ' + res.error);
    else window.location.href = '/';
  }

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: '/' });
    setLoading(false);
  };

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
    logo: {
      width: '48px',
      height: '48px',
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      fontSize: '24px',
      color: '#fff',
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
    oauthButton: {
      width: '100%',
      padding: '14px 20px',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'all 0.2s ease',
      marginBottom: '12px',
    },
    googleBtn: {
      backgroundColor: '#ffffff',
      color: '#000000',
      border: 'none',
    },
    linkedinBtn: {
      backgroundColor: '#fafafa',
      color: '#1a1a1a',
      border: '1px solid #e0d8d0',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '28px 0',
      color: '#999',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#e0d8d0',
    },
    dividerText: {
      padding: '0 16px',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
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
    forgotLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '20px',
      color: '#888',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🗳️</div>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to continue to VotePlatform</p>

        {error && (
          <div style={styles.errorBox}>
            {error === 'OAuthSignin' ? 'OAuth sign-in failed. Please try again.' : 
             error === 'CredentialsSignin' ? 'Invalid email or password.' : 
             error === 'OAuthCallback' ? 'OAuth callback error. Please try again.' :
             `Error: ${error}`}
          </div>
        )}

        {/* OAuth Buttons */}
        <button 
          onClick={() => handleOAuthSignIn('google')} 
          disabled={loading}
          style={{...styles.oauthButton, ...styles.googleBtn}}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        
        <button 
          onClick={() => handleOAuthSignIn('linkedin')} 
          disabled={loading}
          style={{...styles.oauthButton, ...styles.linkedinBtn}}
          onMouseEnter={(e) => {e.target.style.borderColor = '#fff'; e.target.style.transform = 'translateY(-1px)'}}
          onMouseLeave={(e) => {e.target.style.borderColor = '#333'; e.target.style.transform = 'translateY(0)'}}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Continue with LinkedIn
        </button>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
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
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(focusedInput === 'password' ? styles.inputFocused : {})
              }}
              onFocus={() => setFocusedInput('password')}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <Link href="/forgot" style={styles.forgotLink}>
          Forgot your password?
        </Link>

        <div style={styles.signupText}>
          Don't have an account?
          <Link href="/signup" style={styles.signupLink}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

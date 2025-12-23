import { signIn, getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const { error } = router.query;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 20 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: 40, 
        borderRadius: 10, 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        width: '100%', 
        maxWidth: 400 
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ color: '#333', marginBottom: 8, fontSize: 28 }}>Welcome Back</h1>
          <p style={{ color: '#666', margin: 0 }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ 
            color: '#721c24', 
            backgroundColor: '#f8d7da', 
            padding: 12, 
            borderRadius: 6, 
            marginBottom: 20,
            border: '1px solid #f5c6cb'
          }}>
            {error === 'OAuthSignin' ? 'OAuth sign-in failed' : 
             error === 'CredentialsSignin' ? 'Invalid email or password' : 
             `Error: ${error}`}
          </div>
        )}

        {/* OAuth Buttons */}
        <div style={{ marginBottom: 25 }}>
          <button 
            onClick={() => handleOAuthSignIn('google')} 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: 12, 
              backgroundColor: '#4285f4', 
              color: 'white', 
              border: 'none', 
              borderRadius: 6,
              fontSize: 16,
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            <span>🔍</span> Continue with Google
          </button>
          <button 
            onClick={() => handleOAuthSignIn('linkedin')} 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: 12, 
              backgroundColor: '#0077b5', 
              color: 'white', 
              border: 'none', 
              borderRadius: 6,
              fontSize: 16,
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            <span>💼</span> Continue with LinkedIn
          </button>
        </div>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 25, 
          color: '#999' 
        }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#e1e1e1' }}></div>
          <span style={{ padding: '0 15px', fontSize: 14 }}>or</span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#e1e1e1' }}></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: '500' }}>Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="Enter your email"
              style={{ 
                width: '100%', 
                padding: 12, 
                border: '2px solid #e1e1e1', 
                borderRadius: 6,
                fontSize: 16,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4285f4'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
            />
          </div>
          
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: '500' }}>Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="Enter your password"
              style={{ 
                width: '100%', 
                padding: 12, 
                border: '2px solid #e1e1e1', 
                borderRadius: 6,
                fontSize: 16,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4285f4'}
              onBlur={(e) => e.target.style.borderColor = '#e1e1e1'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: 12, 
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/forgot" style={{ color: '#007bff', textDecoration: 'none', fontSize: 14 }}>
            Forgot your password?
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 25, color: '#666' }}>
          <p style={{ margin: 0 }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if already logged in
    getSession().then(session => {
      if (session) {
        router.push('/');
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
    
    const res = await fetch('/api/auth/signup', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ name, email, password, linkedin }) 
    });
    
    const data = await res.json();
    setLoading(false);
    
    if (data.error) {
      alert('Signup failed: ' + data.error);
      return;
    }
    
    setSuccess(true);
    setTimeout(() => router.push('/login'), 2000);
  }

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: '/' });
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: 15, borderRadius: 5, marginBottom: 20 }}>
          <h2>Account Created Successfully!</h2>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

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
          <h1 style={{ color: '#333', marginBottom: 8, fontSize: 28 }}>Create Account</h1>
          <p style={{ color: '#666', margin: 0 }}>Join the voting platform</p>
        </div>

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

        {/* Signup Form */}
        <form onSubmit={handle}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: '500' }}>Full Name</label>
            <input 
              name="name" 
              type="text"
              required
              placeholder="Enter your full name"
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
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: '500' }}>Password</label>
            <input 
              name="password" 
              type="password" 
              required
              placeholder="Create a password"
              minLength={6}
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
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: '500' }}>LinkedIn Profile (Optional)</label>
            <input 
              name="linkedin" 
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
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
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 25, color: '#666' }}>
          <p style={{ margin: 0 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#4285f4', textDecoration: 'none', fontWeight: '500' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

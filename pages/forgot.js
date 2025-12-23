import { useState } from 'react';
import Link from 'next/link';

export default function Forgot() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
          <h1 style={{ color: '#333', marginBottom: 8, fontSize: 28 }}>Forgot Password</h1>
          <p style={{ color: '#666', margin: 0 }}>
            {sent ? 'Reset link sent!' : 'Enter your email to reset your password'}
          </p>
        </div>

        {sent ? (
          <div>
            <div style={{ 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              padding: 15, 
              borderRadius: 6, 
              marginBottom: 20,
              border: '1px solid #c3e6cb'
            }}>
              <p style={{ margin: 0 }}>
                Password reset instructions have been sent to your email.
              </p>
              <p style={{ margin: '10px 0 0', fontSize: 14 }}>
                <strong>Development Note:</strong> Check server logs for the reset link.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Link href="/login" style={{ 
                color: '#007bff', 
                textDecoration: 'none', 
                fontWeight: '500' 
              }}>
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handle}>
              <div style={{ marginBottom: 25 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 6, 
                  color: '#333', 
                  fontWeight: '500' 
                }}>
                  Email Address
                </label>
                <input 
                  name="email" 
                  type="email" 
                  required
                  placeholder="Enter your email address"
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    border: '2px solid #e1e1e1', 
                    borderRadius: 6,
                    fontSize: 16,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 25 }}>
              <Link href="/login" style={{ 
                color: '#007bff', 
                textDecoration: 'none',
                fontSize: 14
              }}>
                ← Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import EstimationTool from './components/EstimationTool';
import Dashboard from './components/Dashboard';
import { authService } from './services/auth.service';
import { CheckCircle, XCircle, X } from 'lucide-react';

function App() {
  const [verificationState, setVerificationState] = useState({ state: 'idle', message: null });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    // Check for email verification token
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (token) {
      setVerificationState({ state: 'loading', message: 'Verifying your email...' });
      
      authService.verifyEmail(token)
        .then(res => {
          setVerificationState({ state: 'success', message: res.message || 'Email verified successfully! You can now log in.' });
        })
        .catch(err => {
          setVerificationState({ state: 'error', message: err.message || 'Verification failed. Please request a new link.' });
        })
        .finally(() => {
          // Remove token from URL
          window.history.replaceState(null, '', window.location.pathname);
        });
    } else if (window.location.hash) {
      // Clear any hash routing to ensure we always start at the Hero text when refreshing
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-wrapper" style={{ position: 'relative' }}>
      
      {verificationState.state !== 'idle' && verificationState.state !== 'loading' && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: verificationState.state === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${verificationState.state === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: verificationState.state === 'success' ? '#166534' : '#991b1b',
          padding: '1rem 1.5rem',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          animation: 'fade-in-down 0.3s ease-out forwards'
        }}>
          {verificationState.state === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{verificationState.message}</span>
          <button 
            onClick={() => setVerificationState({ state: 'idle', message: null })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '1rem', color: 'inherit', opacity: 0.7 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <Navigation isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <>
          <main>
            <Hero />
            <Features />
            <EstimationTool />
          </main>
          <footer style={{
            padding: '6rem 0 3rem',
            borderTop: '1px solid rgba(15, 118, 110, 0.1)',
            textAlign: 'center',
            background: 'transparent'
          }}>
            <div className="container">
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Outfit', marginBottom: '1.5rem', color: '#1e293b' }}>
                Design<span style={{ color: '#0f766e' }}>Estimator</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Reducing design costing time from 3 days to 3 seconds. 
                © 2026 Design Cost Estimation Tool. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', fontSize: '0.85rem' }}>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact Support</a>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;

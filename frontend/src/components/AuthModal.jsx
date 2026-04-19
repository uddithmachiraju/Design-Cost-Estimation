import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Shield } from 'lucide-react';
import { authService } from '../services/auth.service';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setFormData({
        username: '',
        fullName: '',
        email: '',
        password: ''
      });
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await authService.login(formData.email, formData.password);
        if (res.access_token) {
          onAuthSuccess();
          onClose();
        }
      } else {
        await authService.register(formData.username, formData.fullName, formData.email, formData.password);
        setMode('verification');
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          width: '90%',
          maxWidth: '550px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(15, 118, 110, 0.1)',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: '#f0fdfa', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Shield color="#0f766e" size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>
            {mode === 'login' ? 'Welcome Back' : mode === 'verification' ? 'Check Your Email' : 'Create Account'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {mode === 'login' ? 'Log in to access your estimation dashboard.' : mode === 'verification' ? 'We have sent a verification link to your email. Please verify your account before logging in.' : 'Sign up to generate precision manufacturing quotes.'}
          </p>
        </div>

        {mode === 'verification' ? (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ padding: '1rem', background: '#f0fdf4', color: '#166534', borderRadius: '0.5rem', fontWeight: 500, marginBottom: '1.5rem' }}>
              Registration successful! Please check your inbox and verify your email address.
            </div>
            <button 
              onClick={() => { setMode('login'); setError(null); }}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: '#0f766e',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.2)'
              }}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User color="#94a3b8" size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' }}>@</span>
                  <input 
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
                    placeholder="johndoe123"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail color="#94a3b8" size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
                placeholder="developer@example.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock color="#94a3b8" size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: error.includes('successful') ? '#f0fdf4' : '#fef2f2', color: error.includes('successful') ? '#166534' : '#991b1b', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem',
              marginTop: '0.5rem',
              backgroundColor: '#0f766e',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s',
              boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.2)'
            }}
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        )}

        {mode !== 'verification' && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0f766e',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0
            }}
          >
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

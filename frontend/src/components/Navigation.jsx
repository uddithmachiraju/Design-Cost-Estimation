import React, { useState, useEffect } from 'react';
import { Layout, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import { authService } from '../services/auth.service';

const Navigation = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <>
      <nav style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        background: isAuthenticated ? 'white' : 'transparent',
        borderBottom: isAuthenticated ? '1px solid #e2e8f0' : 'none',
        padding: isAuthenticated ? '1.5rem 2rem' : '2rem 10%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'Outfit'
          }}>
            <Layout color="#0f766e" strokeWidth={2.5} size={28} />
            <span style={{ color: '#1e293b' }}>Fast<span style={{ color: '#0f766e' }}>Quote</span></span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            {!isAuthenticated && (
              <>
                <a href="#features" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
                <a href="#demo" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>How it Works</a>
                
                <div style={{ width: '1px', height: '24px', background: '#cbd5e1', margin: '0 -0.5rem' }} />
              </>
            )}

            {isAuthenticated ? (
              <>
                <a href="#dashboard" style={{ color: '#0f766e', textDecoration: 'none' }}>Dashboard</a>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    background: 'none', 
                    border: 'none', 
                    color: '#64748b', 
                    fontWeight: 600, 
                    cursor: 'pointer' 
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => openAuth('login')}
                  style={{ background: 'none', border: 'none', color: '#1e293b', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Log In
                </button>
                <button 
                  onClick={() => openAuth('register')}
                  style={{ 
                    background: '#0f766e', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.6rem 1.25rem', 
                    borderRadius: '2rem', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.2)'
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
        onAuthSuccess={() => setIsAuthenticated(true)} 
      />
    </>
  );
};

export default Navigation;

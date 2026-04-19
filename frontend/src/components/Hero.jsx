import React from 'react';
import { ArrowRight, Drill, Cpu, Zap } from 'lucide-react';
import AnimatedSchematic from './AnimatedSchematic';

const Hero = () => {
  return (
    <section className="animate-fade-in split-hero-container">
      <div className="split-hero-content">
        <h1 style={{
          fontSize: '4.5rem',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
          color: '#0f172a'
        }}>
          Transform <br />
          Estimation from <br />
          <span style={{ color: 'var(--accent-primary)' }}>Days to Seconds</span>
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          whiteSpace: 'nowrap',
          fontWeight: 500
        }}>
          Estimate manufacturing costs for 2D designs.
        </p>

        <div>
          <button className="btn-primary" style={{ padding: '1.1rem 2.8rem', fontSize: '1.1rem' }}>
            Discover <ArrowRight size={20} />
          </button>
        </div>

        <div className="hero-features-row">
          <div className="hero-feature-item">
            <div className="hero-feature-icon">
              <Zap size={32} color="#0f766e" strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.1rem' }}>Real-time</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Instant<br />calculations</p>
            </div>
          </div>
          <div className="hero-feature-item">
            <div className="hero-feature-icon">
              <Drill size={32} color="#0f766e" strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.1rem' }}>Accurate</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Production-grade<br />tolerances</p>
            </div>
          </div>
          <div className="hero-feature-item">
            <div className="hero-feature-icon">
              <Cpu size={32} color="#0f766e" strokeWidth={1.5} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.1rem' }}>AI Parsing</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Smart geometric<br />extraction</p>
            </div>
          </div>
        </div>
      </div>

      <div className="split-hero-image-wrapper">
        <AnimatedSchematic />
      </div>
    </section>
  );
};

export default Hero;

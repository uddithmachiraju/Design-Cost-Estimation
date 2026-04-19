import React, { useState, useEffect } from 'react';
import { Play, Pause, Layers, Eye, RotateCw } from 'lucide-react';

const DrawingArea = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [activeAngle, setActiveAngle] = useState(0);

  // Array of angles to highlight
  const angles = [
    { id: 0, name: 'Top Face', color: '#3b82f6', description: 'Analyze surface finish requirements.' },
    { id: 1, name: 'Side Fillet', color: '#10b981', description: 'Evaluate milling paths and costs.' },
    { id: 2, name: 'Bottom Mount', color: '#f59e0b', description: 'Calculate material waste volume.' },
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setRotation(r => (r + 1) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', height: '100%', minHeight: '500px' }}>
      {/* 3D Canvas Mockup Container */}
      <div style={{ 
        flex: 1, 
        background: '#f8fafc',
        borderRadius: '1rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Graph Paper Background overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />
        
        {/* Animated Object Mockup */}
        <div style={{
           position: 'relative',
           width: '240px',
           height: '240px',
           transformStyle: 'preserve-3d',
           transform: `perspective(800px) rotateX(60deg) rotateZ(${rotation}deg)`,
           transition: isPlaying ? 'none' : 'transform 0.5s ease-out'
        }}>
           {/* Base Plate */}
           <div style={{
             position: 'absolute', width: '200px', height: '200px', top: '20px', left: '20px',
             background: activeAngle === 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(203, 213, 225, 0.3)',
             border: `2px solid ${activeAngle === 0 ? '#3b82f6' : '#94a3b8'}`,
             transform: 'translateZ(0)',
             boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)'
           }} />
           
           {/* Cylinder / Hub */}
           <div style={{
             position: 'absolute', width: '100px', height: '100px', top: '70px', left: '70px',
             background: activeAngle === 1 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(203, 213, 225, 0.4)',
             border: `2px solid ${activeAngle === 1 ? '#10b981' : '#64748b'}`,
             borderRadius: '50%',
             transform: 'translateZ(60px)',
             boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
           }} />

           {/* Mounting Holes */}
           {[ [30,30], [30,170], [170,30], [170,170] ].map((pos, i) => (
             <div key={i} style={{
               position: 'absolute', width: '20px', height: '20px', top: pos[0] - 10, left: pos[1] - 10,
               background: activeAngle === 2 ? 'rgba(245, 158, 11, 0.6)' : '#fff',
               border: `2px solid ${activeAngle === 2 ? '#f59e0b' : '#94a3b8'}`,
               borderRadius: '50%',
               transform: 'translateZ(0)'
             }} />
           ))}
        </div>

        {/* Floating Controls */}
        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          padding: '0.75rem',
          borderRadius: '2rem',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f766e', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '1.5rem', cursor: 'pointer', fontWeight: 600 }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Pause' : 'Animate'}
          </button>
          <button 
            onClick={() => { setIsPlaying(false); setRotation(0); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e2e8f0', color: '#475569', border: 'none', padding: '0.5rem 1rem', borderRadius: '1.5rem', cursor: 'pointer', fontWeight: 600 }}
          >
            <RotateCw size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Angle Data / Sidebar */}
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#1e293b', fontWeight: 700, margin: 0 }}>Analysis View</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
          Select an angle below to visualize specific machining costs and requirements.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {angles.map((angle) => (
            <button
              key={angle.id}
              onClick={() => setActiveAngle(angle.id)}
              style={{
                textAlign: 'left',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                border: `2px solid ${activeAngle === angle.id ? angle.color : '#e2e8f0'}`,
                background: activeAngle === angle.id ? `${angle.color}10` : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ color: activeAngle === angle.id ? angle.color : '#334155' }}>
                  {angle.name}
                </strong>
                <Eye size={16} color={activeAngle === angle.id ? angle.color : '#94a3b8'} />
              </div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.4 }}>
                {angle.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawingArea;

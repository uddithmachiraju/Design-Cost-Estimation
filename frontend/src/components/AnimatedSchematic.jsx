import React from 'react';

const BaseSvg = ({ children, delayOffset = 0 }) => (
  <div className="schematic-item-wrapper" style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="100%" height="100%" viewBox="-50 -50 750 700" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
        </marker>
        <marker id="arrow-reverse" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 10 0 L 0 5 L 10 10 z" fill="#64748b" />
        </marker>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="-50" y="-50" width="750" height="700" fill="url(#grid)" className="animate-fade-in" style={{ animationDelay: `${delayOffset}s`, opacity: 0.5 }} />
      <g stroke="#94a3b8" strokeWidth="1" strokeDasharray="5 5" className="animate-fade-in" style={{ animationDelay: `${delayOffset}s` }}>
        <line x1="-50" y1="300" x2="700" y2="300" />
        <line x1="300" y1="-50" x2="300" y2="650" />
      </g>
      {React.Children.map(children, child => React.cloneElement(child, { delayOffset }))}
    </svg>
  </div>
);

const GearSchematic = ({ delayOffset = 0 }) => (
  <BaseSvg delayOffset={delayOffset}>
    <g style={{ transformOrigin: '300px 300px' }}>
      <circle cx="300" cy="300" r="160" fill="none" stroke="#0f766e" strokeWidth="2.5" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="300" cy="300" r="180" fill="none" stroke="#0f766e" strokeWidth="1" strokeDasharray="10 6" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      {[...Array(16)].map((_, i) => (
        <path key={i} d="M 285 140 L 290 120 L 310 120 L 315 140" fill="none" stroke="#0f766e" strokeWidth="2" transform={`rotate(${i * 22.5} 300 300)`} className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      ))}
      <circle cx="300" cy="300" r="90" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="300" cy="300" r="40" fill="none" stroke="#0f766e" strokeWidth="2.5" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="300" cy="300" r="65" fill="none" stroke="#0f766e" strokeWidth="0.75" strokeDasharray="4 4" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <rect x="294" y="250" width="12" height="15" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx="300" cy="210" r="12" fill="none" stroke="#0f766e" strokeWidth="1.5" transform={`rotate(${i * 60} 300 300)`} className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      ))}
    </g>
    <g>
      <line x1="285" y1="120" x2="285" y2="50" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="315" y1="120" x2="315" y2="50" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="285" y1="60" x2="315" y2="60" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" markerEnd="url(#arrow)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <text x="300" y="50" fill="#334155" fontSize="12" textAnchor="middle" fontWeight="600" fontFamily="monospace" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>W 20.0</text>
      
      <line x1="480" y1="300" x2="560" y2="300" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="460" y1="140" x2="560" y2="140" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="540" y1="140" x2="540" y2="300" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" markerEnd="url(#arrow)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <text x="550" y="220" fill="#334155" fontSize="13" fontWeight="600" fontFamily="monospace" transform="rotate(-90 550 220)" textAnchor="middle" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>Ø 160.0 H7</text>

      <line x1="120" y1="300" x2="40" y2="300" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="120" y1="120" x2="40" y2="120" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="60" y1="120" x2="60" y2="300" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" markerEnd="url(#arrow)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <text x="50" y="210" fill="#334155" fontSize="13" fontWeight="600" fontFamily="monospace" transform="rotate(-90 50 210)" textAnchor="middle" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>Ø 180.0 PCD</text>
      
      <g transform="translate(300, 300)">
        <line x1="28" y1="28" x2="200" y2="200" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <line x1="200" y1="200" x2="260" y2="200" stroke="#64748b" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <text x="205" y="195" fill="#334155" fontSize="12" fontWeight="600" fontFamily="monospace" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>Ø 40.0 +0.02</text>
      </g>
      <g transform="translate(300, 300)">
        <line x1="0" y1="-90" x2="-100" y2="-210" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <line x1="-100" y1="-210" x2="-180" y2="-210" stroke="#64748b" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <text x="-175" y="-216" fill="#334155" fontSize="12" fontWeight="600" fontFamily="monospace" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>6x M12 x 1.5</text>
      </g>
    </g>
  </BaseSvg>
);

const WrenchSchematic = ({ delayOffset = 0 }) => (
  <BaseSvg delayOffset={delayOffset}>
    <g>
      {/* Main Single Path Outline */}
      <path d="M 284 105 L 284 140 A 16 16 0 0 0 316 140 L 316 105 A 37 37 0 0 1 312 175 Q 308 300 312 425 A 37 37 0 0 1 316 495 L 316 460 A 16 16 0 0 0 284 460 L 284 495 A 37 37 0 0 1 288 425 Q 292 300 288 175 A 37 37 0 0 1 284 105 Z" fill="none" stroke="#0f766e" strokeWidth="2.5" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      
      {/* Handle Inset Slot */}
      <rect x="295" y="220" width="10" height="160" rx="5" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />

      {/* Decorative center markings */}
      <text x="300" y="235" fill="#0f766e" fontSize="12" fontWeight="700" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 300 235)" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>17</text>
      <text x="300" y="365" fill="#0f766e" fontSize="12" fontWeight="700" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 300 365)" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>13</text>

      {/* Cross Section A-A at bottom */}
      <g transform="translate(0, 30)">
        <rect x="240" y="520" width="120" height="10" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        {/* Intricate web detailing for the I-beam cross section */}
        <line x1="295" y1="520" x2="295" y2="530" stroke="#0f766e" strokeWidth="2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <line x1="305" y1="520" x2="305" y2="530" stroke="#0f766e" strokeWidth="2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <line x1="270" y1="523" x2="330" y2="523" stroke="#0f766e" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <line x1="270" y1="527" x2="330" y2="527" stroke="#0f766e" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      </g>
    </g>

    <g>
      {/* Left Callout - Outer Head */}
      <line x1="120" y1="140" x2="40" y2="140" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="120" y1="120" x2="120" y2="160" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="120" y1="140" x2="263" y2="140" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <text x="50" y="210" fill="#334155" fontSize="13" fontWeight="600" fontFamily="monospace" transform="rotate(-90 50 210)" textAnchor="middle" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>R 37.0 HEAD</text>


      {/* Top Gap Dimensions */}
      <line x1="284" y1="80" x2="284" y2="50" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="316" y1="80" x2="316" y2="50" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="284" y1="65" x2="316" y2="65" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" markerEnd="url(#arrow)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <text x="300" y="55" fill="#334155" fontSize="12" fontWeight="600" fontFamily="monospace" textAnchor="middle" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>17.0</text>

      {/* Overall Length */}
      <line x1="350" y1="105" x2="520" y2="105" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="350" y1="495" x2="520" y2="495" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="500" y1="105" x2="500" y2="495" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" markerEnd="url(#arrow)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <text x="510" y="300" fill="#334155" fontSize="13" fontWeight="600" fontFamily="monospace" transform="rotate(-90 510 300)" textAnchor="middle" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>OVL 110.0</text>

      {/* Section A-A text */}
      <text x="300" y="590" fill="#334155" fontSize="14" fontWeight="600" fontFamily="monospace" textAnchor="middle" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>SECTION A-A</text>
    </g>
  </BaseSvg>
);

const HingeSchematic = ({ delayOffset = 0 }) => (
  <BaseSvg delayOffset={delayOffset}>
    <g>
      {/* Left Plate */}
      <rect x="140" y="200" width="160" height="200" fill="none" stroke="#0f766e" strokeWidth="2.5" rx="5" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      {/* Right Plate */}
      <rect x="300" y="200" width="160" height="200" fill="none" stroke="#0f766e" strokeWidth="2.5" rx="5" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      
      {/* Pin & Knuckles */}
      <rect x="280" y="190" width="40" height="220" fill="none" stroke="#0f766e" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <rect x="290" y="200" width="20" height="40" fill="none" stroke="#0f766e" strokeWidth="2.5" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <rect x="290" y="240" width="20" height="40" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeDasharray="3 3" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <rect x="290" y="280" width="20" height="40" fill="none" stroke="#0f766e" strokeWidth="2.5" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <rect x="290" y="320" width="20" height="40" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeDasharray="3 3" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <rect x="290" y="360" width="20" height="40" fill="none" stroke="#0f766e" strokeWidth="2.5" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />

      {/* Holes */}
      <circle cx="200" cy="240" r="15" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="200" cy="300" r="15" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="200" cy="360" r="15" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="400" cy="240" r="15" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="400" cy="300" r="15" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="400" cy="360" r="15" fill="none" stroke="#0f766e" strokeWidth="2" className="draw-path-fast" style={{ animationDelay: `${delayOffset}s` }} />
      
      {/* Countersinks */}
      <circle cx="200" cy="240" r="22" fill="none" stroke="#0f766e" strokeWidth="1" strokeDasharray="4 2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="200" cy="300" r="22" fill="none" stroke="#0f766e" strokeWidth="1" strokeDasharray="4 2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="200" cy="360" r="22" fill="none" stroke="#0f766e" strokeWidth="1" strokeDasharray="4 2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="400" cy="240" r="22" fill="none" stroke="#0f766e" strokeWidth="1" strokeDasharray="4 2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="400" cy="300" r="22" fill="none" stroke="#0f766e" strokeWidth="1" strokeDasharray="4 2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <circle cx="400" cy="360" r="22" fill="none" stroke="#0f766e" strokeWidth="1" strokeDasharray="4 2" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
    </g>

    <g>
      {/* Hole Spacing Width Dim */}
      <line x1="200" y1="180" x2="200" y2="120" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="400" y1="180" x2="400" y2="120" stroke="#94a3b8" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <line x1="200" y1="140" x2="400" y2="140" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" markerEnd="url(#arrow)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
      <text x="300" y="130" fill="#334155" fontSize="13" textAnchor="middle" fontWeight="600" fontFamily="monospace" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>W 200.0 DIST</text>
      
      {/* Center Pin Callout */}
      <g transform="translate(300, 300)">
        <line x1="0" y1="-80" x2="100" y2="-180" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <line x1="100" y1="-180" x2="160" y2="-180" stroke="#64748b" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <text x="165" y="-185" fill="#334155" fontSize="12" fontWeight="600" fontFamily="monospace" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>Ø 20.0 PIN</text>
      </g>
      
      <g transform="translate(300, 300)">
        <line x1="-122" y1="60" x2="-200" y2="120" stroke="#64748b" strokeWidth="1" markerStart="url(#arrow-reverse)" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <line x1="-200" y1="120" x2="-260" y2="120" stroke="#64748b" strokeWidth="1" className="draw-path" style={{ animationDelay: `${delayOffset}s` }} />
        <text x="-255" y="115" fill="#334155" fontSize="12" fontWeight="600" fontFamily="monospace" className="dim-fade-in" style={{ animationDelay: `${delayOffset}s` }}>6x Ø 30.0 COUNTERSINK</text>
      </g>
    </g>
  </BaseSvg>
);

const AnimatedSchematicFeed = () => {
  return (
    <div className="scrolling-feed-container">
      <div className="scrolling-feed-track">
         <GearSchematic delayOffset={-1.25} />
         <WrenchSchematic delayOffset={-11.25} />
         <HingeSchematic delayOffset={-6.25} />
         
         {/* DUPLICATE for infinite loop */}
         <GearSchematic delayOffset={-1.25} />
         <WrenchSchematic delayOffset={-11.25} />
         <HingeSchematic delayOffset={-6.25} />
      </div>
    </div>
  );
};

export default AnimatedSchematicFeed;

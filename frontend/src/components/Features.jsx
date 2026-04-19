import { Cpu, Settings, Zap, FileUp } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Cpu size={28} color="#0f766e" />,
      title: "Motor Costing",
      description: "Instantly estimate costs for AC/DC motors, servo drives, and custom windings based on raw material costs."
    },
    {
      icon: <Settings size={28} color="#0f766e" />,
      title: "Mechanical Parts",
      description: "From simple gears to complex mechanical assemblies, our algorithms handle thousands of variables."
    },
    {
      icon: <Zap size={28} color="#0f766e" />,
      title: "Real-time Processing",
      description: "Why wait days for a quote? Get accurate, production-level costing in under 5 seconds."
    },
    {
      icon: <FileUp size={28} color="#0f766e" />,
      title: "Market Synced",
      description: "Our database syncs with global market prices for steel, copper, and electronics every hour."
    }
  ];

  return (
    <section id="features" style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Engineered for <span className="gradient-text">Precision</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginInline: 'auto' }}>
            Built specifically for mechanical engineers and procurement teams to eliminate the bottleneck of cost estimation.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ marginBottom: '1.5rem', background: 'rgba(15, 118, 110, 0.05)', display: 'inline-flex', padding: '1rem', borderRadius: '15px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

import React from 'react';
import { DollarSign, Box, Clock, AlertTriangle, TrendingDown, Plus, Upload, UploadCloud, RefreshCw, Zap } from 'lucide-react';

const OverviewTab = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {[
          { title: 'Total Estimated Cost', value: '$84,500.00', period: 'This Month', icon: DollarSign, color: '#3b82f6', bg: '#eff6ff' },
          { title: 'Components Estimated', value: '142', period: 'This Month', icon: Box, color: '#10b981', bg: '#ecfdf5' },
          { title: 'Pending Estimations', value: '8', period: 'Requires Review', icon: Clock, color: '#f59e0b', bg: '#fffbeb' },
          { title: 'High-Cost Alerts', value: '3', period: 'Unusual Pricing', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
          { title: 'Savings Identified', value: '$12,400.00', period: 'Using AI suggestions', icon: TrendingDown, color: '#8b5cf6', bg: '#f5f3ff' },
        ].map((stat, i) => (
          <div key={i} style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</span>
              <div style={{ padding: '0.5rem', background: stat.bg, borderRadius: '0.5rem', color: stat.color }}>
                <stat.icon size={20} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>{stat.period}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 5. Smart Insights */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', border: '1px solid #99f6e4', borderRadius: '1rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, pointerEvents: 'none' }}>
              <Zap size={120} color="#0f766e" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, marginBottom: '1.25rem' }}>
              <Zap size={20} /> AI Smart Insights
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '0.75rem' }}>
                <div style={{ color: '#f59e0b', marginTop: '2px' }}><AlertTriangle size={18} /></div>
                <div>
                  <strong style={{ color: '#1e293b', display: 'block', fontSize: '0.95rem' }}>Component Housing_X21 is 18% more expensive than historical average.</strong>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Consider reviewing the side pocket milling tolerances.</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '0.75rem' }}>
                <div style={{ color: '#10b981', marginTop: '2px' }}><TrendingDown size={18} /></div>
                <div>
                  <strong style={{ color: '#1e293b', display: 'block', fontSize: '0.95rem' }}>Switching Base_Plate to Aluminum 6061 reduces cost by 12%.</strong>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Material strength requirements are still met with this substitution.</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '0.75rem' }}>
                <div style={{ color: '#3b82f6', marginTop: '2px' }}><RefreshCw size={18} /></div>
                <div>
                  <strong style={{ color: '#1e293b', display: 'block', fontSize: '0.95rem' }}>Supplier "Protolabs" offers better pricing for CNC Steel.</strong>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>You could save $1,250 on your outstanding quotes.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Recent Activity Placeholder */}
          <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Recent Estimations</h3>
               <button style={{ background: 'none', border: 'none', color: '#0f766e', fontWeight: 600, cursor: 'pointer' }}>View All</button>
             </div>
             {/* We will leave this simple, detailed version in the Estimations tab */}
             <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
               Check the <strong>Estimations</strong> tab for a full table view.
             </div>
          </div>

        </div>

        {/* Right Column: 4. Quick Actions Panel */}
        <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', height: 'max-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #0f766e', background: '#0f766e', color: 'white', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}>
              <Plus size={18} /> New Cost Estimation
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}>
              <Upload size={18} color="#475569" /> Upload CAD / Drawing
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}>
              <UploadCloud size={18} color="#475569" /> Bulk Estimation (CSV)
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}>
              <RefreshCw size={18} color="#475569" /> Recalculate Material Prices
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewTab;

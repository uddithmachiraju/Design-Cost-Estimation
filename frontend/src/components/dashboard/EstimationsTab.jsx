import React, { useState, useEffect } from 'react';
import { Edit2, FileText, Download, MoreVertical, Search, Filter, Plus } from 'lucide-react';
import { estimationService } from '../../services/estimation.service';

const EstimationsTab = () => {
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstimations = async () => {
      try {
        setLoading(true);
        const data = await estimationService.getAllEstimations();
        const formattedData = data.map(est => ({
          id: est.estimation_code,
          name: est.component_name,
          cost: `$${parseFloat(est.total_cost).toFixed(2)}`,
          material: est.material || 'N/A',
          process: est.process || 'N/A',
          // capitalize the first letter of status since it comes back as lowercase e.g. "approved"
          status: est.estimation_status.charAt(0).toUpperCase() + est.estimation_status.slice(1),
          // format date to YYYY-MM-DD
          date: new Date(est.created_at).toISOString().split('T')[0]
        }));
        setEstimations(formattedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch estimations', err);
        setError('Failed to load estimations.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstimations();
  }, []);

  const getStatusColor = (status) => {
    switch((status || '').toLowerCase()) {
      case 'approved': return { bg: '#dcfce7', color: '#166534' };
      case 'draft': return { bg: '#f1f5f9', color: '#475569' };
      case 'final': return { bg: '#dbeafe', color: '#1e40af' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#1e293b', margin: 0 }}>Recent Estimations</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: '#0f766e', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500, boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.2)' }}>
            <Plus size={18} /> New Estimation
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search components..." 
              style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '250px' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer', color: '#475569' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>ID</th>
              <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Component Name</th>
              <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Cost</th>
              <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Material & Process</th>
              <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading estimations...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error}</td>
              </tr>
            ) : estimations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No estimations found. Create your first one!</td>
              </tr>
            ) : (
              estimations.map((est, i) => (
                <tr key={est.id || i} style={{ borderBottom: i === estimations.length - 1 ? 'none' : '1px solid #e2e8f0', background: 'white' }}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#64748b' }}>{est.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 500, color: '#0f766e' }}>{est.name}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>{est.cost}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#1e293b' }}>{est.material}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{est.process}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      backgroundColor: getStatusColor(est.status).bg, 
                      color: getStatusColor(est.status).color 
                    }}>
                      {est.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#64748b' }}>{est.date}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }} title="Edit"><Edit2 size={16} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }} title="View Breakdown"><FileText size={16} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }} title="Export PDF"><Download size={16} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem' }}><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EstimationsTab;

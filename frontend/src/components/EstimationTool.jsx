import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, RotateCcw, TrendingUp, FileUp, FileCode } from 'lucide-react';
import { estimationService } from '../services/estimation.service';

const EstimationTool = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setScanning(true);
    setLoading(true);
    
    // Simulate AI scanning of DXF/PDF
    setTimeout(async () => {
      setScanning(false);
      try {
        const data = await estimationService.getEstimate({ 
          fileName: selectedFile.name,
          type: selectedFile.name.split('.').pop().toUpperCase()
        });
        setResult(data);
      } catch (error) {
        console.error('Estimation failed', error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setScanning(false);
    setLoading(false);
  };

  return (
    <section id="demo" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Upload. Scan. <span style={{ color: '#0f766e' }}>Estimate.</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Our proprietary engine parses **DXF**, **PDF**, and **CAD** files to extract geometric data and material requirements automatically.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(15, 118, 110, 0.05)', borderRadius: '10px' }}>
                  <FileCode color="#0f766e" size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>DXF Geometric Parsing</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Automatic extraction of motor windings and mechanical dimensions.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(15, 118, 110, 0.05)', borderRadius: '10px' }}>
                  <FileText color="#0f766e" size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>PDF Specification OCR</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Real-time scanning of technical data sheets and material lists.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', position: 'relative' }}>
            {!result && !loading && !scanning ? (
              <div className="animate-fade-in">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Drop your design here</h3>
                
                <div 
                  className="dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <div style={{ padding: '1.5rem', background: 'rgba(15, 118, 110, 0.05)', borderRadius: '50%', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.05)' }}>
                    <Upload color="#0f766e" size={32} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>Drag & Drop Design File</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Supports DXF, PDF, STEP, and DWG</p>
                  </div>
                  <input 
                    type="file" 
                    id="fileInput" 
                    style={{ display: 'none' }} 
                    onChange={handleFileSelect}
                    accept=".dxf,.pdf,.step,.dwg"
                  />
                  <button className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                    Browse Files
                  </button>
                </div>
              </div>
            ) : scanning || (loading && !result) ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                   <div style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid rgba(15, 118, 110, 0.1)',
                    borderTopColor: '#0f766e',
                    borderRadius: '50%',
                    animation: 'spin 1.5s linear infinite'
                  }}></div>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <FileUp color="#0f766e" size={24} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{scanning ? 'Parsing Geometric Data...' : 'Calculating Costs...'}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Analyzing {file?.name || 'design file'}</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <FileText color="#0f766e" size={20} />
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{file?.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Analyzed successfully</p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 700, letterSpacing: '0.05em' }}>ESTIMATED UNIT COST</span>
                  <h4 style={{ fontSize: '3.5rem', margin: '0.25rem 0', color: '#1e293b' }}>${result.estimatedCost.toFixed(2)}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <TrendingUp size={14} color="#10b981" />
                    <span>Confidence Score: {(result.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Material Estimation</span>
                    <span style={{ fontWeight: 600 }}>${result.breakdown.material}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: 'var(--accent-primary)' }}></div>
                  </div>
                </div>

                <button className="btn-secondary" onClick={reset} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  Upload Another Design <RotateCcw size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstimationTool;

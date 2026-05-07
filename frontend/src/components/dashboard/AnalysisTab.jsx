import { Calculator, Check, ChevronDown, ChevronRight, ChevronUp, FileText, Image as ImageIcon, Layers, RefreshCcw, Save, Settings, XCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

const AnalysisTab = ({ data, onBack }) => {
  const fileObject = data?.file;
  const fileUrl = useMemo(() => {
    if (!fileObject) return null;
    return typeof fileObject === 'string' ? fileObject : URL.createObjectURL(fileObject);
  }, [fileObject]);

  useEffect(() => {
    if (fileObject && typeof fileObject !== 'string') {
      return () => {
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl);
        }
      };
    }
    return undefined;
  }, [fileObject, fileUrl]);
  
  // Right panel config states
  const [material, setMaterial] = useState(data?.metadata?.material || 'Aluminum 6061');
  const [process, setProcess] = useState(data?.metadata?.process || 'CNC Milling');
  const [costPerHour, setCostPerHour] = useState('45.00');
  const [materialCostPerKg, setMaterialCostPerKg] = useState('5.50');
  const [volume, setVolume] = useState('125.4');

  const [isParamsOpen, setIsParamsOpen] = useState(true);
  const [isActionsOpen, setIsActionsOpen] = useState(true);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'minmax(0, 3fr) minmax(320px, 1fr)', 
      gap: '1.5rem', 
      height: 'calc(100vh - 120px)', // adjust for Dashboard padding and internal padding
      backgroundColor: '#f8fafc', 
      overflow: 'hidden' 
    }}>
      
      {/* LEFT PANEL: 3/4 Width (Design/Drawing Viewer) - NO SCROLL (Free space) */}
      <div style={{ 
        backgroundColor: '#e2e8f0', 
        borderRadius: '1rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #cbd5e1'
      }}>
        {data.dxf_data?.preview_svg ? (
           <div 
             style={{ width: '100%', height: '100%', overflow: 'hidden', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
             dangerouslySetInnerHTML={{ __html: data.dxf_data.preview_svg
               .replace(/<\?xml[^>]*>/, '')
               .replace('width="400" height="300"', 'width="100%" height="100%"')
               .replace('width=\'400\' height=\'300\'', 'width="100%" height="100%"')
             }} 
           />
        ) : data.dxf_data?.preview_url ? (
           <img 
             src={data.dxf_data.preview_url} 
             alt="DXF preview" 
             style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
           />
        ) : fileUrl && (data.file?.type === 'application/pdf' || data.metadata?.file_type === 'application/pdf' || data.file?.type?.startsWith('image/') || data.metadata?.file_type?.startsWith('image/')) ? (
           (data.file?.type === 'application/pdf' || data.metadata?.file_type === 'application/pdf') ? (
              <object data={fileUrl} type="application/pdf" width="100%" height="100%" style={{ display: 'block' }}>
                <p>Unable to display PDF preview. <a href={fileUrl} target="_blank" rel="noreferrer">Download instead</a>.</p>
              </object>
           ) : (
              <img src={fileUrl} alt="Design preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
           )
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', overflowY: 'auto', width: '100%', justifyContent: 'center' }}>
            <div style={{ width: '250px', height: '250px', border: '2px dashed #94a3b8', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', marginBottom: '1rem', flexShrink: 0 }}>
              <ImageIcon size={64} style={{ opacity: 0.3 }} />
            </div>
            <h4 style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '0.5rem', marginTop: 0 }}>Drawing Visualization Area</h4>
            <p style={{ maxWidth: '400px', fontSize: '0.9rem', marginBottom: '2rem' }}>
              This is a free space designated for the 2D/3D diagram rendering engine. Bounding boxes and annotations will be displayed here.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: 1/4 Width (Config & Versioning) - SCROLLABLE */}
      <div style={{ 
        backgroundColor: '#fff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '1rem', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Header inside right panel */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
          {onBack && (
            <button 
              onClick={onBack}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 500 }}
            >
              <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Estimations
            </button>
          )}
          <h2 style={{ fontSize: '1.25rem', color: '#1e293b', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {data.metadata?.component_name || data.name || data.metadata?.file_name}
            <span style={{ fontSize: '0.75rem', color: '#0f766e', backgroundColor: '#ccfbf1', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>Active</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Estimation Code: {data.estimation_code}
          </p>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Live Cost Output */}
          {data.dxf_data && data.dxf_data.total_cost !== undefined && (
            <div style={{ backgroundColor: '#f0fdfa', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #ccfbf1' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#0f766e', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Estimated Cost</p>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: '#134e4a', fontFamily: 'Outfit' }}>
                  ${data.dxf_data.total_cost.toFixed(2)}
                </div>
              </div>

              {/* Detailed Cost Breakdown */}
              {data.dxf_data.cost_breakdown && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem', textAlign: 'center' }}>Detailed Cost Breakdown</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Material Cost</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>${data.dxf_data.cost_breakdown.material_cost?.toFixed(2)}</div>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Labor Cost</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>${data.dxf_data.cost_breakdown.labor_cost?.toFixed(2)}</div>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Machine Cost</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>${data.dxf_data.cost_breakdown.machine_cost?.toFixed(2)}</div>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Tool Cost</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>${data.dxf_data.cost_breakdown.tool_cost?.toFixed(2)}</div>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Finishing Cost</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>${data.dxf_data.cost_breakdown.finishing_cost?.toFixed(2)}</div>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Overhead</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>${data.dxf_data.cost_breakdown.overhead_cost?.toFixed(2)}</div>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Profit Margin</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>${data.dxf_data.cost_breakdown.profit_amount?.toFixed(2)}</div>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Packaging & Shipping</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>${(data.dxf_data.cost_breakdown.packaging_cost + data.dxf_data.cost_breakdown.shipping_cost).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Cost Analysis Summary */}
                  {data.dxf_data.cost_analysis && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>Cost Analysis Details</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                        <span style={{ color: '#64748b' }}>Material Mass:</span>
                        <span style={{ color: '#1e293b', fontWeight: 500 }}>{data.dxf_data.cost_analysis.material_mass_kg} kg</span>
                        <span style={{ color: '#64748b' }}>Volume:</span>
                        <span style={{ color: '#1e293b', fontWeight: 500 }}>{data.dxf_data.cost_analysis.volume_cm3} cm³</span>
                        <span style={{ color: '#64748b' }}>Labor Time:</span>
                        <span style={{ color: '#1e293b', fontWeight: 500 }}>{data.dxf_data.cost_analysis.total_labor_time_hours} hrs</span>
                        <span style={{ color: '#64748b' }}>Overhead Rate:</span>
                        <span style={{ color: '#1e293b', fontWeight: 500 }}>{data.dxf_data.cost_analysis.overhead_percentage}%</span>
                        <span style={{ color: '#64748b' }}>Profit Margin:</span>
                        <span style={{ color: '#1e293b', fontWeight: 500 }}>{data.dxf_data.cost_analysis.profit_margin_percentage}%</span>
                      </div>
                    </div>
                  )}

                  {data.dxf_data.cost_config_used && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>Configuration Used</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                        {Object.entries(data.dxf_data.cost_config_used).map(([key, value]) => (
                          <React.Fragment key={key}>
                            <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}:</span>
                            <span style={{ color: '#1e293b', fontWeight: 500 }}>{typeof value === 'number' ? value : String(value)}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Collapsible Geometric Data Area */}
          <div style={{ padding: '0', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ padding: '0 0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#475569" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Geometric Specs</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingBottom: '1.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Dimensions (W x H)</label>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                  {data?.dxf_data ? `${data.dxf_data.bounding_box?.width?.toFixed(2)} x ${data.dxf_data.bounding_box?.height?.toFixed(2)}` : 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Gross Area</label>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                  {data?.dxf_data ? `${data.dxf_data.gross_area?.toFixed(2)} sq.mm` : 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Cut Perimeter</label>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                  {data?.dxf_data ? `${data.dxf_data.cut_perimeter?.toFixed(2)} mm` : 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Hole Count</label>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                  {data?.dxf_data ? data.dxf_data.hole_count : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* DXF File Meta Details Area */}
          <div style={{ padding: '0', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ padding: '0 0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="#475569" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uploaded File Details</h3>
            </div>
            
            <div style={{ padding: '0 0.5rem 1rem' }}>
               <div style={{ fontSize: '0.85rem', color: '#1e293b', marginBottom: '0.75rem', wordBreak: 'break-all' }}>
                  <strong>File:</strong> {data.metadata?.file_name || data.name || "Unknown File"}
               </div>
               
               {fileUrl && (
                  <a href={fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#0f766e', textDecoration: 'underline' }}>View / Download Source File</a>
               )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingBottom: '1.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Format</label>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                  {data?.dxf_data ? `DXF ${data.dxf_data.dxf_version}` : 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Process Time</label>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                   {data?.dxf_data ? `${data.dxf_data.elapsed_s?.toFixed(2)}s` : 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Entities Processed</label>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                   {data?.dxf_data ? data.dxf_data.entities_processed : 'N/A'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Polygons</label>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                   {data?.dxf_data ? data.dxf_data.polygon_count : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Parameters Area */}
          <div style={{ padding: '0', borderBottom: '1px solid #e2e8f0' }}>
            <button 
              onClick={() => setIsParamsOpen(!isParamsOpen)}
              style={{ padding: '1rem 0.5rem', width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={18} color="#475569" />
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parameters</h3>
              </div>
              {isParamsOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
            </button>
            
            {isParamsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>Material</label>
                  <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>Material Cost ($/kg)</label>
                  <input type="number" value={materialCostPerKg} onChange={(e) => setMaterialCostPerKg(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>Manufacturing Process</label>
                  <input type="text" value={process} onChange={(e) => setProcess(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>Process Cost ($/hr)</label>
                  <input type="number" value={costPerHour} onChange={(e) => setCostPerHour(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem', display: 'block' }}>Detected Volume (cm³)</label>
                  <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', backgroundColor: '#f8fafc' }} />
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Actions Area */}
          <div style={{ padding: '0' }}>
            <button 
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              style={{ padding: '1rem 0.5rem', width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={18} color="#475569" />
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</h3>
              </div>
              {isActionsOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
            </button>
            
            {isActionsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1rem' }}>
                <button style={{
                  width: '100%', padding: '0.85rem', backgroundColor: '#0f766e', color: 'white', border: 'none', borderRadius: '0.5rem',
                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.2)'
                }}>
                  <Save size={18} /> Save & Recalculate
                </button>

                <button style={{
                  width: '100%', padding: '0.85rem', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '0.5rem',
                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}>
                  <Check size={18} /> Mark as Final
                </button>

                <button style={{
                  width: '100%', padding: '0.85rem', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '0.5rem',
                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}>
                  <XCircle size={18} /> Discard Estimation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div style={{ 
          position: 'sticky', 
          bottom: 0, 
          backgroundColor: '#fff', 
          padding: '1.5rem', 
          borderTop: '1px solid #e2e8f0',
          zIndex: 10,
          marginTop: 'auto',
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem'
        }}>
          <button style={{
            width: '100%', padding: '0.9rem', backgroundColor: '#0f766e', color: 'white', border: 'none', borderRadius: '0.5rem',
            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.2)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d635c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
          >
            <RefreshCcw size={18} /> Create New Version
          </button>
        </div>

      </div>
    </div>
  );
};

export default AnalysisTab;

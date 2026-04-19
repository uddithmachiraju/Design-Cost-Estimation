import { AlertCircle, CheckCircle2, ChevronRight, Loader2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { estimationService } from '../../services/estimation.service';
import SmartDropdown from './SmartDropdown';

const MaterialInlineForm = ({ onSave, onCancel }) => {
  const [localCost, setLocalCost] = useState('');
  const [localDensity, setLocalDensity] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Cost per kg ($) *</label>
          <input 
            type="number" 
            value={localCost}
            onChange={(e) => setLocalCost(e.target.value)}
            placeholder="e.g. 5.50"
            autoFocus
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Density (g/cm³) (optional)</label>
          <input 
            type="number" 
            value={localDensity}
            onChange={(e) => setLocalDensity(e.target.value)}
            placeholder="e.g. 2.7"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button 
          onClick={(e) => { e.preventDefault(); onSave({ costPerKg: localCost, density: localDensity }); }}
          disabled={!localCost}
          style={{ padding: '0.5rem 1rem', background: localCost ? '#eab308' : '#fef08a', color: '#854d0e', border: 'none', borderRadius: '0.25rem', fontWeight: 600, fontSize: '0.85rem', cursor: localCost ? 'pointer' : 'not-allowed' }}
        >
          Save & Use
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); onCancel(); }}
          style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ProcessInlineForm = ({ onSave, onCancel }) => {
  const [localCost, setLocalCost] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div>
        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Cost per hour ($) *</label>
        <input 
          type="number" 
          value={localCost}
          onChange={(e) => setLocalCost(e.target.value)}
          placeholder="e.g. 45.00"
          autoFocus
          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button 
          onClick={(e) => { e.preventDefault(); onSave({ costPerHour: localCost }); }}
          disabled={!localCost}
          style={{ padding: '0.5rem 1rem', background: localCost ? '#eab308' : '#fef08a', color: '#854d0e', border: 'none', borderRadius: '0.25rem', fontWeight: 600, fontSize: '0.85rem', cursor: localCost ? 'pointer' : 'not-allowed' }}
        >
          Save & Use
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); onCancel(); }}
          style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const NewEstimationForm = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    componentName: '',
    material: '',
    process: ''
  });

  const [materials, setMaterials] = useState(['Aluminum 6061', 'Stainless Steel 304', 'Titanium Grade 5', 'Polycarbonate', 'ABS Plastic']);
  const [processes, setProcesses] = useState(['CNC Milling', 'CNC Turning', '3D Printing (FDM)', 'Injection Molding', 'Sheet Metal Bending']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a design file to upload.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const payload = {
        component_name: formData.componentName,
        material: formData.material,
        process: formData.process
      };
      
      // Step 1: Create estimation reference in DB
      const response = await estimationService.createEstimation(payload);
      
      // Step 2: Get presigned URL using the DB estimation_id
      const urlResponse = await estimationService.getPresignedUrl(response.estimation_id, selectedFile.name, selectedFile.type);
      
      // Step 3: Put the file data to S3 securely
      await estimationService.uploadFileToS3(urlResponse.presigned_url, selectedFile);

      setSuccess(true);
      // Reset form on success
      setFormData({ componentName: '', material: '', process: '' });
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || 'Failed to complete estimation request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#1e293b', margin: '0 0 0.5rem 0' }}>Create New Estimation</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          Upload your design file and specify the parameters to generate a live quote.
        </p>
      </div>

      <div style={{ 
        background: '#fff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '1rem', 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.25fr)',
        gap: '3rem'
      }}>
        
        {/* Left Side: Form Details */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Component Name *</label>
            <input 
              type="text" 
              name="componentName"
              value={formData.componentName}
              onChange={handleChange}
              placeholder="e.g. Main Engine Bracket"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0f766e'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          <SmartDropdown 
            label="Material"
            required={true}
            placeholder="Select or search material..."
            items={materials}
            value={formData.material}
            onChange={(val) => setFormData({ ...formData, material: val })}
            onAddNew={(name, data) => {
              setMaterials([...materials, name]);
              console.log("Material added:", name, data);
            }}
            InlineFormComponent={MaterialInlineForm}
          />

          <SmartDropdown 
            label="Manufacturing Process"
            required={true}
            placeholder="Select or search process..."
            items={processes}
            value={formData.process}
            onChange={(val) => setFormData({ ...formData, process: val })}
            onAddNew={(name, data) => {
              setProcesses([...processes, name]);
              console.log("Process added:", name, data);
            }}
            InlineFormComponent={ProcessInlineForm}
          />

          <div style={{ marginTop: '1rem' }}>
            {error && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
            {success && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#ecfdf5', border: '1px solid #34d399', color: '#047857', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} /> Estimation created successfully!
              </div>
            )}
            
            <button 
              type="submit"
              disabled={!selectedFile || !formData.componentName || !formData.material || !formData.process || loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: (!selectedFile || !formData.componentName || !formData.material || !formData.process || loading) ? '#cbd5e1' : '#0f766e',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: (!selectedFile || !formData.componentName || !formData.material || !formData.process || loading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: (!selectedFile || !formData.componentName || !formData.material || !formData.process || loading) ? 'none' : '0 4px 6px -1px rgba(15, 118, 110, 0.2)'
              }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Analyze & Generate Quote <ChevronRight size={18} /></>}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.75rem' }}>
              Estimated time: ~15 seconds using AI Analysis
            </p>
          </div>

        </form>

        {/* Right Side: File Upload */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Design File (DXF, STL, STEP) *</label>
          
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              flex: 1,
              border: `2px dashed ${dragActive ? '#0f766e' : selectedFile ? '#10b981' : '#cbd5e1'}`,
              borderRadius: '0.75rem',
              backgroundColor: dragActive ? '#f0fdfa' : selectedFile ? '#ecfdf5' : '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              id="file-upload" 
              type="file" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
              }}
              accept=".dxf,.stl,.step,.stp,.pdf"
            />

            {!selectedFile ? (
              <>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: dragActive ? '#ccfbf1' : '#e2e8f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  transition: 'all 0.2s'
                }}>
                  <UploadCloud size={32} color={dragActive ? '#0f766e' : '#64748b'} />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>
                  {dragActive ? "Drop file here" : "Click or drag to upload"}
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', margin: 0, maxWidth: '250px' }}>
                  Support for DXF, STL, STEP up to 50MB. Auto-generates drawing specifications.
                </p>
              </>
            ) : (
              <>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: '#d1fae5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <CheckCircle2 size={32} color="#059669" />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem', wordBreak: 'break-all', textAlign: 'center' }}>
                  {selectedFile.name}
                </h4>
                <p style={{ color: '#059669', fontSize: '0.9rem', margin: 0 }}>
                  Ready for analysis ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  Remove File
                </button>
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default NewEstimationForm;

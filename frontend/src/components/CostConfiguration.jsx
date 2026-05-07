import React, { useEffect, useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, DollarSign, Settings } from 'lucide-react';

const InputField = ({ label, field, value, unit, type = 'number', step = '0.01', min = '0', onChange }) => (
  <div>
    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>
      {label} {unit && <span style={{ fontWeight: 400, color: '#64748b' }}>({unit})</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      step={step}
      min={min}
      style={{
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #cbd5e1',
        borderRadius: '0.25rem',
        fontSize: '0.85rem',
        backgroundColor: '#fff'
      }}
    />
  </div>
);

const CostConfiguration = ({ onConfigChange, initialConfig = {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [config, setConfig] = useState({
    // Material costs
    material_cost_per_kg: initialConfig.material_cost_per_kg || 5.50,
    material_density: initialConfig.material_density || 2.7, // g/cm³

    // Labor costs
    labor_rate_per_hour: initialConfig.labor_rate_per_hour || 45.00,
    setup_time_hours: initialConfig.setup_time_hours || 0.5,

    // Machine costs
    machine_rate_per_hour: initialConfig.machine_rate_per_hour || 25.00,

    // Overhead and profit
    overhead_percentage: initialConfig.overhead_percentage || 25, // %
    profit_margin_percentage: initialConfig.profit_margin_percentage || 15, // %

    // Process-specific costs
    cutting_speed_mm_per_min: initialConfig.cutting_speed_mm_per_min || 1500,
    tool_cost_per_mm: initialConfig.tool_cost_per_mm || 0.001,

    // Waste and scrap
    material_waste_percentage: initialConfig.material_waste_percentage || 5, // %

    // Quality and finishing
    finishing_cost_per_sq_mm: initialConfig.finishing_cost_per_sq_mm || 0.002,
    inspection_time_minutes: initialConfig.inspection_time_minutes || 5,

    // Shipping and handling
    packaging_cost: initialConfig.packaging_cost || 10.00,
    shipping_cost_per_kg: initialConfig.shipping_cost_per_kg || 2.50,

    ...initialConfig
  });

  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
  }, [config, onConfigChange]);

  const handleInputChange = (field, value) => {
    const newConfig = { ...config, [field]: parseFloat(value) || 0 };
    setConfig(newConfig);
  };

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#fff' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'none',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderRadius: isOpen ? '0.5rem 0.5rem 0 0' : '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calculator size={18} color="#0f766e" />
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b', fontWeight: 600 }}>
            Cost Configuration
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
            Advanced
          </span>
        </div>
        {isOpen ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
      </button>

      {isOpen && (
        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.4' }}>
            Configure detailed cost parameters for accurate cost estimation. These values will be used to calculate material costs, labor, overhead, and all other expenses.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {/* Material Costs */}
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={14} />
                Material Costs
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <InputField label="Cost per kg" field="material_cost_per_kg" value={config.material_cost_per_kg} unit="$/kg" onChange={handleInputChange} />
                <InputField label="Density" field="material_density" value={config.material_density} unit="g/cm³" onChange={handleInputChange} />
              </div>
            </div>

            {/* Labor & Machine Costs */}
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={14} />
                Labor & Machine Costs
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <InputField label="Labor rate" field="labor_rate_per_hour" value={config.labor_rate_per_hour} unit="$/hr" onChange={handleInputChange} />
                <InputField label="Setup time" field="setup_time_hours" value={config.setup_time_hours} unit="hours" step="0.1" onChange={handleInputChange} />
                <InputField label="Machine rate" field="machine_rate_per_hour" value={config.machine_rate_per_hour} unit="$/hr" onChange={handleInputChange} />
              </div>
            </div>

            {/* Process Parameters */}
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={14} />
                Process Parameters
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <InputField label="Cutting speed" field="cutting_speed_mm_per_min" value={config.cutting_speed_mm_per_min} unit="mm/min" onChange={handleInputChange} />
                <InputField label="Tool cost" field="tool_cost_per_mm" value={config.tool_cost_per_mm} unit="$/mm" step="0.0001" onChange={handleInputChange} />
              </div>
            </div>

            {/* Overhead & Profit */}
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={14} />
                Overhead & Profit
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <InputField label="Overhead" field="overhead_percentage" value={config.overhead_percentage} unit="%" max="100" onChange={handleInputChange} />
                <InputField label="Profit margin" field="profit_margin_percentage" value={config.profit_margin_percentage} unit="%" max="100" onChange={handleInputChange} />
              </div>
            </div>

            {/* Additional Costs */}
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={14} />
                Additional Costs
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <InputField label="Material waste" field="material_waste_percentage" value={config.material_waste_percentage} unit="%" max="100" onChange={handleInputChange} />
                <InputField label="Finishing cost" field="finishing_cost_per_sq_mm" value={config.finishing_cost_per_sq_mm} unit="$/mm²" step="0.0001" onChange={handleInputChange} />
                <InputField label="Inspection time" field="inspection_time_minutes" value={config.inspection_time_minutes} unit="minutes" onChange={handleInputChange} />
                <InputField label="Packaging" field="packaging_cost" value={config.packaging_cost} unit="$" onChange={handleInputChange} />
                <InputField label="Shipping" field="shipping_cost_per_kg" value={config.shipping_cost_per_kg} unit="$/kg" onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '0.25rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#065f46', margin: 0, lineHeight: '1.4' }}>
              <strong>Cost Transparency:</strong> All these parameters will be used to calculate a detailed cost breakdown showing exactly how each component contributes to the final price. This ensures complete transparency for your customers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostConfiguration;
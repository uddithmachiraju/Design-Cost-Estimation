import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const AnalyticsTab = () => {
  // Mock Data
  const costTrendData = [
    { name: 'Week 1', cost: 12000 },
    { name: 'Week 2', cost: 19000 },
    { name: 'Week 3', cost: 15500 },
    { name: 'Week 4', cost: 22000 },
    { name: 'Week 5', cost: 18000 },
    { name: 'Week 6', cost: 28000 },
    { name: 'Week 7', cost: 24500 },
  ];

  const materialData = [
    { name: 'Aluminum 6061', value: 45000 },
    { name: 'Stainless Steel', value: 30000 },
    { name: 'Mild Steel', value: 15000 },
    { name: 'ABS Plastic', value: 8000 },
    { name: 'Titanium', value: 12000 },
  ];
  const COLORS = ['#0f766e', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  const processData = [
    { name: 'CNC Milling', cost: 52000 },
    { name: 'CNC Turning', cost: 28000 },
    { name: 'Laser Cutting', cost: 15000 },
    { name: 'Injection Molding', cost: 11000 },
    { name: 'Die Casting', cost: 9000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#1e293b', margin: 0 }}>Cost Analytics</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>Breakdown and visualize your manufacturing estimates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Cost Trend Chart */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginTop: 0, marginBottom: '1.5rem' }}>Estimated Cost Trend</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="cost" stroke="#0f766e" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Distribution (Pie Chart) */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginTop: 0, marginBottom: '1.5rem' }}>Cost by Material</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {materialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Process Distribution (Bar Chart) */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginTop: 0, marginBottom: '1.5rem' }}>Manufacturing Process Split</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={120} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="cost" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AnalyticsTab;

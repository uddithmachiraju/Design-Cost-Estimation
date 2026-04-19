import React, { useState } from 'react';
import DrawingArea from './DrawingArea';
import OverviewTab from './dashboard/OverviewTab';
import EstimationsTab from './dashboard/EstimationsTab';
import AnalyticsTab from './dashboard/AnalyticsTab';
import { Home, Image as ImageIcon, Calculator, Settings, PieChart, Folder, Users, Bell, ChevronLeft, ChevronRight, ChevronDown, Plus } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Estimations');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const isSidebarOpen = isSidebarHovered;

  const tabs = [
    { 
      name: 'Estimations', 
      icon: Calculator,
      subItems: [
        { name: 'New Estimation', icon: Plus },
        { name: 'Data', icon: Calculator }
      ]
    }
  ];

  return (
    <>
      <div className="animate-fade-in" style={{ display: 'flex', paddingTop: '80px', minHeight: '100vh', background: '#f8fafc' }}>
        
        {/* Sidebar / Vertical Navigation */}
      <div 
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        style={{
        width: isSidebarOpen ? '260px' : '80px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: isSidebarOpen ? '2rem 1.5rem' : '2rem 0.75rem',
        gap: '0.5rem',
        transition: 'all 0.3s ease'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name || (tab.subItems && tab.subItems.some(sub => activeTab === sub.name));
          const isExpanded = expandedMenus[tab.name];

          return (
            <div key={tab.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button
                onClick={() => {
                  if (tab.subItems) {
                    setExpandedMenus(prev => ({ ...prev, [tab.name]: !prev[tab.name] }));
                    if (activeTab !== 'New Estimation' && activeTab !== 'Data') {
                       setActiveTab('Data');
                    }
                  } else {
                    setActiveTab(tab.name);
                  }
                }}
                title={!isSidebarOpen ? tab.name : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'space-between' : 'center',
                  padding: isSidebarOpen ? '0.85rem 1.25rem' : '0.85rem 0',
                  background: isActive && !tab.subItems ? '#f0fdfa' : 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: isActive ? '#0f766e' : '#64748b',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: isSidebarOpen ? '0.75rem' : '0' }}>
                  <Icon size={20} />
                  {isSidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{tab.name}</span>}
                </div>
                {isSidebarOpen && tab.subItems && (
                  <ChevronDown size={16} style={{ color: '#94a3b8', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                )}
              </button>

              {/* Sub Items Rendering */}
              {tab.subItems && isExpanded && isSidebarOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '2.5rem', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {tab.subItems.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => setActiveTab(sub.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        background: activeTab === sub.name ? '#f0fdfa' : 'transparent',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: activeTab === sub.name ? '#0f766e' : '#64748b',
                        fontWeight: activeTab === sub.name ? 600 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <sub.icon size={14} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap' }}>{sub.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2rem 3rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', fontFamily: 'Outfit', margin: '0 0 0.5rem 0' }}>
            My Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            Manage your design files, analyze parts, and view generated quotes.
          </p>
        </div>

        {/* Tab Content Area */}
        <div style={{ flex: 1, 
          background: ['Overview', 'Cost Analytics', 'Estimations', 'Data'].includes(activeTab) ? 'transparent' : 'white', 
          borderRadius: activeTab === 'Overview' ? '0' : '1rem', 
          padding: ['Overview', 'Cost Analytics', 'Estimations', 'Data'].includes(activeTab) ? '0' : '2rem', 
          boxShadow: ['Overview', 'Cost Analytics', 'Estimations', 'Data'].includes(activeTab) ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)', 
          minHeight: '500px' 
        }}>
          
          {activeTab === 'Overview' && <OverviewTab />}
          {(activeTab === 'Estimations' || activeTab === 'Data') && <EstimationsTab />}
          {activeTab === 'New Estimation' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#94a3b8' }}>
              <div style={{ textAlign: 'center' }}>
                <Calculator size={48} style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto' }} />
                <h3 style={{ color: '#1e293b' }}>New Estimation Builder</h3>
                <p>This space will house the intelligent quoting engine form.</p>
              </div>
            </div>
          )}
          {activeTab === 'Cost Analytics' && <AnalyticsTab />}
          {activeTab === 'Drawings' && <DrawingArea />}

          {/* Placeholders for new tabs */}
          {(activeTab === 'Saved Library' || activeTab === 'Team Activity' || activeTab === 'Notifications' || activeTab === 'Settings') && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#94a3b8' }}>
              <div style={{ textAlign: 'center' }}>
                {activeTab === 'Saved Library' && <Folder size={48} style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto' }} />}
                {activeTab === 'Team Activity' && <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto' }} />}
                {activeTab === 'Notifications' && <Bell size={48} style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto' }} />}
                {activeTab === 'Settings' && <Settings size={48} style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto' }} />}
                <h3 style={{ color: '#1e293b' }}>{activeTab}</h3>
                <p>This module is currently under development.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      </div>
      
      {/* Global Floating Action Button */}
      <button style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2.5rem',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        background: '#0f766e',
        color: 'white',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.3), 0 4px 6px -2px rgba(15, 118, 110, 0.15)',
        cursor: 'pointer',
        zIndex: 50,
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 20px -5px rgba(15, 118, 110, 0.4)'; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(15, 118, 110, 0.3), 0 4px 6px -2px rgba(15, 118, 110, 0.15)'; }}
      title="Create New Estimation"
      onClick={() => {
        setExpandedMenus(prev => ({ ...prev, Estimations: true }));
        setActiveTab('New Estimation');
      }}
      >
        <Plus size={28} />
      </button>
    </>
  );
};

export default Dashboard;

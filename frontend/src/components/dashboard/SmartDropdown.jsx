import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus, AlertCircle, Check } from 'lucide-react';

const SmartDropdown = ({ 
  label, 
  items, 
  value, 
  onChange, 
  required, 
  placeholder,
  InlineFormComponent,
  onAddNew
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatch = items.find(item => item.toLowerCase() === search.trim().toLowerCase());

  const handleSelect = (item) => {
    onChange(item);
    setIsOpen(false);
    setSearch('');
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setIsOpen(false);
  };

  const cancelAddNew = () => {
    setIsAddingNew(false);
    setSearch('');
  };

  const submitAddNew = (newItemData) => {
    onAddNew(search.trim(), newItemData);
    onChange(search.trim());
    setIsAddingNew(false);
    setSearch('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} ref={dropdownRef}>
      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
        {label} {required && '*'}
      </label>

      {/* Main Trigger / Inline Form Area */}
      {isAddingNew ? (
        <div style={{
          border: '1px solid #eab308',
          borderRadius: '0.5rem',
          padding: '1rem',
          backgroundColor: '#fefce8',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#854d0e', fontWeight: 500, fontSize: '0.9rem' }}>
            <AlertCircle size={16} />
            <span>No pricing data found for "{search.trim()}".</span>
          </div>
          
          {/* Custom Form Fields from Parent */}
          {InlineFormComponent && (
            <InlineFormComponent 
              onSave={submitAddNew}
              onCancel={cancelAddNew}
              value={search.trim()}
            />
          )}
          
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: `1px solid ${isOpen ? '#0f766e' : '#cbd5e1'}`,
              fontSize: '0.95rem',
              backgroundColor: '#fff',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: value ? '#1e293b' : '#94a3b8'
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value || placeholder}
            </span>
            <ChevronDown size={16} style={{ color: '#94a3b8', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              zIndex: 50,
              maxHeight: '250px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Search Header */}
              <div style={{ padding: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.5rem 0.4rem 1.8rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.85rem',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div style={{ overflowY: 'auto', flex: 1, padding: '0.25rem' }}>
                {filteredItems.map(item => (
                  <div
                    key={item}
                    onClick={() => handleSelect(item)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: value === item ? '#f0fdfa' : 'transparent',
                      color: value === item ? '#0f766e' : '#334155',
                      fontWeight: value === item ? 600 : 400
                    }}
                    onMouseEnter={(e) => { if(value !== item) e.target.style.backgroundColor = '#f8fafc'; }}
                    onMouseLeave={(e) => { if(value !== item) e.target.style.backgroundColor = 'transparent'; }}
                  >
                    {item}
                    {value === item && <Check size={14} />}
                  </div>
                ))}

                {filteredItems.length === 0 && search.trim() && !exactMatch && (
                  <div style={{ padding: '0.75rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    No results found
                  </div>
                )}
              </div>

              {/* Add New Action */}
              {search.trim() && !exactMatch && (
                <div style={{ padding: '0.25rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddNew();
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#0f766e',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      borderRadius: '0.25rem'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0fdfa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <Plus size={16} /> Add "{search.trim()}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartDropdown;

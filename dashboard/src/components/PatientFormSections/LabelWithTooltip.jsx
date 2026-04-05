import React, { useState } from 'react';

const LabelWithTooltip = ({ label, tooltipText }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {label}
      <span 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        style={{
          cursor: 'help', 
          background: '#e0f2fe', 
          color: '#0284c7', 
          borderRadius: '50%', 
          width: '18px', 
          height: '18px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '11px', 
          fontWeight: 'bold'
        }}
      >
        i
      </span>
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          bottom: '100%', 
          left: '0', 
          marginBottom: '8px', 
          zIndex: 100, 
          width: '280px', 
          background: '#334155', 
          color: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '8px', 
          fontSize: '0.85rem', 
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
        }}>
          <strong style={{ display: 'block', marginBottom: '0.4rem', color: '#bae6fd' }}>{label}</strong>
          {tooltipText}
        </div>
      )}
    </label>
  );
};

export default LabelWithTooltip;

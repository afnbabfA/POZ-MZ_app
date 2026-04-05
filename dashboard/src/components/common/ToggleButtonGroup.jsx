import React from 'react';

const ToggleButtonGroup = ({ name, value, options, onChange, label }) => {
  return (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      {label && <label style={{ fontWeight: 500, fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>{label}</label>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {options.map((opt) => {
          const isSelected = value !== undefined && value !== null && value !== '' && String(value) === String(opt.value);
          return (
            <label
              key={opt.value}
              style={{
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                background: isSelected ? 'var(--primary)' : '#fff',
                color: isSelected ? '#fff' : 'var(--text-main)',
                borderRadius: '10px',
                border: '2px solid',
                borderColor: isSelected ? 'var(--primary)' : '#e2e8f0',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: isSelected ? '700' : '500',
                flex: '1 1 auto',
                minWidth: 'fit-content',
                textAlign: 'center',
                boxShadow: isSelected ? '0 4px 12px rgba(43, 92, 255, 0.3)' : 'none',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                zIndex: isSelected ? 1 : 0
              }}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={onChange}
                style={{ display: 'none' }}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ToggleButtonGroup;

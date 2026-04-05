import React from 'react';

const ValidationBanners = ({ showAgeWarning, parsedPesel, dataAge, errors, warnings }) => {
  return (
    <div style={{
        position: 'fixed', top: '20px', right: '20px', 
        zIndex: 5000, display: 'flex', flexDirection: 'column', gap: '12px',
        width: '340px', pointerEvents: 'none'
    }}>
      {showAgeWarning && (
        <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b',
            padding: '1rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            pointerEvents: 'auto', borderLeft: '5px solid #ef4444'
        }}>
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:'bold'}}>
                <span style={{fontSize:'1.2rem'}}>⚠️</span> Niezgodność wieku!
            </div>
            <div style={{marginTop:'0.5rem', fontSize:'0.9rem'}}>
                PESEL: <strong>{parsedPesel.age} l.</strong> | Wpisano: <strong>{dataAge} l.</strong>
            </div>
        </div>
      )}

      {errors.length > 0 && (
        <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c',
            padding: '1rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            pointerEvents: 'auto', borderLeft: '5px solid #b91c1c'
        }}>
            <div style={{fontWeight:'bold', display:'flex', alignItems:'center', gap:'0.5rem', marginBottom: '0.6rem'}}>
                <span style={{fontSize:'1.2rem'}}>🚫</span> Błąd walidacji
            </div>
            <ul style={{margin: 0, paddingLeft: '1.4rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div style={{
            background: '#fffbeb', border: '1px solid #fcd34d', padding: '1rem', 
            borderRadius: '12px', color: '#b45309', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            pointerEvents: 'auto', borderLeft: '5px solid #f59e0b'
        }}>
            <div style={{fontWeight:'bold', display:'flex', alignItems:'center', gap:'0.5rem', marginBottom: '0.6rem'}}>
                <span style={{fontSize:'1.2rem'}}>⚠️</span> Ostrzeżenie
            </div>
            <ul style={{margin: 0, paddingLeft: '1.4rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
            </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationBanners;

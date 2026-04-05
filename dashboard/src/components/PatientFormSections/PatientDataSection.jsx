import React from 'react';

const PatientDataSection = ({ data, onChange }) => {
  return (
    <>
      <div className="glass-panel">
        <h2 className="section-title">🩺 Wywiad: 1. Dane Pacjenta</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Imię i nazwisko</label>
          <input type="text" className="form-control" name="imie_nazwisko" value={data.imie_nazwisko || ''} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>PESEL</label>
          <input type="text" className="form-control" name="pesel" value={data.pesel || ''} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Wiek (lata)</label>
          <input type="number" className="form-control" name="age" value={data.age || ''} onChange={onChange} />
        </div>
        <div className="form-group">
            <label>Płeć</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                <input type="radio" name="gender" value="F" checked={data.gender === 'F'} onChange={onChange} style={{ accentColor: 'var(--primary)'}} />
                Kobieta
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                <input type="radio" name="gender" value="M" checked={data.gender === 'M'} onChange={onChange} style={{ accentColor: 'var(--primary)'}} />
                Mężczyzna
            </label>
            </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default PatientDataSection;

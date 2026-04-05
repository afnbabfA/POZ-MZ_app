import React from 'react';

const VaccinationSection = ({ data, onChange }) => {
  return (
    <>
      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0'}} />
      <h2 className="section-title">💉 7. Wywiad Szczepienny (Stan Zaszczepienia)</h2>
      <p style={{fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '1rem'}}>Zaznacz, jeśli pacjent JEST w pełni zaszczepiony (wg aktualnych schematów):</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {[
          {name: 'vac_dtap', label: 'dTap (Tężec, Błonica, Krztusiec) - do 10 lat'},
          {name: 'vac_flu', label: 'Grypa (aktualny sezon)'},
          {name: 'vac_covid', label: 'COVID-19 (aktualne przypominające)'},
          {name: 'vac_shingles', label: 'Półpasiec'},
          {name: 'vac_pneumo', label: 'Pneumokoki'},
          {name: 'vac_rsv', label: 'RSV'},
          {name: 'vac_hpv', label: 'HPV'},
          {name: 'vac_kzm', label: 'Kleszczowe Zapalenie Mózgu (KZM)'},
          {name: 'vac_hbv', label: 'WZW typu B'},
          {name: 'vac_hav', label: 'WZW typu A'},
          {name: 'vac_mening', label: 'Meningokoki (ACWY / B)'},
          {name: 'vac_mmr', label: 'Odra, Świnka, Różyczka (MMR)'},
          {name: 'vac_varicella', label: 'Ospa wietrzna'},
          {name: 'vac_travel', label: 'Szczepienia typowe dla podróżników (Dur, Wścieklizna itp.)'}
        ].map(item => (
            <div className="toggle-wrapper" key={item.name} style={{marginBottom: 0}}>
                <input type="checkbox" id={item.name} name={item.name} checked={data[item.name] || false} onChange={onChange} />
                <label htmlFor={item.name} style={{ margin: 0, fontWeight: 500, cursor: 'pointer', paddingLeft: '8px' }}>{item.label}</label>
            </div>
        ))}
      </div>
    </>
  );
};

export default VaccinationSection;

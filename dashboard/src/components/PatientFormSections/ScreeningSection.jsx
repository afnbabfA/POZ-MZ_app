import React from 'react';
import LabelWithTooltip from './LabelWithTooltip';

const ScreeningSection = ({ data, onChange }) => {
  return (
    <>
      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0'}} />
      <h2 className="section-title">📋 4. Ostatnie roczniki badań / Środowisko</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="form-group" style={{ position: 'relative' }}>
          <LabelWithTooltip label="Badanie FIT (Rok)" tooltipText={<><strong>FIT (Fecal Immunochemical Test)</strong><br/><br/>Wykonywany rutynowo co 2 lata w wieku 50-74 lata.</>} />
          <input type="number" className="form-control" name="last_fit" value={data.last_fit || ''} onChange={onChange} placeholder="Podaj rok, np. 2022" />
        </div>
        <div className="form-group" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: '#9f1239' }}>
              <input type="checkbox" name="fit_positive" checked={data.fit_positive || false} onChange={onChange} style={{ width: '1.2rem', height: '1.2rem' }} />
              Wynik FIT: Krew Obecna
          </label>
        </div>
        <div className="form-group" style={{ position: 'relative' }}>
          <LabelWithTooltip label="Mammografia (Rok)" tooltipText={<><strong>Mammografia</strong><br/><br/>Przesiewowo dla kobiet w wieku 45-74 lat (co 2 lata).</>} />
          <input type="number" className="form-control" name="last_mammography" value={data.last_mammography || ''} onChange={onChange} disabled={data.gender !== 'F'} placeholder="Tylko kobiety" />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        <div className="toggle-wrapper" style={{marginBottom: 0}}>
            <input type="checkbox" id="ticks_exposure" name="ticks_exposure" checked={data.ticks_exposure || false} onChange={onChange} />
            <label htmlFor="ticks_exposure" style={{ margin: 0, fontWeight: 500, cursor: 'pointer', paddingLeft: '8px' }}>Narażenie na kleszcze / aktywność w strefach endemicznych KZM</label>
        </div>
        <div className="toggle-wrapper" style={{marginBottom: 0}}>
            <input type="checkbox" id="pregnancy_plans" name="pregnancy_plans" checked={data.pregnancy_plans || false} onChange={onChange} />
            <label htmlFor="pregnancy_plans" style={{ margin: 0, fontWeight: 500, cursor: 'pointer', paddingLeft: '8px' }}>Plany prokreacyjne (zwiększone znaczenie np. dla dTap, RSV, MMR, ospy)</label>
        </div>
        <div className="toggle-wrapper" style={{marginBottom: 0}}>
            <input type="checkbox" id="travel_plans" name="travel_plans" checked={data.travel_plans || false} onChange={onChange} />
            <label htmlFor="travel_plans" style={{ margin: 0, fontWeight: 500, cursor: 'pointer', paddingLeft: '8px' }}>Plany podróżnicze (wskazania do szczepień z medycyny podróży)</label>
        </div>
      </div>
    </>
  );
};

export default ScreeningSection;

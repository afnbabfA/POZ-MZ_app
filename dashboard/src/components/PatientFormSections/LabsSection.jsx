import React from 'react';
import LabelWithTooltip from './LabelWithTooltip';

const LabsSection = ({ data, onChange }) => {
  return (
    <>
      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0'}} />
      
      <details style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', marginBottom: '1rem' }}>
          <summary style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--primary)' }}>Odwiń Szczegółowe Wyniki Badań Laboratoryjnych 🧪</summary>
          <div style={{ marginTop: '1rem', cursor: 'default' }}>
            
            <h4 style={{fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Zakres Podstawowy (np. Morfologia, Mocz, eGFR)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="Morfologia" tooltipText="Sprawdź: Niedokrwistość, makrocytoza, WBC, PLT." />
                    <select className="form-control" name="lab_morf" value={data.lab_morf || ''} onChange={onChange}>
                        <option value="">-- z wynikiem --</option>
                        <option value="w normie">W normie</option>
                        <option value="odchylenia">Odchylenia (patologia)</option>
                    </select>
                </div>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="Glukoza na czczo" tooltipText="Norma < 100 mg/dL. (100-125 to stan przedcukrzycowy)" />
                    <input type="number" className="form-control" name="glucose" value={data.glucose || ''} onChange={onChange} placeholder="mg/dL" />
                </div>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="Mocz ogólny" tooltipText="Zwróć uwagę na krwinkomocz, białkomocz, cukromocz." />
                    <select className="form-control" name="lab_mocz" value={data.lab_mocz || ''} onChange={onChange}>
                        <option value="">-- z wynikiem --</option>
                        <option value="w normie">W normie</option>
                        <option value="odchylenia">Odchylenia (patologia)</option>
                    </select>
                </div>
                <div className="form-group"><label>Kreatynina</label><input type="number" className="form-control" name="lab_kreatynina" value={data.lab_kreatynina || ''} onChange={onChange} /></div>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="eGFR (Nerek)" tooltipText="Norma > 60. Poniżej może sugerować PChN." />
                    <input type="number" className="form-control" name="egfr" value={data.egfr || ''} onChange={onChange} />
                </div>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="TSH" tooltipText="Norma ogółu dorosłych to ok. 0.40 - 4.50 uIU/mL" />
                    <input type="number" className="form-control" name="lab_tsh" value={data.lab_tsh || ''} onChange={onChange} />
                </div>
            </div>

            <h4 style={{fontSize: '0.9rem', marginBottom: '0.5rem', color: '#64748b'}}>Zakres Rozszerzony</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="ALT" tooltipText="Norma typowo < 40 U/L" />
                    <input type="number" className="form-control" name="lab_alt" value={data.lab_alt || ''} onChange={onChange} />
                </div>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="AST" tooltipText="Norma typowo < 40 U/L" />
                    <input type="number" className="form-control" name="lab_ast" value={data.lab_ast || ''} onChange={onChange} />
                </div>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="GGTP" tooltipText="Norma typowo < 50 U/L" />
                    <input type="number" className="form-control" name="lab_ggtp" value={data.lab_ggtp || ''} onChange={onChange} />
                </div>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="PSA Całkowity" tooltipText="Norma typowo < 4.0 ng/mL zależnie od wieku" />
                    <input type="number" className="form-control" name="lab_psa" value={data.lab_psa || ''} onChange={onChange} />
                </div>
                <div className="form-group" style={{position: 'relative'}}>
                    <LabelWithTooltip label="Anty-HCV" tooltipText="Dodatni nakazuje dalszą diagnostykę (RNA HCV)" />
                    <select className="form-control" name="lab_hcv" value={data.lab_hcv || ''} onChange={onChange}>
                        <option value="">-- z wynikiem --</option>
                        <option value="ujemny">Ujemny</option>
                        <option value="dodatni">Dodatni / Reaktywny</option>
                    </select>
                </div>
                <div className="form-group"><label>Lipoproteina (a) (mg/dL)</label><input type="number" className="form-control" name="lpa" value={data.lpa || ''} onChange={onChange} /></div>
            </div>

          </div>
      </details>
    </>
  );
};

export default LabsSection;

import React, { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import IPZDashboard from './components/IPZDashboard';
import Settings from './components/Settings';
import { evaluatePatient } from './ClinicalRulesEngine';

const initialPatientState = {
    imie_nazwisko: '', pesel: '', age: '', gender: '',
    height: '', weight: '', waist: '', hips: '',
    sbp: '', dbp: '', hr: '', spo2: '', rr: '', glucose: '', tc: '', ldl: '', hdl: '', tg: '', lpa: '', score2: '',
    smoking: false, alcohol: false, low_activity: false, bad_diet: false, diabetes: false,
    fh: false, ra: false, migraine: false,
    stress: false, sleep_apnea: false, pollution: false, sedentary: false, isolation: false,
    cvd: false, ckd: false, depression: false, cognitive: false, psychosocial: false, family_cvd: false, family_cancer: false, ticks_exposure: false,
    lung_cough: false, lung_dyspnea: false, lung_sputum: false, lung_hemoptysis: false, lung_weight_loss: false, lung_chest_pain: false,
    minicog_words: '', minicog_clock: '',
    last_fit: '', last_mammography: '',
    lab_morf: '', lab_kreatynina: '', egfr: '', lab_tsh: '', lab_mocz: '',
    lab_alt: '', lab_ast: '', lab_ggtp: '', lab_psa: '', lab_hcv: ''
};

const App = () => {
  const [activeTab, setActiveTab] = useState('ipz');
  const [patientData, setPatientData] = useState(initialPatientState);
  const [evaluation, setEvaluation] = useState({ flags: [], diagnostics: [], recommendations: [] });

  useEffect(() => {
    setEvaluation(evaluatePatient(patientData));
  }, [patientData]);

  const handleReset = () => {
    if (window.confirm("Na pewno wyczyścić formularz pacjenta?")) {
        setPatientData(initialPatientState);
    }
  };

  return (
    <>
      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <h1 style={{fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 800, margin: 0}}>MojeZdrowie POZ</h1>
        <button onClick={() => setActiveTab('ipz')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'ipz' ? 'var(--primary)' : 'var(--text-muted)'}}>📝 Wywiad IPZ</button>
        <button onClick={() => setActiveTab('settings')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)'}}>⚙️ Ustawienia</button>
      </div>

      {activeTab === 'ipz' ? (
        <div className="app-container" style={{paddingTop: '2rem'}}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem' }}>
              <button className="btn btn-secondary" onClick={handleReset} style={{color: 'var(--danger)', borderColor: '#fca5a5'}}>
                  🗑️ Nowy Pacjent (Resetuj)
              </button>
          </div>
          
          <div className="left-pane" style={{display: 'flex', flexDirection: 'column'}}>
            <PatientForm data={patientData} onChange={setPatientData} />
          </div>
          
          <div className="right-pane" style={{height: '100%'}}>
            <IPZDashboard evaluated={evaluation} rawData={patientData} />
          </div>
        </div>
      ) : (
        <Settings />
      )}
    </>
  );
};

export default App;

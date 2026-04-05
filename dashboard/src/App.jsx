import React, { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import IPZDashboard from './components/IPZDashboard';
import Settings from './components/Settings';
import { evaluatePatient } from './ClinicalRulesEngine';

import { getInitialPatientState, updatePatient } from './utils/patientsDb';
import PatientsDatabase from './components/PatientsDatabase';

const App = () => {
  const [activeTab, setActiveTab] = useState('database');
  const [patientData, setPatientData] = useState(getInitialPatientState());
  const [evaluation, setEvaluation] = useState({ flags: [], diagnostics: [], recommendations: [] });
  const [activePatientId, setActivePatientId] = useState(null);

  useEffect(() => {
    setEvaluation(evaluatePatient(patientData));
  }, [patientData]);

  const handleReset = () => {
    if (window.confirm("Na pewno wyczyścić formularz bieżącego wywiadu?")) {
        setPatientData(getInitialPatientState());
        setActivePatientId(null);
    }
  };

  const handleStartVisit = (patient) => {
      setPatientData(patient);
      setActivePatientId(patient.id);
      setActiveTab('ipz');
  };

  const handleSaveChangesToDb = () => {
      if (activePatientId) {
          updatePatient(activePatientId, { ...patientData, status: 'visited' });
          alert("Zachowano zaktualizowane dane pacjenta w bazie.");
      } else {
          alert("Ten pacjent nie został załadowany z Bazy Pacjentów.");
      }
  };

  return (
    <>
      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <h1 style={{fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 800, margin: 0}}>MojeZdrowie POZ</h1>
        <button onClick={() => setActiveTab('database')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'database' ? 'var(--primary)' : 'var(--text-muted)'}}>👥 Baza Pacjentów</button>
        <button onClick={() => setActiveTab('ipz')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'ipz' ? 'var(--primary)' : 'var(--text-muted)'}}>📝 Wywiad IPZ {activePatientId ? '(W toku)' : ''}</button>
        <button onClick={() => setActiveTab('settings')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)'}}>⚙️ Ustawienia</button>
      </div>

      {activeTab === 'ipz' ? (
        <div className="app-container" style={{paddingTop: '2rem'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-1rem' }}>
              <div style={{color: 'var(--text-muted)', fontWeight: 600, alignSelf: 'center'}}>
                 {activePatientId ? `Bieżący pacjent: ${patientData.imie_nazwisko || 'Nieznany'} (${patientData.pesel || 'Brak PESEL'})` : 'Tryb: Niezapisany pacjent (Ad-hoc)'}
              </div>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                  {activePatientId && (
                      <button className="btn btn-primary" onClick={handleSaveChangesToDb}>
                          💾 Zapisz do Bazy
                      </button>
                  )}
                  <button className="btn btn-secondary" onClick={handleReset} style={{color: 'var(--danger)', borderColor: '#fca5a5'}}>
                      🗑️ Wyczyść formularz
                  </button>
              </div>
          </div>
          
          <div className="left-pane" style={{display: 'flex', flexDirection: 'column'}}>
            <PatientForm data={patientData} onChange={setPatientData} />
          </div>
          
          <div className="right-pane" style={{height: '100%'}}>
            <IPZDashboard evaluated={evaluation} rawData={patientData} />
          </div>
        </div>
      ) : activeTab === 'database' ? (
        <PatientsDatabase onStartVisit={handleStartVisit} />
      ) : (
        <Settings />
      )}
    </>
  );
};

export default App;

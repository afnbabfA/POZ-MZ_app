import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    providerName: '',
    facilityName: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('ipz_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const newSettings = { ...settings, [e.target.name]: e.target.value };
    setSettings(newSettings);
    localStorage.setItem('ipz_settings', JSON.stringify(newSettings));
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '2rem' }}>
      <h2 className="section-title">⚙️ Ustawienia Gabinetu</h2>
      <p className="text-muted" style={{marginBottom: '1.5rem'}}>
        Wprowadzone dane zostaną zapamiętane w Twojej przeglądarce i będą automatycznie drukowane na dokumentach PDF.
      </p>
      
      <div className="form-group">
        <label>Oznaczenie Lekarza / Pielęgniarki (np. Imię, Nazwisko, Tytuł)</label>
        <input 
            type="text" 
            className="form-control" 
            name="providerName" 
            value={settings.providerName} 
            onChange={handleChange} 
            placeholder="Wpisz swoje dane..." 
        />
      </div>

      <div className="form-group">
        <label>Nazwa Placówki / Pieczątka Nagłówkowa (Wiele linii)</label>
        <textarea 
            className="form-control" 
            name="facilityName" 
            value={settings.facilityName} 
            onChange={handleChange} 
            placeholder="NZOZ Przychodnia Rodzinna&#10;ul. Przykładowa 14&#10;00-000 Warszawa"
            rows="4"
        />
      </div>
      
      <div className="alert alert-success" style={{marginTop: '2rem'}}>
        <span className="alert-icon">✅</span>
        Zapisano lokalnie. Możesz wrócić do zakładki IPZ.
      </div>
    </div>
  );
};

export default Settings;

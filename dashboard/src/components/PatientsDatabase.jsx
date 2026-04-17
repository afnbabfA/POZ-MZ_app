import React, { useState } from 'react';
import { getPatients, deletePatient, generateMockPatients, addPatient, updatePatient } from '../utils/patientsDb';
import PreVisitForm from './PreVisitForm';

const PatientsDatabase = ({ onStartVisit }) => {
    const [patients, setPatients] = useState(getPatients);
    const [editingPatient, setEditingPatient] = useState(null); // When defined, we are in Edit Prep mode
    const [searchQuery, setSearchQuery] = useState('');
    const [hideCompleted, setHideCompleted] = useState(false);

    const loadPatients = () => {
        setPatients(getPatients());
    };

    const handleGenerateMocks = () => {
        generateMockPatients();
        loadPatients();
    };

    const handleAddEmpty = () => {
        const p = addPatient({
            imie_nazwisko: 'Nowy Pacjent',
            pesel: '',
            visitCompleted: false
        });
        setEditingPatient(p);
    };

    const handleDelete = (id) => {
        if (window.confirm("Na pewno usunąć pacjenta z bazy?")) {
            deletePatient(id);
            loadPatients();
        }
    };

    const handleEditPrep = (patient) => {
        setEditingPatient({ ...patient });
    };

    const handleSavePrep = () => {
        if (editingPatient && editingPatient.id) {
            updatePatient(editingPatient.id, { ...editingPatient, status: 'in_prep' });
            setEditingPatient(null);
            loadPatients();
        }
    };

    const handleCancelPrep = () => {
        setEditingPatient(null);
        loadPatients();
    };

    const handleToggleCompleted = (patient) => {
        updatePatient(patient.id, { ...patient, visitCompleted: !patient.visitCompleted });
        loadPatients();
    };

    if (editingPatient) {
        return (
            <div className="app-container" style={{paddingTop: '2rem'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 style={{margin: 0, color: 'var(--primary)'}}>Wypełnianie ankiet/wyników: {editingPatient.imie_nazwisko || 'Pacjent'}</h2>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button className="btn btn-secondary" onClick={handleCancelPrep}>❌ Anuluj</button>
                        <button className="btn btn-primary" onClick={handleSavePrep}>💾 Zapisz i Wróć</button>
                    </div>
                </div>
                <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
                     <PreVisitForm data={editingPatient} onChange={setEditingPatient} />
                </div>
            </div>
        );
    }

    const filteredPatients = patients.filter(p => {
        if (hideCompleted && p.visitCompleted) return false;
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const nameMatch = p.imie_nazwisko && p.imie_nazwisko.toLowerCase().includes(query);
            const peselMatch = p.pesel && String(p.pesel).includes(query);
            if (!nameMatch && !peselMatch) return false;
        }
        return true;
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem', marginTop: 0 }}>Baza Pacjentów</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Zarządzaj ankietami i wynikami pacjentów przed ich wizytą podsumowującą.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={handleGenerateMocks}>
                        🪄 Generuj Przykładowych (Hurtowo)
                    </button>
                    <button className="btn btn-primary" onClick={handleAddEmpty}>
                        ✚ Dodaj Pacjenta
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '400px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Szukaj (Imię, Nazwisko, PESEL)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '35px', width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: '#334155' }}>
                        <input 
                            type="checkbox" 
                            checked={hideCompleted}
                            onChange={(e) => setHideCompleted(e.target.checked)}
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        Ukryj zrealizowane wizyty
                    </label>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Imię i Nazwisko</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>PESEL</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Stan Wypełnienia</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status Wizyty</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {patients.length > 0 ? 'Brak pacjentów spełniających kryteria.' : 'Baza pacjentów jest pusta. Dodaj pacjentów.'}
                                </td>
                            </tr>
                        ) : (
                            filteredPatients.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', background: p.visitCompleted ? '#f8fafc' : 'white', opacity: p.visitCompleted ? 0.7 : 1 }}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: p.visitCompleted ? '#94a3b8' : 'inherit' }}>{p.imie_nazwisko || '---'}</td>
                                    <td style={{ padding: '1rem', color: p.visitCompleted ? '#94a3b8' : 'var(--text-muted)' }}>{p.pesel || '---'}</td>
                                    <td style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: p.surveyCompleted ? '#dcfce7' : '#f1f5f9', color: p.surveyCompleted ? '#166534' : '#64748b' }}>
                                                {p.surveyCompleted ? '📋✓' : '📋...'} Ankieta
                                            </span>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: p.labsCompleted ? '#f3e8ff' : '#f1f5f9', color: p.labsCompleted ? '#6b21a8' : '#64748b' }}>
                                                {p.labsCompleted ? '🧪✓' : '🧪...'} Lab
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'left' }}>
                                        <button 
                                            onClick={() => handleToggleCompleted(p)}
                                            style={{ 
                                                border: 'none', background: 'transparent', cursor: 'pointer', 
                                                display: 'flex', alignItems: 'center', gap: '0.4rem', 
                                                color: p.visitCompleted ? '#10b981' : '#f59e0b', fontWeight: 600, fontSize: '0.9rem'
                                            }}
                                        >
                                            {p.visitCompleted ? '🟢 Zrealizowana' : '🟠 Oczekująca'}
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn" style={{ padding: '0.4rem 0.8rem', background: '#f1f5f9', color: '#0f172a' }} onClick={() => handleEditPrep(p)}>
                                            ✍️ Uzupełnij Dane
                                        </button>
                                        {!p.visitCompleted && (
                                            <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'var(--primary)', color: 'white' }} onClick={() => onStartVisit(p)}>
                                                🩺 Rozpocznij Wizytę
                                            </button>
                                        )}
                                        <button className="btn" style={{ padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#b91c1c' }} onClick={() => handleDelete(p.id)}>
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientsDatabase;

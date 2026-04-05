import React, { useState, useEffect } from 'react';
import { getPatients, deletePatient, generateMockPatients, addPatient, updatePatient } from '../utils/patientsDb';
import PatientForm from './PatientForm';

const PatientsDatabase = ({ onStartVisit }) => {
    const [patients, setPatients] = useState(getPatients);
    const [editingPatient, setEditingPatient] = useState(null); // When defined, we are in Edit Prep mode

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
                <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
                     {/* We reuse PatientForm just for its nice sections. 
                         In prep mode, it just edits state, without the dashboard running on the right */}
                     <PatientForm data={editingPatient} onChange={setEditingPatient} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
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

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Imię i Nazwisko</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>PESEL</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Baza pacjentów jest pusta. Dodaj pacjentów lub wygeneruj przykładowych.
                                </td>
                            </tr>
                        ) : (
                            patients.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{p.imie_nazwisko || '---'}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{p.pesel || '---'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {p.status === 'visited' ? (
                                            <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>Po  wizycie</span>
                                        ) : p.status === 'in_prep' ? (
                                            <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>Wypełniono dane</span>
                                        ) : (
                                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>Nowy</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn" style={{ padding: '0.4rem 0.8rem', background: '#f1f5f9', color: '#0f172a' }} onClick={() => handleEditPrep(p)}>
                                            ✍️ Ankiety / Wyniki
                                        </button>
                                        <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'var(--primary)', color: 'white' }} onClick={() => onStartVisit(p)}>
                                            🩺 Rozpocznij Wizytę
                                        </button>
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

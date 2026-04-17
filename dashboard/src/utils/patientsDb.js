export const DB_KEY = 'mz_patients_db';

export const getInitialPatientState = () => ({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'new', // new, in_prep, ready, visited
    surveyCompleted: false,
    labsCompleted: false,
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
});

export const getPatients = () => {
    try {
        const data = localStorage.getItem(DB_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading patients DB", e);
    }
    return [];
};

export const savePatients = (patients) => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(patients));
    } catch (e) {
        console.error("Error saving patients DB", e);
    }
};

export const addPatient = (patientData = {}) => {
    const patients = getPatients();
    const newPatient = { ...getInitialPatientState(), ...patientData };
    patients.push(newPatient);
    savePatients(patients);
    return newPatient;
};

export const updatePatient = (id, patientData) => {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index !== -1) {
        patients[index] = { ...patients[index], ...patientData };
        savePatients(patients);
        return patients[index];
    }
    return null;
};

export const deletePatient = (id) => {
    const patients = getPatients();
    const newPatients = patients.filter(p => p.id !== id);
    savePatients(newPatients);
};

export const generateMockPatients = () => {
    const mocks = [
        { imie_nazwisko: 'Jan Kowalski', pesel: '80010112345', age: '45', gender: 'M' },
        { imie_nazwisko: 'Anna Nowak', pesel: '75031267890', age: '50', gender: 'F' },
        { imie_nazwisko: 'Piotr Wiśniewski', pesel: '60052011111', age: '65', gender: 'M' },
        { imie_nazwisko: 'Maria Wójcik', pesel: '92081522222', age: '33', gender: 'F' },
        { imie_nazwisko: 'Tomasz Kowalczyk', pesel: '55110133333', age: '70', gender: 'M' }
    ];

    const patients = getPatients();
    mocks.forEach(m => {
        const p = { ...getInitialPatientState(), ...m };
        patients.push(p);
    });
    savePatients(patients);
};

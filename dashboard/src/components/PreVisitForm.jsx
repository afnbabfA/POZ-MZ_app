import React from 'react';
import { analyzePesel } from '../utils/peselUtils';

const SurveyQuestion = ({ number, title, name, data, onChange, options = [], type = 'radio' }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.25rem', padding: '1rem', background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <div style={{ fontWeight: 600, color: '#334155', fontSize: '1rem' }}>
                <span style={{ color: 'var(--primary)', marginRight: '0.5rem', opacity: 0.8 }}>{number}.</span>{title}
            </div>
            {type === 'radio' ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.2rem' }}>
                    {options.map((opt, i) => {
                        const isChecked = data[name] === opt;
                        return (
                            <label key={i} style={{ 
                                display: 'inline-flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem',
                                padding: '0.5rem 1rem', borderRadius: '99px',
                                background: isChecked ? 'var(--primary)' : '#f8fafc',
                                color: isChecked ? 'white' : '#475569',
                                border: `1px solid ${isChecked ? 'var(--primary)' : '#e2e8f0'}`,
                                transition: 'all 0.2s ease',
                                fontWeight: isChecked ? 600 : 500,
                                boxShadow: isChecked ? '0 2px 5px rgba(59, 130, 246, 0.3)' : 'none',
                                userSelect: 'none'
                            }}>
                                <input 
                                    type="radio" 
                                    name={name} 
                                    checked={isChecked} 
                                    onChange={() => onChange({ target: { name, type: 'radio', value: opt } })} 
                                    style={{ display: 'none' }} 
                                />
                                {opt}
                            </label>
                        );
                    })}
                </div>
            ) : type === 'number' ? (
                <div style={{ marginTop: '0.2rem' }}>
                    <input 
                        type="number" 
                        name={name} 
                        value={data[name] || ''} 
                        onChange={onChange} 
                        className="form-control" 
                        style={{ maxWidth: '200px', fontSize: '1.1rem', fontWeight: 600, padding: '0.6rem 1rem' }} 
                        placeholder="Wpisz wartość..."
                    />
                </div>
            ) : null}
        </div>
    );
};

const PreVisitForm = ({ data, onChange }) => {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : (type === 'number' && value !== '' ? Number(value) : value);
        let newData = { ...data, [name]: newValue };

        if (name === 'pesel' && String(newValue).length === 11) {
            const parsed = analyzePesel(String(newValue));
            if (parsed) {
                if (!newData.age) newData.age = parsed.age;
                newData.gender = parsed.gender;
            }
        }
        onChange(newData);
    };

    const handleMarkSurveyCompleted = () => {
        onChange({ ...data, surveyCompleted: !data.surveyCompleted });
    };

    const handleMarkLabsCompleted = () => {
        onChange({ ...data, labsCompleted: !data.labsCompleted });
    };

    const bmi = (data.weight && data.height) ? (data.weight / Math.pow(data.height / 100, 2)).toFixed(1) : '';

    const age = Number(data.age) || 0;
    const isSenior = age >= 60;
    const formTitle = age ? (isSenior ? "KW-60+ (Z rozszerzeniem Mini-COG)" : "KW-podstawowy") : "Wpisz PESEL/wiek aby określić wariant ankiety MZ";

    const tkNieOpcje = ['Tak', 'Nie'];
    const tkNieNW = ['Tak', 'Nie', 'Nie wiem'];
    const tkNieTrd = ['Tak', 'Nie', 'Trudno powiedzieć'];

    const showCancerTypes = data.family_cancer === 'Tak';
    const showAlcoholDetails = data.alcohol_any === 'Tak';
    const showSmokingDetails = data.smoking_status === 'Tak, papierosy' || data.smoking_status === 'Tak, tytoń podgrzewany';
    const showPastSmoking15y = data.smoking_past === 'Tak';
    const showPHQ9Continuation = data.phq_1 === 'Tak' && data.phq_2 === 'Tak';

    const phqOptions = ['Wcale nie dokuczały', 'Kilka dni', 'Więcej niż połowę dni', 'Niemal codziennie'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* KROK 1: KWESTIONARIUSZ */}
            <div className="card" style={{ borderLeft: '4px solid #3b82f6', background: data.surveyCompleted ? '#f0f9ff' : 'white', fontFamily: 'serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #cbd5e1' }}>
                    <div>
                        <h3 style={{ margin: 0, color: 'var(--text)', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>CZĘŚĆ 1 - KWESTIONARIUSZ PIERWOTNY</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>Wariant: {formTitle}</p>
                    </div>
                    <button 
                        className="btn" 
                        style={{ background: data.surveyCompleted ? '#10b981' : '#f1f5f9', color: data.surveyCompleted ? 'white' : 'var(--text)', fontWeight: 600, fontFamily: 'sans-serif' }}
                        onClick={handleMarkSurveyCompleted}
                    >
                        {data.surveyCompleted ? '✅ Ankieta oznaczona jako wypełniona' : 'Oznacz ankietę jako wypełnioną'}
                    </button>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Imię i nazwisko</label>
                            <input type="text" className="form-control" name="imie_nazwisko" value={data.imie_nazwisko || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">PESEL</label>
                            <input type="text" className="form-control" name="pesel" value={data.pesel || ''} onChange={handleChange} maxLength={11} />
                        </div>
                        <div>
                            <label className="form-label">Wiek pacjenta</label>
                            <input type="number" className="form-control" name="age" value={data.age || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">Płeć</label>
                            <select className="form-control" name="gender" value={data.gender || ''} onChange={handleChange}>
                                <option value="">Wybierz...</option>
                                <option value="M">Mężczyzna</option>
                                <option value="F">Kobieta</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ fontFamily: 'sans-serif' }}>
                    <h4 style={{ background: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '4px' }}>DANE PODSTAWOWE</h4>
                    <SurveyQuestion number="1.1" title="WZROST (cm)" name="height" type="number" data={data} onChange={handleChange} />
                    <SurveyQuestion number="1.2" title="MASA CIAŁA (kg)" name="weight" type="number" data={data} onChange={handleChange} />
                    <div style={{ marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>1.3. BMI (kg/m²): </span>
                        <strong style={{ fontSize: '1.1rem', color: bmi ? (bmi >= 30 ? 'var(--danger)' : bmi >= 25 ? 'var(--warning)' : 'var(--success)') : 'inherit' }}>{bmi || '--'}</strong>
                    </div>

                    <h4 style={{ background: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '4px' }}>WYWIAD ŚRODOWISKOWY</h4>
                    <SurveyQuestion number="2.1" title="Wykształcenie" name="education" options={['Podstawowe', 'Gimnazjalne', 'Zawodowe/średnie', 'Wyższe']} data={data} onChange={handleChange} />
                    <SurveyQuestion number="2.2" title="Czy mieszkasz sam/a?" name="lives_alone" options={tkNieOpcje} data={data} onChange={handleChange} />

                    <h4 style={{ background: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '4px' }}>WYWIAD RODZINNY</h4>
                    <SurveyQuestion number="3.1" title="Czy u ojca rozpoznano przed 55. rokiem życia: Udar mózgu?" name="family_father_stroke" options={tkNieNW} data={data} onChange={handleChange} />
                    <SurveyQuestion number="3.2" title="Czy u ojca rozpoznano przed 55. rokiem życia: Zawał serca?" name="family_father_heart_attack" options={tkNieNW} data={data} onChange={handleChange} />
                    <SurveyQuestion number="3.3" title="Czy u matki rozpoznano przed 65. rokiem życia: Udar mózgu?" name="family_mother_stroke" options={tkNieNW} data={data} onChange={handleChange} />
                    <SurveyQuestion number="3.4" title="Czy u matki rozpoznano przed 65. rokiem życia: Zawał serca?" name="family_mother_heart_attack" options={tkNieNW} data={data} onChange={handleChange} />
                    
                    <SurveyQuestion number="4.1" title="Czy występowały w rodzinie (u rodziców, dzieci, rodzeństwa) nowotwory złośliwe?" name="family_cancer" options={tkNieNW} data={data} onChange={handleChange} />
                    
                    {showCancerTypes && (
                        <div style={{ background: '#fff1f2', padding: '1rem', borderLeft: '4px solid #f43f5e', marginBottom: '1.5rem', borderRadius: '4px' }}>
                            <p style={{ color: '#be123c', fontSize: '0.85rem', marginTop: 0, fontWeight: 600 }}>Pytania warunkowe - zaznaczono TAK w wywiadzie nowotworowym</p>
                            <SurveyQuestion number="4.2" title="Rak piersi" name="cancer_breast" options={tkNieNW} data={data} onChange={handleChange} />
                            <SurveyQuestion number="4.3" title="Rak jajnika" name="cancer_ovary" options={tkNieNW} data={data} onChange={handleChange} />
                            <SurveyQuestion number="4.4" title="Rak trzonu macicy" name="cancer_endometrial" options={tkNieNW} data={data} onChange={handleChange} />
                            <SurveyQuestion number="4.5" title="Rak jelita grubego lub odbytnicy" name="cancer_colorectal" options={tkNieNW} data={data} onChange={handleChange} />
                            <SurveyQuestion number="4.6" title="Rak żołądka" name="cancer_stomach" options={tkNieNW} data={data} onChange={handleChange} />
                            <SurveyQuestion number="4.7" title="Rak nerki" name="cancer_kidney" options={tkNieNW} data={data} onChange={handleChange} />
                        </div>
                    )}

                    <h4 style={{ background: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '4px' }}>STYL ŻYCIA</h4>
                    <SurveyQuestion number="5.1" title="Czy pijesz min. 1,5 litra wody lub innych płynów (z wyłączeniem słodkich napojów) dziennie?" name="lifestyle_water" options={tkNieTrd} data={data} onChange={handleChange} />
                    <SurveyQuestion number="5.2" title="Czy ograniczasz spożycie tłuszczów zwierzęcych i zastępujesz je naturalnymi tłuszczami roślinnymi?" name="lifestyle_fats" options={tkNieTrd} data={data} onChange={handleChange} />
                    <SurveyQuestion number="5.3" title="Czy ograniczasz spożycie soli do 5 gramów dziennie (jedna płaska łyżeczka)?" name="lifestyle_salt" options={tkNieTrd} data={data} onChange={handleChange} />
                    <SurveyQuestion number="5.4" title="Czy codziennie jesz warzywa i/lub owoce (z wyłączeniem ziemniaków)?" name="lifestyle_vegetables" options={tkNieTrd} data={data} onChange={handleChange} />
                    <SurveyQuestion number="6.1" title="Czy w tygodniu wykonujesz co najmniej 150 minut wysiłku umiarkowanego lub co najmniej 75 minut wysiłku intensywnego?" name="lifestyle_exercise" options={tkNieTrd} data={data} onChange={handleChange} />
                    
                    <SurveyQuestion number="7.1" title="Czy spożywasz napoje alkoholowe w jakiejkolwiek postaci?" name="alcohol_any" options={tkNieOpcje} data={data} onChange={handleChange} />
                    {showAlcoholDetails && (
                        <div style={{ background: '#fff7ed', padding: '1rem', borderLeft: '4px solid #f97316', marginBottom: '1.5rem', borderRadius: '4px' }}>
                            <SurveyQuestion number="7.2" title="Jak często pijesz napoje zawierające alkohol?" name="alcohol_freq" options={['Nigdy', 'Raz w miesiącu lub rzadziej', '2-4 razy w miesiącu', '2-3 razy w tygodniu', 'Częściej niż 4 razy w tygodniu']} data={data} onChange={handleChange} />
                            <SurveyQuestion number="7.3" title="Ile porcji alkoholu wypijasz przeciętnie?" name="alcohol_amount" options={['1-2 porcje', '3-4 porcje', '5-6 porcji', '7-9 porcji', '10 lub więcej']} data={data} onChange={handleChange} />
                            <SurveyQuestion number="7.4" title="Jak często wypijasz 6 lub więcej porcji przy jednej okazji?" name="alcohol_binge" options={['Nigdy', 'Rzadziej niż raz w miesiącu', 'Raz w miesiącu', 'Raz w tygodniu', 'Codziennie lub prawie codziennie']} data={data} onChange={handleChange} />
                        </div>
                    )}

                    <SurveyQuestion number="8.1" title="Czy aktualnie palisz papierosy lub używasz wyrobów zawierających nikotynę?" name="smoking_status" options={['Tak, papierosy', 'Tak, tytoń podgrzewany', 'Tak, liquid', 'Nie']} data={data} onChange={handleChange} />
                    {showSmokingDetails && (
                        <div style={{ background: '#f5f3ff', padding: '1rem', borderLeft: '4px solid #8b5cf6', marginBottom: '1.5rem', borderRadius: '4px' }}>
                            <SurveyQuestion number="8.2" title="Ile miałeś/aś lat, gdy rozpocząłeś/aś palenie papierosów lub innych wyrobów tytoniowych?" name="smoking_start_age" type="number" data={data} onChange={handleChange} />
                            <SurveyQuestion number="8.3" title="Kiedy po obudzeniu wypalasz pierwszego papierosa lub inny wyrób tytoniowy?" name="smoking_first_morning" options={['Krócej niż 5 minut', '5-30 minut', '30-60 minut', 'Dłużej niż 60 minut']} data={data} onChange={handleChange} />
                            <SurveyQuestion number="8.4" title="Ile sztuk papierosów lub innych wyrobów tytoniowych wypalasz każdego dnia?" name="smoking_amount_per_day" options={['Do 10', '11-20', '21-30', 'Powyżej 30']} data={data} onChange={handleChange} />
                        </div>
                    )}
                    
                    <SurveyQuestion number="8.5" title="Czy paliłeś/aś papierosy lub inne wyroby tytoniowe w przeszłości?" name="smoking_past" options={tkNieOpcje} data={data} onChange={handleChange} />
                    {showPastSmoking15y && (
                        <div style={{ background: '#f5f3ff', padding: '1rem', borderLeft: '4px solid #8b5cf6', marginBottom: '1.5rem', borderRadius: '4px' }}>
                            <SurveyQuestion number="8.6" title="Czy od momentu rzucenia palenia minęło ponad 15 lat?" name="smoking_past_15_years" options={tkNieOpcje} data={data} onChange={handleChange} />
                        </div>
                    )}
                    
                    <SurveyQuestion number="8.7" title="Czy w twojej obecności w domu lub/i pracy pali się papierosy lub inne wyroby tytoniowe?" name="smoking_passive" options={tkNieOpcje} data={data} onChange={handleChange} />

                    <h4 style={{ background: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '4px' }}>CZYNNIKI RYZYKA CHOROBY WIRUSOWEJ WĄTROBY</h4>
                    <SurveyQuestion number="9" title="Czy było u ciebie podejrzenie lub rozpoznanie jakiejkolwiek choroby wątroby?" name="liver_disease" options={tkNieOpcje} data={data} onChange={handleChange} />
                    <SurveyQuestion number="10" title="Czy byłeś/aś leczony/a w szpitalu co najmniej 3 razy?" name="hospitalized_3_times" options={tkNieOpcje} data={data} onChange={handleChange} />
                    <SurveyQuestion number="11" title="Czy kiedykolwiek miałeś/aś wykonany zabieg operacyjny lub badanie endoskopowe?" name="surgery_endoscopy" options={tkNieOpcje} data={data} onChange={handleChange} />
                    <SurveyQuestion number="12" title="Czy miałeś/aś przetaczaną krew lub produkty krwiopochodne przed rokiem 1992?" name="blood_transfusion" options={tkNieOpcje} data={data} onChange={handleChange} />
                    <SurveyQuestion number="13" title="Czy kiedykolwiek miałeś/aś wykonany tatuaż lub piercing, albo inne zabiegi z naruszeniem ciągłości skóry?" name="tattoo_piercing" options={tkNieOpcje} data={data} onChange={handleChange} />

                    <h4 style={{ background: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '4px' }}>ZDROWIE PSYCHICZNE</h4>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Czy w ciągu ostatnich 2 tygodni występowało u Ciebie:</div>
                    <SurveyQuestion number="14.1" title="Zaniepokojenie z powodu swojego przygnębienia, depresyjnego nastroju lub poczucia beznadziei?" name="phq_1" options={tkNieOpcje} data={data} onChange={handleChange} />
                    <SurveyQuestion number="14.2" title="Odczuwanie zmniejszonego zainteresowania lub przyjemności podczas wykonywania różnych czynności?" name="phq_2" options={tkNieOpcje} data={data} onChange={handleChange} />

                    {showPHQ9Continuation && (
                        <div style={{ background: '#f0fdfa', padding: '1rem', borderLeft: '4px solid #14b8a6', marginBottom: '1.5rem', borderRadius: '4px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#0f766e', marginBottom: '1rem', fontWeight: 600 }}>Jak często w ciągu ostatnich 2 tygodni odczuwałeś/aś:</div>
                            <SurveyQuestion number="14.3" title="Niewielkie zainteresowane lub odczuwanie przyjemności z wykonywania czynności?" name="phq_3" options={phqOptions} data={data} onChange={handleChange} />
                            <SurveyQuestion number="14.4" title="Uczucie smutku, przygnębienia lub beznadziejności?" name="phq_4" options={phqOptions} data={data} onChange={handleChange} />
                            <SurveyQuestion number="14.5" title="Kłopoty z zaśnięciem lub przerywany albo zbyt długi sen?" name="phq_5" options={phqOptions} data={data} onChange={handleChange} />
                            <SurveyQuestion number="14.6" title="Uczucie zmęczenia lub brak energii?" name="phq_6" options={phqOptions} data={data} onChange={handleChange} />
                            <SurveyQuestion number="14.7" title="Brak apetytu lub przejadanie się?" name="phq_7" options={phqOptions} data={data} onChange={handleChange} />
                            <SurveyQuestion number="14.8" title="Poczucie niezadowolenia z siebie lub uczucie, że zawiodłeś/aś siebie lub rodzinę?" name="phq_8" options={phqOptions} data={data} onChange={handleChange} />
                            <SurveyQuestion number="14.9" title="Problemy ze skupieniem się, np. przy czytaniu lub oglądaniu telewizji?" name="phq_9" options={phqOptions} data={data} onChange={handleChange} />
                            <SurveyQuestion number="14.10" title="Poruszanie się lub mówienie tak wolno, że inni mogliby to zauważyć? Albo wręcz przeciwnie?" name="phq_10" options={phqOptions} data={data} onChange={handleChange} />
                            <SurveyQuestion number="14.11" title="Myśli, że lepiej byłoby umrzeć albo chęć zrobienia sobie jakiejś krzywdy?" name="phq_11" options={phqOptions} data={data} onChange={handleChange} />
                        </div>
                    )}

                    {isSenior && (
                        <>
                            <h4 style={{ background: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '4px' }}>OCENA FUNKCJI POZNAWCZYCH (Zalecenie mini-COG przy odp. Tak)</h4>
                            <SurveyQuestion number="15" title="Czy zaobserwowałeś (lub bliscy zauważyli), że masz problem z zapamiętywaniem/przypomnieniem sobie słów?" name="cog_memory" options={tkNieOpcje} data={data} onChange={handleChange} />
                            <SurveyQuestion number="16" title="Czy masz problem z planowaniem i realizacją czynności jak robienie zakupów, opłacanie rachunków?" name="cog_planning" options={tkNieOpcje} data={data} onChange={handleChange} />
                            <SurveyQuestion number="17" title="Czy zdarza Ci się być zdezorientowanym co do miejsca i czasu?" name="cog_orientation" options={tkNieOpcje} data={data} onChange={handleChange} />
                            
                            {(data.cog_memory === 'Tak' || data.cog_planning === 'Tak' || data.cog_orientation === 'Tak') && (
                                <div style={{ background: '#fef2f2', padding: '0.8rem', borderRadius: '4px', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.9rem', fontWeight: 600 }}>
                                    ⚠️ UWAGA: Obowiązkowo wykonaj rozszerzony test mini-COG w trakcie wizyty po analizie tej ankiety.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>


            {/* KROK 2: WYNIKI BADAŃ LABORATORYJNYCH */}
            <div className="card" style={{ borderLeft: '4px solid #8b5cf6', background: data.labsCompleted ? '#f5f3ff' : 'var(--card-bg)', fontFamily: 'sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, color: '#6d28d9' }}>🧪 CZĘŚĆ 2 - BADANIA LABORATORYJNE I ZGŁOSZONE POMIARY KLINICZNE</h3>
                    <button 
                        className="btn" 
                        style={{ background: data.labsCompleted ? '#10b981' : '#f1f5f9', color: data.labsCompleted ? 'white' : 'var(--text)', fontWeight: 600 }}
                        onClick={handleMarkLabsCompleted}
                    >
                        {data.labsCompleted ? '✅ Badania oznaczone jako wprowadzone' : 'Oznacz badania jako wprowadzone'}
                    </button>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Dane wpisane z wyników badań laboratoryjnych zgłoszonych po wystawieniu skierowania w wyniku powyższej ankiety.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label>TC (Całkowity - mg/dL)</label>
                        <input type="number" className="form-control" name="tc" value={data.tc || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>LDL (mg/dL)</label>
                        <input type="number" className="form-control" name="ldl" value={data.ldl || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>HDL (mg/dL)</label>
                        <input type="number" className="form-control" name="hdl" value={data.hdl || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Triglicerydy (mg/dL)</label>
                        <input type="number" className="form-control" name="tg" value={data.tg || ''} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label>Glukoza (mg/dL)</label>
                        <input type="number" className="form-control" name="glucose" value={data.glucose || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Kreatynina</label>
                        <input type="number" className="form-control" name="lab_kreatynina" value={data.lab_kreatynina || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>eGFR</label>
                        <input type="number" className="form-control" name="egfr" value={data.egfr || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>TSH</label>
                        <input type="number" className="form-control" name="lab_tsh" value={data.lab_tsh || ''} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label>ALT (U/L)</label>
                        <input type="number" className="form-control" name="lab_alt" value={data.lab_alt || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>AST (U/L)</label>
                        <input type="number" className="form-control" name="lab_ast" value={data.lab_ast || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>GGTP (U/L)</label>
                        <input type="number" className="form-control" name="lab_ggtp" value={data.lab_ggtp || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>PSA Całkowity</label>
                        <input type="number" className="form-control" name="lab_psa" value={data.lab_psa || ''} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Lipoproteina(a) (mg/dL)</label>
                        <input type="number" className="form-control" name="lpa" value={data.lpa || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Anty-HCV</label>
                        <select className="form-control" name="lab_hcv" value={data.lab_hcv || ''} onChange={handleChange}>
                            <option value="">Wybierz...</option>
                            <option value="ujemny">Ujemny</option>
                            <option value="dodatni">Dodatni</option>
                        </select>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default PreVisitForm;


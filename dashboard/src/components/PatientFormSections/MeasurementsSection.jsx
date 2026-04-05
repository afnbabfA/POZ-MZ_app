import React from 'react';
import LabelWithTooltip from './LabelWithTooltip';
import ToggleButtonGroup from '../common/ToggleButtonGroup';

const MeasurementsSection = ({ data, onChange, bmi, whr }) => {
  return (
    <>
      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0'}} />
      <h2 className="section-title">🚑 2. Pomiary i Wyniki (Wartości wpisane zaznaczą checkboxy)</h2>

      {/* Row 1: Wzrost, Waga, BMI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group">
          <label>Wzrost (cm)</label>
          <input type="number" className="form-control" name="height" value={data.height || ''} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Waga (kg)</label>
          <input type="number" className="form-control" name="weight" value={data.weight || ''} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>BMI</label>
          <input type="text" className="form-control" value={bmi} disabled style={{background: '#f1f5f9', cursor: 'not-allowed', fontWeight: 'bold'}} />
        </div>
      </div>

      {/* Row 2: Biodra, Pas, WHR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group">
            <label>Obwód Pasa (cm)</label>
            <input type="number" className="form-control" name="waist" value={data.waist || ''} onChange={onChange} />
        </div>
        <div className="form-group">
            <label>Obwód Bioder (cm)</label>
            <input type="number" className="form-control" name="hips" value={data.hips || ''} onChange={onChange} />
        </div>
        <div className="form-group">
            <label>WHR</label>
            <input type="text" className="form-control" value={whr} disabled style={{background: '#f1f5f9', cursor: 'not-allowed', fontWeight: 'bold'}} />
        </div>
      </div>

      {/* Row 3: sBP, dBP, HR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group">
          <label>sBP (skurcz.)</label>
          <input type="number" className="form-control" name="sbp" value={data.sbp || ''} onChange={onChange} placeholder="mmHg" />
        </div>
        <div className="form-group">
          <label>dBP (rozkurcz.)</label>
          <input type="number" className="form-control" name="dbp" value={data.dbp || ''} onChange={onChange} placeholder="mmHg" />
        </div>
        <div className="form-group">
          <label>Tętno HR (/min)</label>
          <input type="number" className="form-control" name="hr" value={data.hr || ''} onChange={onChange} />
        </div>
      </div>

      {/* Row 4: TC, LDL, HDL, TG, Diabetes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group" style={{position: 'relative'}}>
          <LabelWithTooltip label="Chol. Całk (TC)" tooltipText="Norma < 190 mg/dL. Powyżej weryfikacja pod kątem hipercholesterolemii." />
          <input type="number" className="form-control" name="tc" value={data.tc || ''} onChange={onChange} />
        </div>
        <div className="form-group" style={{position: 'relative'}}>
          <LabelWithTooltip label="LDL (mg/dL)" tooltipText="Norma dla zdrowych < 115 mg/dL. Ulega modyfikacji zależnie od SCORE2." />
          <input type="number" className="form-control" name="ldl" value={data.ldl || ''} onChange={onChange} />
        </div>
        <div className="form-group" style={{position: 'relative'}}>
          <label>HDL (mg/dL)</label>
          <input type="number" className="form-control" name="hdl" value={data.hdl || ''} onChange={onChange} />
        </div>
        <div className="form-group" style={{position: 'relative'}}>
          <LabelWithTooltip label="Triglicerydy" tooltipText="Norma < 150 mg/dL." />
          <input type="number" className="form-control" name="tg" value={data.tg || ''} onChange={onChange} />
        </div>
        <div className="form-group toggle-wrapper" style={{display: 'flex', flexDirection: 'column', marginTop: '1.2rem', marginBottom: 0}}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" name="diabetes" checked={data.diabetes || false} onChange={onChange} />
                Cukrzyca
            </label>
        </div>
      </div>

      {/* Row 5: Smoking, Other SCORE2 Conditions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group toggle-wrapper" style={{display: 'flex', flexDirection: 'column', marginTop: '1.2rem', marginBottom: 0}}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" name="smoking" checked={data.smoking || false} onChange={onChange} />
                Pali papierosy
            </label>
        </div>
        <div className="form-group" style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end'}}>
            <label style={{ width: '100%', fontSize: '0.85rem' }}>Schorzenia dodatkowe (Wpływ na SCORE2 / Ryzyko)</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                <input type="checkbox" name="fh" checked={data.fh || false} onChange={onChange} />
                Rodzinna hipercholesterolemia (FH)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                <input type="checkbox" name="ra" checked={data.ra || false} onChange={onChange} />
                RZS / Ch. Zapalne
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                <input type="checkbox" name="migraine" checked={data.migraine || false} onChange={onChange} />
                Częste Migreny
            </label>
        </div>
      </div>

      {/* Row 6: Czynniki cywilizacyjne środowiskowe */}
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#334155' }}>Współczesne czynniki chorób cywilizacyjnych</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" name="stress" checked={data.stress || false} onChange={onChange} />
                <strong>Obciążenie psychospołeczne</strong> <span style={{color: '#64748b', fontSize: '0.8rem', marginLeft: '0.3rem'}}>(przewlekły stres, wypalenie, samotność)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" name="sleep_apnea" checked={data.sleep_apnea || false} onChange={onChange} />
                <strong>Zaburzenia rytmu dobowego i snu</strong> <span style={{color: '#64748b', fontSize: '0.8rem', marginLeft: '0.3rem'}}>(praca zmianowa, bezdech, bezsenność)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" name="pollution" checked={data.pollution || false} onChange={onChange} />
                <strong>Środowiskowe czynniki ryzyka</strong> <span style={{color: '#64748b', fontSize: '0.8rem', marginLeft: '0.3rem'}}>(smog, zanieczyszczenia i toksyny w pracy)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" name="sedentary" checked={data.sedentary || false} onChange={onChange} />
                <strong>Skrajne obciążenie metaboliczne</strong> <span style={{color: '#64748b', fontSize: '0.8rem', marginLeft: '0.3rem'}}>(skrajnie siedzący tryb życia np. {'>'}8h)</span>
            </label>
        </div>
      </div>

      {/* Wywiad w kierunku chorób płuc (POChP / NPL) - WIDOCZNY TYLKO JEŚLI PALACZ lub NARAŻENIE NA SMOG */}
      {(data.smoking || data.pollution) && (
      <div style={{ background: '#fff1f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecdd3', marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#9f1239', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span> Pogłębiony wywiad z zakresu chorób płuc (POChP / NPL)
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#be123c', marginBottom: '1rem', marginTop: 0 }}>
            Pacjent obciążony ryzykiem (Palenie tytoniu lub toksyny środowiskowe). Zaznacz zgłaszane przez pacjenta objawy z dróg oddechowych.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Objawy sprzyjające POChP / Astmie */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <strong style={{ fontSize: '0.8rem', color: '#881337', textTransform: 'uppercase' }}>Podejrzenie duszności / POChP</strong>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#4c0519' }}>
                    <input type="checkbox" name="lung_cough" checked={data.lung_cough || false} onChange={onChange} />
                    Przewlekły lub okresowy kaszel (nieproduktywny)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#4c0519' }}>
                    <input type="checkbox" name="lung_dyspnea" checked={data.lung_dyspnea || false} onChange={onChange} />
                    Utrzymująca się / narastająca duszność wysiłkowa
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#4c0519' }}>
                    <input type="checkbox" name="lung_sputum" checked={data.lung_sputum || false} onChange={onChange} />
                    Przewlekłe odkrztuszanie plwociny / częste infekcje
                </label>
            </div>
            
            {/* Objawy alarmowe NPL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderLeft: '1px solid #fda4af', paddingLeft: '1rem' }}>
                <strong style={{ fontSize: '0.8rem', color: '#881337', textTransform: 'uppercase' }}>Flagi nowotworowe płuc (NPL)</strong>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#4c0519', fontWeight: 600 }}>
                    <input type="checkbox" name="lung_hemoptysis" checked={data.lung_hemoptysis || false} onChange={onChange} />
                    Krwioplucie
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#4c0519', fontWeight: 600 }}>
                    <input type="checkbox" name="lung_weight_loss" checked={data.lung_weight_loss || false} onChange={onChange} />
                    Niezamierzony spadek wagi / utrata łaknienia
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#4c0519', fontWeight: 600 }}>
                    <input type="checkbox" name="lung_chest_pain" checked={data.lung_chest_pain || false} onChange={onChange} />
                    Bóle / uczucie ściskania w klatce piersiowej
                </label>
            </div>
        </div>
      </div>
      )}

      {/* Row 6: SCORE2 Score */}
      <div style={{ marginBottom: '1rem' }}>
        <div className="form-group">
          <label>Ryzyko SCORE2 (%) <span className="text-muted" style={{fontSize:'0.8rem'}}>(Zostaw miejsce na modyfikacje algorytmu API)</span></label>
          <input type="number" className="form-control" name="score2" value={data.score2 || ''} onChange={onChange} style={{maxWidth: '200px'}} />
        </div>
      </div>

      {/* Wywiad dla pacjentów 60+ (mini-COG) */}
      {Number(data.age) >= 60 && (
      <div style={{ background: '#f5f3ff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd6fe', marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🧠</span> Ocena Zdolności Poznawczych (Test mini-COG)
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5b21b6', marginBottom: '1rem', marginTop: 0 }}>
            Pacjent {'>'}= 60 r.ż. Zbadaj pacjenta wykorzystując skalę przesiewową mini-COG.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '4px', border: '1px solid #e9d5ff', fontSize: '0.8rem', color: '#4c1d95', lineHeight: '1.4' }}>
                    <strong style={{ display: 'block', marginBottom: '0.3rem' }}>Instrukcja wykonania:</strong>
                    <strong>Krok 1:</strong> Powiedz: <em>„Proszę uważnie wysłuchać i powtórzyć 3 słowa, a następnie je zapamiętać: np. Banan, Wschód, Krzesło”</em> (możesz powtórzyć maks. 3 razy).<br/><br/>
                    <strong>Krok 3:</strong> Powiedz: <em>„A teraz proszę mi powiedzieć, jakie trzy słowa kazałem(am) Panu/Pani wcześniej zapamiętać?”</em>
                </div>

                <ToggleButtonGroup 
                    label="Krok 3: Przypomnienie spontaniczne 3 słów" 
                    name="minicog_words" 
                    value={data.minicog_words} 
                    onChange={onChange} 
                    options={[
                        { value: '0', label: '0 słów' },
                        { value: '1', label: '1 słowo' },
                        { value: '2', label: '2 słowa' },
                        { value: '3', label: '3 słowa' }
                    ]}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '4px', border: '1px solid #e9d5ff', fontSize: '0.8rem', color: '#4c1d95', lineHeight: '1.4' }}>
                    <strong style={{ display: 'block', marginBottom: '0.3rem' }}>Zasady punktacji Zegara (tylko 0 lub 2 pkt):</strong>
                    Aby przyznać <strong>2 punkty</strong>, zegar musi być w 100% poprawny (cyfry, rozmieszczenie, wskazówki na 11:10).
                    Każdy błąd = <strong>0 pkt</strong>.
                </div>

                <ToggleButtonGroup 
                    label="Krok 2: Oceny Rysowania Zegara" 
                    name="minicog_clock" 
                    value={data.minicog_clock} 
                    onChange={onChange} 
                    options={[
                        { value: '0', label: 'BŁĘDNIE (0 pkt)' },
                        { value: '2', label: 'PRAWIDŁOWO (2 pkt)' }
                    ]}
                />
            </div>
        </div>

        {data.minicog_words !== '' && data.minicog_clock !== '' && (
            <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#ede9fe', borderRadius: '4px', fontSize: '0.9rem', color: '#4c1d95', fontWeight: 600 }}>
                Wynik łączny: {Number(data.minicog_words) + Number(data.minicog_clock)} / 5 pkt
                {(Number(data.minicog_words) + Number(data.minicog_clock)) < 3 && (
                    <span style={{ color: '#be123c', display: 'block', marginTop: '0.3rem', fontSize: '0.85rem' }}>
                        ⚠️ Wynik poniżej 3 punktów. Po pobraniu PDF automatycznie zaznaczy się krzyżyk w sekcji zaburzeń poznawczych.
                    </span>
                )}
            </div>
        )}
      </div>
      )}
    </>
  );
};

export default MeasurementsSection;

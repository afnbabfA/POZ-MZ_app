import React from 'react';
import ToggleButtonGroup from '../common/ToggleButtonGroup';

const RiskFactorsSection = ({ data, onChange }) => {
  return (
    <>
      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0'}} />
      <h2 className="section-title">📝 3. Inne Czynniki Ryzyka (Wywiad)</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          {name: 'alcohol', label: 'Nadużywanie alkoholu'},
          {name: 'low_activity', label: 'Niska aktywność fizyczna'},
          {name: 'bad_diet', label: 'Nieprawidłowe nawyki żywieniowe'},
          {name: 'cvd', label: 'Rozpoznana choroba sercowo-naczyniowa'},
          {name: 'ckd', label: 'Rozpoznana przewlekła choroba nerek (Zaznacz jeśli tak)'},
          {name: 'depression', label: 'Podejrzenie depresji lub rozpoznana depresja'},
          {name: 'cognitive', label: 'Podejrzenie zaburzeń funkcji poznawczych'},
          {name: 'psychosocial', label: 'Inne czynniki psychospołeczne'},
          {name: 'family_cvd', label: 'Występowanie chorob SN w rodzinie'},
          {name: 'family_cancer', label: 'Występowanie chorob nowotworowych w rodzinie'}
        ].map(item => (
            <div key={item.name}>
                <div className="toggle-wrapper" style={{marginBottom: 0}}>
                    <input type="checkbox" id={item.name} name={item.name} checked={data[item.name] || false} onChange={onChange} />
                    <label htmlFor={item.name} style={{ margin: 0, fontWeight: 500, cursor: 'pointer', paddingLeft: '8px' }}>{item.label}</label>
                </div>
                
                {/* Family CVD Sub-question */}
                {item.name === 'family_cvd' && data.family_cvd && (
                    <div style={{ marginLeft: '2.5rem', marginTop: '0.5rem', padding: '0.8rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#991b1b', margin: 0 }}>Wywiad pogłębiony (S-N):</p>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#7f1d1d' }}>
                            <input type="checkbox" name="family_cvd_early" checked={data.family_cvd_early || false} onChange={onChange} />
                            Wczesne zdarzenia S-N lub nagły zgon sercowy w młodym wieku (Mężczyźni &lt; 55 r.ż., Kobiety &lt; 65 r.ż.)
                        </label>
                    </div>
                )}
                
                {/* PHQ-2 Screening (Progressive) */}
                {(item.name === 'depression' && (data.depression || data.iso_symptoms || data.iso_life_threat)) && (
                    <div style={{ marginLeft: '2.5rem', marginTop: '0.8rem', padding: '1rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                        <h4 style={{ fontSize: '0.9rem', color: '#0369a1', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{fontSize: '1.2rem'}}>🧠</span> Screening PHQ-2 (Wstępny)
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#0c4a6e', marginBottom: '1rem' }}>
                            Czy w ciągu ostatnich 2 tygodni występowały u Ciebie następujące problemy:
                        </p>
                        
                        {[
                            { name: 'phq2_1', label: '1. Zaniepokojenie z powodu przygnębienia, depresyjnego nastroju lub poczucia beznadziei?' },
                            { name: 'phq2_2', label: '2. Odczuwanie mniejszego zainteresowania lub przyjemności podczas wykonywania czynności?' }
                        ].map(q => (
                            <div key={q.name} style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#0c4a6e' }}>{q.label}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {[
                                        { v: 0, l: 'Wcale' },
                                        { v: 1, l: 'Kilka dni' },
                                        { v: 2, l: 'Więcej niż połowa' },
                                        { v: 3, l: 'Niemal codziennie' }
                                    ].map(opt => (
                                        <label key={opt.v} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', padding: '0.35rem 0.7rem', background: Number(data[q.name]) === opt.v ? '#0ea5e9' : '#fff', color: Number(data[q.name]) === opt.v ? '#fff' : '#0c4a6e', borderRadius: '8px', border: '2px solid', borderColor: Number(data[q.name]) === opt.v ? '#0ea5e9' : '#bae6fd', transition: '0.2s', fontWeight: Number(data[q.name]) === opt.v ? 'bold' : '400', boxShadow: Number(data[q.name]) === opt.v ? '0 0 10px rgba(14, 165, 233, 0.4)' : 'none' }}>
                                            <input type="radio" name={q.name} value={opt.v} checked={Number(data[q.name]) === opt.v} onChange={onChange} style={{ display: 'none' }} />
                                            {opt.l}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        {data.phq2_1 !== undefined && data.phq2_2 !== undefined && (
                            <div style={{ marginTop: '0.5rem', padding: '0.6rem', background: (Number(data.phq2_1) + Number(data.phq2_2)) >= 3 ? '#fff1f2' : '#f0fdf4', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: (Number(data.phq2_1) + Number(data.phq2_2)) >= 3 ? '#be123c' : '#166534' }}>
                                Wynik PHQ-2: {Number(data.phq2_1) + Number(data.phq2_2)} / 6 pkt
                                {(Number(data.phq2_1) + Number(data.phq2_2)) >= 3 && " ➔ Wskazane rozszerzenie o PHQ-9!"}
                            </div>
                        )}
                    </div>
                )}
                
                {/* PHQ-9 Full Screening (Conditional) */}
                {(item.name === 'depression' && (Number(data.phq2_1) + Number(data.phq2_2)) >= 3) && (
                    <div style={{ marginLeft: '2.5rem', marginTop: '1rem', padding: '1.2rem', background: '#fff', borderRadius: '12px', border: '1px solid #fecdd3', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ fontSize: '0.95rem', color: '#9f1239', marginBottom: '1rem', borderBottom: '1px solid #fecdd3', paddingBottom: '0.5rem' }}>
                            📋 Pełny Kwestionariusz PHQ-9 (Ocena nasilenia)
                        </h4>
                        
                        {[
                            { n: 'phq9_3', l: '3. Kłopoty z zaśnięciem, przerywany lub zbyt długi sen?' },
                            { n: 'phq9_4', l: '4. Uczucie zmęczenia lub brak energii?' },
                            { n: 'phq9_5', l: '5. Brak apetytu lub przejadanie się?' },
                            { n: 'phq9_6', l: '6. Poczucie niezadowolenia z siebie, że jesteś do niczego lub zawiodłeś siebie/rodzinę?' },
                            { n: 'phq9_7', l: '7. Problemy ze skupieniem się (np. przy czytaniu lub TV)?' },
                            { n: 'phq9_8', l: '8. Poruszanie/mówienie tak wolno, że inni zauważają? Lub nadmierna ruchliwość?' },
                            { n: 'phq9_9', l: '9. Myśli, że lepiej byłoby umrzeć lub chęć zrobienia sobie krzywdy?' }
                        ].map(q => (
                            <div key={q.n} style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#4c0519' }}>{q.l}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {[
                                        { v: 0, l: 'Wcale' },
                                        { v: 1, l: 'Kilka dni' },
                                        { v: 2, l: 'Więcej niż połowa' },
                                        { v: 3, l: 'Niemal codziennie' }
                                    ].map(opt => (
                                        <label key={opt.v} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', padding: '0.35rem 0.7rem', background: Number(data[q.n]) === opt.v ? '#e11d48' : '#fff', color: Number(data[q.n]) === opt.v ? '#fff' : '#4c0519', borderRadius: '8px', border: '2px solid', borderColor: Number(data[q.n]) === opt.v ? '#e11d48' : '#fda4af', transition: '0.2s', fontWeight: Number(data[q.n]) === opt.v ? 'bold' : '400', boxShadow: Number(data[q.n]) === opt.v ? '0 0 10px rgba(225, 29, 72, 0.4)' : 'none' }}>
                                            <input type="radio" name={q.n} value={opt.v} checked={Number(data[q.n]) === opt.v} onChange={onChange} style={{ display: 'none' }} />
                                            {opt.l}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        {/* Interpretacja PHQ-9 */}
                        {(() => {
                            const q9_keys = ['phq2_1', 'phq2_2', 'phq9_3', 'phq9_4', 'phq9_5', 'phq9_6', 'phq9_7', 'phq9_8', 'phq9_9'];
                            const allAnswered = q9_keys.every(k => data[k] !== undefined);
                            if (allAnswered) {
                                const total = q9_keys.reduce((acc, k) => acc + Number(data[k]), 0);
                                let interpretation = "";
                                let color = "#1e293b";
                                if (total < 5) { interpretation = "Brak depresji"; color = "#166534"; }
                                else if (total <= 9) { interpretation = "Łagodna depresja"; color = "#854d0e"; }
                                else if (total <= 14) { interpretation = "Umiarkowana depresja"; color = "#b45309"; }
                                else if (total <= 19) { interpretation = "Umiarkowanie ciężka depresja"; color = "#991b1b"; }
                                else { interpretation = "Ciężka depresja"; color = "#7f1d1d"; }
                                
                                return (
                                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff1f2', borderRadius: '8px', border: '2px solid #fb7185' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: color }}>
                                            Łączny wynik PHQ-9: {total} pkt
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: color, marginTop: '0.2rem' }}>
                                            Interpretacja: {interpretation}
                                        </div>
                                        {total >= 10 && (
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#9f1239', fontStyle: 'italic' }}>
                                                Wskazana pogłębiona diagnostyka psychiatryczna i rozważenie leczenia.
                                            </div>
                                        )}
                                        {data.phq9_9 > 0 && (
                                            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#9f1239', color: '#fff', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                ⚠️ CZERWONA FLAGA: Dodatnie pytanie nr 9 (myśli o samookaleczeniu)!
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>
                )}
            </div>
        ))}
        
        {/* Dodatkowe czynniki cywilizacyjne */}
        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
             <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', marginTop: 0}}>Pozostałe czynniki współczesnych chorób cywilizacyjnych:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  {name: 'isolation', label: 'Izolacja społeczna / Poczucie samotności'}
                ].map(item => (
                    <div key={item.name}>
                        <div className="toggle-wrapper" style={{marginBottom: 0}}>
                            <input type="checkbox" id={item.name} name={item.name} checked={data[item.name] || false} onChange={onChange} />
                            <label htmlFor={item.name} style={{ margin: 0, fontWeight: 500, cursor: 'pointer', paddingLeft: '8px' }}>{item.label}</label>
                        </div>
                        
                        {/* Sub-questions for Isolation */}
                        {item.name === 'isolation' && data.isolation && (
                            <div style={{ marginLeft: '2.5rem', marginTop: '0.5rem', padding: '0.8rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#b45309', margin: 0 }}>Wywiad pogłębiony (Izolacja):</p>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    <input type="checkbox" name="iso_life_threat" checked={data.iso_life_threat || false} onChange={onChange} />
                                    Ryzyko zagrożenia życia? (Myśli rezygnacyjne / samobójcze)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    <input type="checkbox" name="iso_adl_limits" checked={data.iso_adl_limits || false} onChange={onChange} />
                                    Ograniczenia fizyczne/finansowe? (Brak samodzielności, ubóstwo)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    <input type="checkbox" name="iso_symptoms" checked={data.iso_symptoms || false} onChange={onChange} />
                                    Objawy osiowe? (Anhedonia, lęk, zaburzenia snu)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                    <input type="checkbox" name="iso_substances" checked={data.iso_substances || false} onChange={onChange} />
                                    Używki? (Alkohol/leki jako "samoleczenie" samotności)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#9f1239', fontWeight: 600 }}>
                                    <input type="checkbox" name="iso_no_support" checked={data.iso_no_support || false} onChange={onChange} />
                                    Brak wsparcia bliskich / rodziny? (Samotność obiektywna)
                                </label>
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Cyfrowe nawyki */}
                <div style={{ marginTop: '0.8rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem' }}>
                    <div className="toggle-wrapper" style={{marginBottom: 0}}>
                        <input type="checkbox" id="digital_habits" name="digital_habits" checked={data.digital_habits || false} onChange={onChange} />
                        <label htmlFor="digital_habits" style={{ margin: 0, fontWeight: 600, cursor: 'pointer', paddingLeft: '8px', color: '#1e293b' }}>Intensywne korzystanie z Social Media / AI / Telefonu</label>
                    </div>
                    {data.digital_habits && (
                        <div style={{ marginLeft: '2.5rem', marginTop: '0.4rem', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                            (Np. Instagram, TikTok, AI - generuje ryzyko behawioralne)
                        </div>
                    )}
                </div>
             </div>
        </div>
      </div>
    </>
  );
};

export default RiskFactorsSection;

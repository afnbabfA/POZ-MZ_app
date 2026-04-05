import React from 'react';
import ToggleButtonGroup from '../common/ToggleButtonGroup';

const PhysicalExamSection = ({ data, onChange, bmi }) => {
  const physMorfologia = data.lab_morf === 'odchylenia';
  const physLipidy = Number(data.tc) > 190 || Number(data.ldl) > 115 || Number(data.tg) > 150;
  const physGlukoza = Number(data.glucose) >= 100;
  const physWatroba = Number(data.lab_alt) > 40 || Number(data.lab_ast) > 40 || Number(data.lab_ggtp) > 50;
  const physNerkowa = (data.egfr && Number(data.egfr) < 60) || data.lab_mocz === 'odchylenia';
  const physPomiary = (data.sbp && Number(data.sbp) >= 140) || (data.dbp && Number(data.dbp) >= 90) || (data.hr && (Number(data.hr) > 100 || Number(data.hr) < 50)) || Number(bmi) >= 25;
  const physTarczyca = data.lab_tsh && (Number(data.lab_tsh) < 0.4 || Number(data.lab_tsh) > 4.5);
  const physPsa = data.lab_psa && Number(data.lab_psa) > 4.0;
  const physFit = data.fit_positive === true;
  const physHcv = data.lab_hcv === 'dodatni';

  return (
    <>
      <hr style={{border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0'}} />
      <h2 className="section-title">🩺 6. Spersonalizowane Badanie Fizykalne (Uwarunkowane Wynikami)</h2>
      <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem'}}>Panele te pojawiają się dynamicznie w przypadku odnotowania odchyleń w powyższych sekcjach wywiadu i wyników.</p>

      {/* Morfologia */}
      {physMorfologia && (
        <div style={{ background: '#fff1f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecdd3', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#9f1239' }}>Odchylenia w morfologii (Niedokrwistość / WBC / PLT)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <ToggleButtonGroup 
                    label="Spojówki i skóra" 
                    name="phys_morf_skora" 
                    value={data.phys_morf_skora || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'prawidłowo różowe', label: 'Prawidłowo różowe' },
                        { value: 'blade', label: 'Blade' },
                        { value: 'zażółcone', label: 'Zażółcone' }
                    ]}
                />
                <ToggleButtonGroup 
                    label="Węzły chłonne obwodowe" 
                    name="phys_morf_wezly" 
                    value={data.phys_morf_wezly || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'niepowiększone', label: 'Niepowiększone' },
                        { value: 'powiększone', label: 'Powiększone' }
                    ]}
                />
                <ToggleButtonGroup 
                    label="Śledziona (palpacja brzucha)" 
                    name="phys_morf_sledziona" 
                    value={data.phys_morf_sledziona || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'niewyczuwalna', label: 'Niewyczuwalna' },
                        { value: 'powiększona', label: 'Powiększona' }
                    ]}
                />
            </div>
            <p style={{fontSize: '0.8rem', color: '#be123c', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Powtórka z retikulocytami/żelazem/B12 -{'>'} ewentualnie diagnostyka krwawienia (FIT/gastro) lub hematolog.</p>
        </div>
      )}

      {/* Lipidogram */}
      {physLipidy && (
        <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#b45309' }}>Hiperlipidemia (↑Cholesterol, ↑LDL, ↑TG)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <ToggleButtonGroup 
                    label="Skóra / Oczy" 
                    name="phys_lip_skora" 
                    value={data.phys_lip_skora || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'brak zmian', label: 'Brak zmian' },
                        { value: 'kępki żółte', label: 'Kępki żółte' },
                        { value: 'rąbek starczy', label: 'Rąbek starczy' }
                    ]}
                />
                <ToggleButtonGroup 
                    label="Tętno na tt. obwodowych" 
                    name="phys_lip_tetno" 
                    value={data.phys_lip_tetno || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'dobrze napięte', label: 'Dobrze / symetryczne' },
                        { value: 'osłabione asymetryczne', label: 'Osłabione / asymetryczne' }
                    ]}
                />
            </div>
            <p style={{fontSize: '0.8rem', color: '#92400e', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Kwalifikacja do Opieki Koordynowanej (IPOM - kardiologia), leczenie statyną, ew. USG tętnic dogłowowych/kończyn.</p>
        </div>
      )}

      {/* Glukoza */}
      {physGlukoza && (
        <div style={{ background: '#f5f3ff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd6fe', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#5b21b6' }}>Podejrzenie Cukrzycy (Glukoza na czczo ≥ 100 mg/dL)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <ToggleButtonGroup 
                    label="Skóra (kark/pachy)" 
                    name="phys_glu_skora" 
                    value={data.phys_glu_skora || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'bez zmian', label: 'Bez zmian' },
                        { value: 'rogowacenie ciemne', label: 'Rogowacenie ciemne' }
                    ]}
                />
                <ToggleButtonGroup 
                    label="Ocena stóp (tętno, owrzodzenia)" 
                    name="phys_glu_stopy" 
                    value={data.phys_glu_stopy || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'bez owrzodzen tętno zachowane', label: 'Bez owrzodzeń, tętno OK' },
                        { value: 'zbledniecie brak tetna', label: 'Brak tętna, zblednięcie' }
                    ]}
                />
            </div>
            <p style={{fontSize: '0.8rem', color: '#4c1d95', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Skierowanie na OGTT (krzywa cukrowa) lub HbA1c -{'>'} Kwalifikacja do OK (IPOM - diabetologia).</p>
        </div>
      )}

      {/* Wątroba & HCV */}
      {(physWatroba || physHcv) && (
        <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '8px', border: '1px solid #a7f3d0', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#065f46' }}>Hepatologia (Odchylenia Wątrobowe / HCV+)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <ToggleButtonGroup 
                    label="Skóra / Twardówki" 
                    name="phys_hep_skora" 
                    value={data.phys_hep_skora || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'bez żółtaczki', label: 'Bez żółtaczki' },
                        { value: 'zażółcone', label: 'Zażółcone' },
                        { value: 'pajączki naczyniowe rumień', label: 'Pajączki / Rumień' }
                    ]}
                />
                <ToggleButtonGroup 
                    label="Wątroba (palpacja)" 
                    name="phys_hep_watroba" 
                    value={data.phys_hep_watroba || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'niepowiększona', label: 'Niepowiększona' },
                        { value: 'powiększona tkliwa', label: 'Powiększona, tkliwa' },
                        { value: 'powiększona nietkliwa brzeg nierówny', label: 'Powiększona, nierówna' }
                    ]}
                />
            </div>
            <p style={{fontSize: '0.8rem', color: '#047857', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Skierowanie na USG jamy brzusznej (obligatoryjnie!), wykluczenie alkoholu/leków. {physHcv ? "-> Skierowanie na RNA HCV (Poradnia Chorób Zakaźnych)" : ""}</p>
        </div>
      )}

      {/* Nerkowa */}
      {physNerkowa && (
        <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#166534' }}>Nefrologia (↓eGFR / Białkomocz / Krwinkomocz)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <ToggleButtonGroup 
                    label="Objaw Goldflama" 
                    name="phys_nef_goldflam" 
                    value={data.phys_nef_goldflam || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'obustronnie ujemny', label: 'Ujemny (-/-)' },
                        { value: 'dodatni L', label: 'Dodatni L' },
                        { value: 'dodatni P', label: 'Dodatni P' },
                        { value: 'dodatni obustronnie', label: 'Dodatni (+/+)' }
                    ]}
                />
                <ToggleButtonGroup 
                    label="Obrzęki obwodowe" 
                    name="phys_nef_obrzeki" 
                    value={data.phys_nef_obrzeki || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'brak', label: 'Brak' },
                        { value: 'ciastowate wokół kostek', label: 'Ciastowate kostek' }
                    ]}
                />
            </div>
            <p style={{fontSize: '0.8rem', color: '#15803d', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Skierowanie na USG układu moczowego, weryfikacja leków (NLPZ) -{'>'} Kwalifikacja do OK (IPOM - nefrologia).</p>
        </div>
      )}

      {/* Pomiary Gabinet (BP, HR, BMI) */}
      {physPomiary && (
        <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#1d4ed8' }}>Kardio / Otyłość (Odchylenia BP, HR lub BMI {'>'} 25)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }}>
                <ToggleButtonGroup 
                    label="Serce (osłuchiwanie)" 
                    name="phys_kar_serce" 
                    value={data.phys_kar_serce || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'tony czyste akcja miarowa', label: 'Tony czyste, miarowa' },
                        { value: 'szmer akcja miarowa', label: 'Szmer, miarowa' },
                        { value: 'tony czyste niemiarowa', label: 'Tony czyste, niemiarowa' }
                    ]}
                />
            </div>
            <p style={{fontSize: '0.8rem', color: '#1e40af', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: EKG spoczynkowe, Kwalifikacja do OK (kardiologia). Edukacja dietetyczna (przy BMI wyższym).</p>
        </div>
      )}

      {/* Tarczyca */}
      {physTarczyca && (
        <div style={{ background: '#faf5ff', padding: '1rem', borderRadius: '8px', border: '1px solid #e9d5ff', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#6b21a8' }}>Endokrynologia (Zaburzenia TSH)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <ToggleButtonGroup 
                    label="Tarczyca (palpacyjnie)" 
                    name="phys_endo_tarczyca" 
                    value={data.phys_endo_tarczyca || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'wielkość w normie miękka', label: 'Norma / Miękka' },
                        { value: 'powiększona miękka', label: 'Powiększona, miękka' },
                        { value: 'wielkość w normie twarda', label: 'Norma / Twarda' },
                        { value: 'powiększona twarda', label: 'Powiększona (wole), twarda' }
                    ]}
                />
                <ToggleButtonGroup 
                    label="Guzki / Inne objawy" 
                    name="phys_endo_guzki" 
                    value={data.phys_endo_guzki || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'brak guzków bez drżenia', label: 'Brak / OK' },
                        { value: 'wyczuwalne guzki ruchome', label: 'Guzki ruchome' },
                        { value: 'wyczuwalne guzki nieruchome', label: 'Guzki nieruchome' },
                        { value: 'drżenie rąk wytrzeszcz', label: 'Drżenie / Wytrzeszcz' }
                    ]}
                />
            </div>
            <p style={{fontSize: '0.8rem', color: '#581c87', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Skierowanie na USG tarczycy oraz oznaczenie anty-TPO/anty-TG -{'>'} Kwalifikacja do OK (endokrynologia).</p>
        </div>
      )}

      {/* PSA & FIT Dodatni */}
      {(physPsa || physFit) && (
        <div style={{ background: '#fdf2f8', padding: '1rem', borderRadius: '8px', border: '1px solid #fbcfe8', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#9d174d' }}>Podejrzenie Onkologiczne ({physPsa ? "Podwyższone PSA" : ""}{physPsa && physFit ? " / " : ""}{physFit ? "Dodatni FIT" : ""})</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {physPsa && (
                <ToggleButtonGroup 
                    label="Badanie per rectum (DRE) - Stercz" 
                    name="phys_onko_dre" 
                    value={data.phys_onko_dre || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'symetryczny gładki', label: 'Gładki / Elastyczny' },
                        { value: 'powiększony', label: 'Powiększony' },
                        { value: 'asymetryczny twardy', label: 'Twardy / Asymetr.' }
                    ]}
                />
                )}
                {physFit && (
                <ToggleButtonGroup 
                    label="Badanie brzucha i PR (Jelito grub.)" 
                    name="phys_onko_brzuch" 
                    value={data.phys_onko_brzuch || ''} 
                    onChange={onChange} 
                    options={[
                        { value: 'miękki bańka pusta', label: 'Miękki / Bez krwi' },
                        { value: 'badalny guz brzuch', label: 'Badalny guz' },
                        { value: 'per rectum guz krew', label: 'Guz / Krew w PR' }
                    ]}
                />
                )}
            </div>
            <p style={{fontSize: '0.8rem', color: '#831843', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>
                Akcja: PILNE! Konsultacja urologiczna / kolonoskopia u gastroenterologa (karta DiLO).
            </p>
        </div>
      )}

      {(!physMorfologia && !physLipidy && !physGlukoza && !physWatroba && !physNerkowa && !physPomiary && !physTarczyca && !physPsa && !physFit && !physHcv) && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '8px', marginBottom: '1rem' }}>
            <i>Brak wyraźnych odchyleń patologicznych zlecających zogniskowane badanie fizykalne.</i>
        </div>
      )}
    </>
  );
};

export default PhysicalExamSection;

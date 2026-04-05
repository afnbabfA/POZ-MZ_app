import React from 'react';

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
                <div className="form-group">
                    <label>Spojówki i skóra</label>
                    <select className="form-control" name="phys_morf_skora" value={data.phys_morf_skora || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="prawidłowo różowe">Prawidłowo różowe</option>
                        <option value="blade">Blade</option>
                        <option value="zażółcone">Zażółcone</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Węzły chłonne obwodowe</label>
                    <select className="form-control" name="phys_morf_wezly" value={data.phys_morf_wezly || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="niepowiększone">Niepowiększone</option>
                        <option value="powiększone">Powiększone - lokalizacja, bolesność, ruchomość</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Śledziona (palpacja brzucha)</label>
                    <select className="form-control" name="phys_morf_sledziona" value={data.phys_morf_sledziona || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="niewyczuwalna">Niewyczuwalna</option>
                        <option value="powiększona">Powiększona</option>
                    </select>
                </div>
            </div>
            <p style={{fontSize: '0.8rem', color: '#be123c', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Powtórka z retikulocytami/żelazem/B12 -{'>'} ewentualnie diagnostyka krwawienia (FIT/gastro) lub hematolog.</p>
        </div>
      )}

      {/* Lipidogram */}
      {physLipidy && (
        <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#b45309' }}>Hiperlipidemia (↑Cholesterol, ↑LDL, ↑TG)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                    <label>Skóra / Oczy</label>
                    <select className="form-control" name="phys_lip_skora" value={data.phys_lip_skora || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="brak zmian">Brak zmian</option>
                        <option value="kępki żółte">Kępki żółte powiek/ścięgien</option>
                        <option value="rąbek starczy">Rąbek starczy rogówki</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Tętno na tt. obwodowych</label>
                    <select className="form-control" name="phys_lip_tetno" value={data.phys_lip_tetno || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="dobrze napięte">Dobrze, symetrycznie napięte</option>
                        <option value="osłabione asymetryczne">Osłabione / asymetryczne</option>
                    </select>
                </div>
            </div>
            <p style={{fontSize: '0.8rem', color: '#92400e', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Kwalifikacja do Opieki Koordynowanej (IPOM - kardiologia), leczenie statyną, ew. USG tętnic dogłowowych/kończyn.</p>
        </div>
      )}

      {/* Glukoza */}
      {physGlukoza && (
        <div style={{ background: '#f5f3ff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd6fe', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#5b21b6' }}>Podejrzenie Cukrzycy (Glukoza na czczo ≥ 100 mg/dL)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                    <label>Skóra (kark/pachy)</label>
                    <select className="form-control" name="phys_glu_skora" value={data.phys_glu_skora || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="bez zmian">Bez zmian</option>
                        <option value="rogowacenie ciemne">Rogowacenie ciemne (acanthosis nigricans)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Ocena stóp (tętno, owrzodzenia)</label>
                    <select className="form-control" name="phys_glu_stopy" value={data.phys_glu_stopy || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="bez owrzodzen tętno zachowane">Bez owrzodzeń, tętno zachowane</option>
                        <option value="zbledniecie brak tetna">Zblednięcie, brak tętna grzbietowego stopy</option>
                    </select>
                </div>
            </div>
            <p style={{fontSize: '0.8rem', color: '#4c1d95', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Skierowanie na OGTT (krzywa cukrowa) lub HbA1c -{'>'} Kwalifikacja do OK (IPOM - diabetologia).</p>
        </div>
      )}

      {/* Wątroba & HCV */}
      {(physWatroba || physHcv) && (
        <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '8px', border: '1px solid #a7f3d0', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#065f46' }}>Hepatologia (Odchylenia Wątrobowe / HCV+)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                    <label>Skóra / Twardówki</label>
                    <select className="form-control" name="phys_hep_skora" value={data.phys_hep_skora || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="bez żółtaczki">Bez żółtaczki</option>
                        <option value="zażółcone">Zażółcone</option>
                        <option value="pajączki naczyniowe rumień">Pajączki naczyniowe, rumień dłoniowy</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Wątroba (palpacja)</label>
                    <select className="form-control" name="phys_hep_watroba" value={data.phys_hep_watroba || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="niepowiększona">Niepowiększona</option>
                        <option value="powiększona tkliwa">Powiększona, tkliwa</option>
                        <option value="powiększona nietkliwa brzeg nierówny">Powiększona, nietkliwa, brzeg nierówny</option>
                    </select>
                </div>
            </div>
            <p style={{fontSize: '0.8rem', color: '#047857', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Skierowanie na USG jamy brzusznej (obligatoryjnie!), wykluczenie alkoholu/leków. {physHcv ? "-> Skierowanie na RNA HCV (Poradnia Chorób Zakaźnych)" : ""}</p>
        </div>
      )}

      {/* Nerkowa */}
      {physNerkowa && (
        <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#166534' }}>Nefrologia (↓eGFR / Białkomocz / Krwinkomocz)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                    <label>Objaw Goldflama</label>
                    <select className="form-control" name="phys_nef_goldflam" value={data.phys_nef_goldflam || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="obustronnie ujemny">Obustronnie ujemny</option>
                        <option value="dodatni L">Dodatni Lewy</option>
                        <option value="dodatni P">Dodatni Prawy</option>
                        <option value="dodatni obustronnie">Dodatni Obustronnie</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Obrzęki obwodowe</label>
                    <select className="form-control" name="phys_nef_obrzeki" value={data.phys_nef_obrzeki || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="brak">Brak</option>
                        <option value="ciastowate wokół kostek">Ciastowate wokół kostek/podudzi</option>
                    </select>
                </div>
            </div>
            <p style={{fontSize: '0.8rem', color: '#15803d', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: Skierowanie na USG układu moczowego, weryfikacja leków (NLPZ) -{'>'} Kwalifikacja do OK (IPOM - nefrologia).</p>
        </div>
      )}

      {/* Pomiary Gabinet (BP, HR, BMI) */}
      {physPomiary && (
        <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#1d4ed8' }}>Kardio / Otyłość (Odchylenia BP, HR lub BMI {'>'} 25)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                    <label>Serce (osłuchiwanie)</label>
                    <select className="form-control" name="phys_kar_serce" value={data.phys_kar_serce || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="tony czyste akcja miarowa">Tony czyste, akcja miarowa</option>
                        <option value="szmer akcja miarowa">Szmer serca, akcja miarowa</option>
                        <option value="tony czyste niemiarowa">Tony czyste, niemiarowa (podejrzenie migotania)</option>
                    </select>
                </div>
            </div>
            <p style={{fontSize: '0.8rem', color: '#1e40af', margin: '0.5rem 0 0 0', fontWeight: 'bold'}}>Akcja: EKG spoczynkowe, Kwalifikacja do OK (kardiologia). Edukacja dietetyczna (przy BMI wyższym).</p>
        </div>
      )}

      {/* Tarczyca */}
      {physTarczyca && (
        <div style={{ background: '#faf5ff', padding: '1rem', borderRadius: '8px', border: '1px solid #e9d5ff', marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem', color: '#6b21a8' }}>Endokrynologia (Zaburzenia TSH)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                    <label>Tarczyca (palpacyjnie)</label>
                    <select className="form-control" name="phys_endo_tarczyca" value={data.phys_endo_tarczyca || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="wielkość w normie miękka">Niebadalna / Wielkość w normie, miękka</option>
                        <option value="powiększona miękka">Powiększona, miękka</option>
                        <option value="wielkość w normie twarda">Wielkość w normie, twarda/spoista</option>
                        <option value="powiększona twarda">Powiększona (wole), twarda</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Guzki / Inne objawy</label>
                    <select className="form-control" name="phys_endo_guzki" value={data.phys_endo_guzki || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="brak guzków bez drżenia">Brak guzków, bez objawów nadczynności</option>
                        <option value="wyczuwalne guzki ruchome">Wyczuwalne guzki ruchome</option>
                        <option value="wyczuwalne guzki nieruchome">Wyczuwalne guzki nieruchome</option>
                        <option value="drżenie rąk wytrzeszcz">Brak guzków, występuje drżenie rąk / wytrzeszcz</option>
                    </select>
                </div>
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
                <div className="form-group">
                    <label>Badanie per rectum (DRE) - Stercz</label>
                    <select className="form-control" name="phys_onko_dre" value={data.phys_onko_dre || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="symetryczny gładki">Symetryczny, gładki, elastyczny, niebolesny</option>
                        <option value="powiększony">Powiększony, gładki</option>
                        <option value="asymetryczny twardy">Asymetryczny/guzkowy/twardy jak kamień</option>
                    </select>
                </div>
                )}
                {physFit && (
                <div className="form-group">
                    <label>Badanie brzucha i PR (Jelito grub.)</label>
                    <select className="form-control" name="phys_onko_brzuch" value={data.phys_onko_brzuch || ''} onChange={onChange}>
                        <option value="">-- wybierz --</option>
                        <option value="miękki bańka pusta">Brzuch miękki, per rectum bańka pusta / bez krwi</option>
                        <option value="badalny guz brzuch">Badalny guz/opór w jamie brzusznej</option>
                        <option value="per rectum guz krew">Per rectum: badalny polip/guz lub ślady krwi</option>
                    </select>
                </div>
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

import React, { useState } from 'react';
import { generateNativePDF } from '../utils/pdfGenerator';

const IPZDashboard = ({ evaluated, rawData }) => {
  const { flags = [], diagnostics = [], recommendations = [], exactBmi, exactWhr } = evaluated;
  const [downloading, setDownloading] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isVaccinesOpen, setIsVaccinesOpen] = useState(false);

  const generateNote = () => {
    let note = `[IPZ - PROGRAM MOJE ZDROWIE NFZ]\n\n`;
    note += `> Parametry Pacjenta: Wiek: ${rawData.age || '-'}, Płeć: ${rawData.gender || '-'}\n`;
    note += `> Pomiary Antropometryczne: Wzrost: ${rawData.height || '-'}cm, Waga: ${rawData.weight || '-'}kg | BMI: ${exactBmi || '-'}, WHR: ${exactWhr || '-'}\n`;
    
    const vs = [];
    if (rawData.sbp || rawData.dbp) vs.push(`BP: ${rawData.sbp || '-'}/${rawData.dbp || '-'} mmHg`);
    if (rawData.hr) vs.push(`HR: ${rawData.hr}/min`);
    if (rawData.spo2) vs.push(`SpO2: ${rawData.spo2}%`);
    if (rawData.rr) vs.push(`RR: ${rawData.rr}/min`);
    if (vs.length > 0) note += `> Parametry Życiowe: ${vs.join(' | ')}\n`;

    if(rawData.score2) note += `> ! Ryzyko SCORE2: ${rawData.score2}%\n`;
    if(rawData.smoking) note += `> ! Czynnik ryzyka: Palenie tytoniu.\n`;
    if(rawData.ticks_exposure) note += `> ! Czynnik środowiskowy: Narażenie na kleszcze.\n`;
    
    note += `\n--- ZAGROŻENIA ---\n`;
    flags.length > 0 ? flags.forEach(f => note += `- ${f.text}\n`) : note += `Brak.\n`;
    
    note += `\n--- ZALECONE BADANIA ---\n`;
    diagnostics.forEach(d => note += `- [ ] ${d.name} (${d.due})\n`);
    
    if (recommendations.length > 0) {
        note += `\n--- ZALECENIA ---\n`;
        recommendations.forEach(r => note += `- ${r}\n`);
    }
    
    return note;
  };

  const copyToClipboard = () => {
    const text = generateNote();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Notatka skopiowana do schowka do wklejenia w historii choroby!");
        }).catch(err => alert("Błąd wbudowanego schowka: " + err));
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert("Notatka (fallback) skopiowana do schowka!");
        } catch (err) {
            alert("Nie można skopiować - brak dostępu.");
        }
        document.body.removeChild(textArea);
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
        const settingsRaw = localStorage.getItem('ipz_settings');
        const settings = settingsRaw ? JSON.parse(settingsRaw) : { providerName: "", facilityName: "" };
        
        const pdfBytes = await generateNativePDF(rawData, settings, recommendations);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        let safeName = rawData.imie_nazwisko ? rawData.imie_nazwisko.trim().replace(/\s+/g, '_') : 'Pacjent';
        let peselPart = rawData.pesel ? rawData.pesel.substring(0, 6) : '000000';
        
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const dateStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        const fileName = `${safeName}_${peselPart}-${dateStr}.pdf`;
        
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (err) {
        console.error(err);
        alert("Błąd podczas generowania pliku PDF: " + err.message);
    }
    setDownloading(false);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 className="header-title">💡 Indywidualny Plan Zdrowia</h2>
      
      {flags.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="section-title" style={{color: 'var(--danger)'}}>🚩 Alarmowe Flagi Kliniczne</h3>
          {flags.map((f, i) => (
            <div key={i} className={`alert alert-${f.level}`}>
              <span className="alert-icon">{f.level === 'danger' ? '⛔' : '⚠️'}</span><span>{f.text}</span>
            </div>
          ))}
        </div>
      )}

      {diagnostics.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="section-title">📅 Badania Profilaktyczne</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {diagnostics.map((d, i) => (
              <li key={i} style={{ padding: '0.8rem', background: d.ok ? 'var(--success-light)' : '#f8fafc', borderLeft: `4px solid ${d.ok ? 'var(--success)' : 'var(--primary)'}`, marginBottom: '0.5rem' }}>
                <strong style={{display: 'block', color: 'var(--text-main)'}}>{d.name}</strong>
                <span style={{fontSize: '0.9rem', color: d.ok ? '#065f46' : 'var(--primary)'}}>{d.due}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="section-title">🛡️ Szczepienia i Edukacja</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {recommendations.map((r, i) => (
              <span key={i} style={{ background: '#e2e8f0', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>{r}</span>
            ))}
          </div>
        </div>
      )}

      {/* NEW VACCINE SECTION */}
      <div style={{ marginBottom: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <button 
            onClick={() => setIsVaccinesOpen(!isVaccinesOpen)} 
            style={{ width: '100%', padding: '0.8rem', background: '#e0f2fe', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: '#0369a1' }}
        >
            <span>💉 Przewodnik Szczepień dla Dorosłych</span>
            <span>{isVaccinesOpen ? '▲ Zwiń' : '▼ Rozwiń'}</span>
        </button>
        {isVaccinesOpen && (
            <div style={{ padding: '1.5rem', background: 'white', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '1rem' }}>Oto uporządkowana lista szczepień do rozważenia z dorosłym pacjentem podczas wizyty podsumowującej, z podziałem na kategorie kliniczne:</p>
                
                <h4 style={{ color: '#0284c7', marginTop: '1rem', marginBottom: '0.5rem' }}>1. Szczepienia podstawowe (dla każdego dorosłego)</h4>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>Tężec, Błonica, Krztusiec (dTap):</strong> Dawka przypominająca co 10 lat. Krztusiec jest tu kluczowy ze względu na zanikającą odporność populacyjną i ryzyko transmisji na niemowlęta.</li>
                    <li><strong>Grypa:</strong> Coroczne szczepienie przed sezonem infekcyjnym.</li>
                    <li><strong>COVID-19:</strong> Dawki przypominające zgodnie z aktualnymi zaleceniami na dany sezon.</li>
                </ul>

                <h4 style={{ color: '#0284c7', marginTop: '1rem', marginBottom: '0.5rem' }}>2. Szczepienia uzależnione od wieku</h4>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>Półpasiec (szczepionka rekombinowana):</strong> Rekomendowana dla osób ≥ 50. roku życia oraz dla osób ≥ 18. roku życia z grup zwiększonego ryzyka (np. immunosupresja). Wysoka skuteczność w zapobieganiu neuralgii popółpaścowej.</li>
                    <li><strong>Pneumokoki:</strong> Dla pacjentów ≥ 65. roku życia. Młodszym dorosłym zalecana w przypadku chorób współistniejących (astma, POChP, cukrzyca, choroby układu krążenia, niedobory odporności, palenie tytoniu).</li>
                    <li><strong>RSV:</strong> Dla dorosłych ≥ 60. roku życia (oraz dla kobiet w ciąży) w celu ochrony przed ciężkim przebiegiem zakażeń dolnych dróg oddechowych.</li>
                    <li><strong>HPV:</strong> Warto rozważyć i omówić z pacjentem szczepienie niezależnie od płci, do 45. roku życia (lub dłużej, po indywidualnej ocenie), jeśli nie zostało wykonane wcześniej.</li>
                </ul>

                <h4 style={{ color: '#0284c7', marginTop: '1rem', marginBottom: '0.5rem' }}>3. Narażenie środowiskowe i styl życia</h4>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>Kleszczowe Zapalenie Mózgu (KZM):</strong> Dla osób aktywnych na świeżym powietrzu (lasy, parki) w strefach endemicznych. Wymaga schematu podstawowego (3 dawki) i dawek przypominających.</li>
                    <li><strong>WZW typu B:</strong> Dla osób niezaszczepionych w przeszłości (szczególnie przed planowanymi zabiegami inwazyjnymi lub z grup ryzyka). Warto zlecić badanie miana anty-HBs.</li>
                    <li><strong>WZW typu A:</strong> Dla pacjentów z przewlekłymi chorobami wątroby, podróżujących do rejonów endemicznych lub narażonych zawodowo (np. branża spożywcza).</li>
                </ul>

                <h4 style={{ color: '#0284c7', marginTop: '1rem', marginBottom: '0.5rem' }}>4. Sytuacje szczególne i grupy ryzyka</h4>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>Meningokoki (grupy ACWY oraz B):</strong> Szczególnie istotne przy asplenii (anatomicznej lub czynnościowej), niedoborach odporności układu dopełniacza, a także dla młodych dorosłych przebywających w dużych skupiskach (np. akademiki).</li>
                    <li><strong>Ospa wietrzna:</strong> Dla pacjentów bez historii przechorowania i nieszczepionych. Niezwykle ważne w profilaktyce przed ciążą.</li>
                    <li><strong>Odra, Świnka, Różyczka (MMR):</strong> W przypadku braku udokumentowanej odporności. Podobnie jak przy ospie wietrznej – kluczowe przed planowaną ciążą (szczepionka żywa).</li>
                </ul>

                <h4 style={{ color: '#0284c7', marginTop: '1rem', marginBottom: '0.5rem' }}>5. Medycyna podróży</h4>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li><strong>W zależności od kierunku i charakteru wyjazdu:</strong> Dur brzuszny, Żółta gorączka (wymagany certyfikat), Japońskie zapalenie mózgu, Cholera, Wścieklizna (profilaktyka przedekspozycyjna).</li>
                </ul>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem', borderLeft: '4px solid #0ea5e9' }}>
                    <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>📋 Kluczowe punkty do weryfikacji w wywiadzie (krótka checklista):</h4>
                    <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        <li style={{ marginBottom: '0.25rem' }}>Wiek pacjenta.</li>
                        <li style={{ marginBottom: '0.25rem' }}>Choroby przewlekłe (szczególnie pulmonologiczne, kardiologiczne, diabetologiczne) i leczenie immunosupresyjne.</li>
                        <li style={{ marginBottom: '0.25rem' }}>Plany prokreacyjne (w ciąży zalecany jest dTap oraz RSV; szczepionki żywe takie jak MMR i ospa wietrzna są przeciwwskazane).</li>
                        <li style={{ marginBottom: '0.25rem' }}>Aktywność rekreacyjna i plany podróżnicze.</li>
                        <li style={{ marginBottom: '0.25rem' }}>Rodzaj wykonywanej pracy.</li>
                    </ul>
                </div>
            </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <button className="btn btn-primary" onClick={downloadPDF} disabled={downloading} style={{width: '100%', marginBottom: '1.5rem', padding: '1rem'}}>
            {downloading ? "Generowanie dokumentu..." : "📄 Pobierz wypełniony .pdf z IPZ pacjenta"}
        </button>

        {/* Sekcja zwijana (Notatka) */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <button 
                onClick={() => setIsNoteOpen(!isNoteOpen)} 
                style={{ width: '100%', padding: '0.8rem', background: '#f8fafc', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}
            >
                <span>📝 Tradycyjna Notatka IPZ (Tekstowa)</span>
                <span>{isNoteOpen ? '▲ Zwiń' : '▼ Rozwiń'}</span>
            </button>
            {isNoteOpen && (
                <div style={{ padding: '1rem', background: 'white' }}>
                    <div className="note-box" style={{ fontSize: '0.85rem', marginBottom: '1rem', marginTop: 0 }}>
                        {generateNote()}
                    </div>
                    <button className="btn btn-secondary" onClick={copyToClipboard} style={{width: '100%'}}>
                        📋 Kopiuj powyzszy tekst do schowka
                    </button>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default IPZDashboard;

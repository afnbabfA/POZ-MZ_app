// ClinicalRulesEngine.js
// Logika biznesowa pozwalająca ujednolicić reguły z PDF "Moje Zdrowie"

export const evaluatePatient = (data) => {
  const flags = [];
  const recommendations = [];
  const diagnostics = [];

  const {
    age, gender, smoking, height, weight, waist, hips,
    glucose, tc, ldl, hdl, tg, lpa, last_fit, last_mammography, family_history,
    sbp, dbp, hr, spo2, rr, score2, ticks_exposure, diabetes, ckd, cvd, egfr, family_cvd, fh
  } = data;

  // --- OBLICZENIA ---
  const bmi = (weight && height) ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : null;
  const whr = (waist && hips) ? parseFloat((waist / hips).toFixed(2)) : null;

  // --- FLAGS (Czerwone flagi kliniczne) ---
  if (glucose || diabetes) {
    if (diabetes) flags.push({ level: 'danger', text: `Cukrzyca. Zwiększone ryzyko.`, id: 'dia' });
    else if (glucose >= 100 && glucose <= 125) flags.push({ level: 'warning', text: `Glukoza ${glucose} mg/dL: Stan przedcukrzycowy.`, id: 'gluc1' });
    else if (glucose >= 126) flags.push({ level: 'danger', text: `Glukoza ${glucose} mg/dL: Podejrzenie cukrzycy.`, id: 'gluc2' });
  }

  if (ldl && ldl > 115) {
    flags.push({ level: 'warning', text: `LDL ${ldl} mg/dL: Hiperlipidemia.`, id: 'ldl1' });
  }

  // BMI & Obwody (Otyłość Brzuszna IDF)
  if (bmi) {
    if (bmi >= 30) flags.push({ level: 'danger', text: `BMI ${bmi}: Otyłość. Wysokie ryzyko CV.`, id: 'bmi2' });
    else if (bmi >= 25) flags.push({ level: 'warning', text: `BMI ${bmi}: Nadwaga.`, id: 'bmi1' });
  }

  // IDF Criteria
  if (waist) {
    if ((gender === 'F' && waist >= 80) || (gender === 'M' && waist >= 94)) {
      flags.push({ level: 'warning', text: `Obwód talii ${waist}cm (IDF): Otyłość brzuszna. Ryzyko metaboliczne.`, id: 'idf_talia' });
    }
  }

  if (whr) {
    const whrRisk = (gender === 'F' && whr > 0.85) || (gender === 'M' && whr > 0.90);
    if (whrRisk) flags.push({ level: 'warning', text: `WHR ${whr}: Otyłość brzuszna wg IDF.`, id: 'whr1' });
  }

  // Lp(a) Ryzyko
  if (lpa) {
    if (lpa > 180) flags.push({ level: 'danger', text: `Lp(a) > 180mg/dL: Bardzo duże ryzyko sercowo-naczyniowe!`, id: 'lpa3' });
    else if (lpa > 50) flags.push({ level: 'danger', text: `Lp(a) > 50mg/dL: Duże ryzyko sercowo-naczyniowe.`, id: 'lpa2' });
    else if (lpa > 30) flags.push({ level: 'warning', text: `Lp(a) > 30mg/dL: Zwiększone ryzyko sercowo-naczyniowe.`, id: 'lpa1' });
  }

  // Twarde kryteria wysokiego ryzyka niezależnego od SCORE2
  const hasCkd = ckd || (egfr && egfr < 60);
  if (hasCkd || (bmi && bmi >= 30) || family_cvd || fh) {
    flags.push({ level: 'danger', text: `Uwaga: Pacjent wysokiego ryzyka sercowo-naczyniowego z uwagi na choroby współistniejące (PChN/Otyłość/Hipercholesterolemia).`, id: 'hard_risk' });
  }

  // Ciśnienie (Nadciśnienie >= 140/90)
  if (sbp >= 140 || dbp >= 90) {
    flags.push({ level: 'danger', text: `Ciśnienie ${sbp}/${dbp} mmHg: Podwyższone (Ryzyko Nadciśnienia).`, id: 'bp1' });
  } else if ((sbp >= 130 && sbp < 140) || (dbp >= 85 && dbp < 90)) {
    flags.push({ level: 'warning', text: `Ciśnienie ${sbp}/${dbp} mmHg: Wysokie prawidłowe.`, id: 'bp2' });
  }

  // Tętno
  if (hr > 100) flags.push({ level: 'warning', text: `Tętno (HR) ${hr}/min: Tachykardia.`, id: 'hr1' });
  if (hr > 0 && hr < 50) flags.push({ level: 'warning', text: `Tętno (HR) ${hr}/min: Bradykardia.`, id: 'hr2' });

  // Płuca / Tlen
  if (spo2 > 0 && spo2 < 95) flags.push({ level: 'danger', text: `SpO2 ${spo2}%: Podejrzenie Niedotlenienia.`, id: 'spo2' });
  if (rr > 20) flags.push({ level: 'warning', text: `Częstość oddechów (RR) ${rr}/min: Tachypnoe.`, id: 'rr' });

  // SCORE 2 Ryzyko
  if (score2) {
    if (score2 >= 7.5 && age < 50) flags.push({ level: 'danger', text: `SCORE2 ${score2}%: B. Wysokie ryzyko sercowo-naczyniowe w grupie wczesnej.`, id: 'score2' });
    else if (score2 >= 10 && age >= 50 && age <= 69) flags.push({ level: 'danger', text: `SCORE2 ${score2}%: B. Wysokie ryzyko sercowo-naczyniowe.`, id: 'score3' });
    else if (score2 >= 5) flags.push({ level: 'warning', text: `SCORE2 ${score2}%: Zwiększone ryzyko sercowo-naczyniowe.`, id: 'score1' });
  }

  if (smoking) {
    flags.push({ level: 'danger', text: 'Pacjent palący. Zwiększone ryzyko sercowo-naczyniowe i płucne.', id: 'smk' });
    recommendations.push("Porada Antytytoniowa / Skrzynka narzędziowa rzucania palenia.");
  }

  // --- DIAGNOSTICS (Badania profilaktyczne) ---
  const currentYear = new Date().getFullYear();

  const fitStartAge = family_history?.colon_cancer ? 40 : 50;
  if (age >= fitStartAge && age <= 74) {
    if (!last_fit || (currentYear - last_fit >= 2)) {
      diagnostics.push({ name: 'FIT-OC (Krew w kale - Badanie Profilaktyczne Jelita)', due: 'ZALECANE NATYCHMIAST', id: 'diag_fit' });
    } else {
      diagnostics.push({ name: 'FIT-OC', due: `Aktualne (powtórzyć w ${parseInt(last_fit) + 2})`, ok: true, id: 'diag_fit_ok' });
    }
  }

  if (gender === 'F' && age >= 45 && age <= 74) {
    if (!last_mammography || (currentYear - last_mammography >= 2)) {
      diagnostics.push({ name: 'Mammografia (Program Profilaktyki Raka Piersi)', due: 'ZALECANE NATYCHMIAST', id: 'diag_mammo' });
    } else {
      diagnostics.push({ name: 'Mammografia', due: `Aktualne (powtórzyć w ${parseInt(last_mammography) + 2})`, ok: true, id: 'diag_mammo_ok' });
    }
  }

  if (age >= 40 && age <= 65 && smoking) {
    diagnostics.push({ name: 'Spirometria / RTG Klatki (CHZP)', due: 'Rozważyć po ocenie objawów astma/POChP', id: 'diag_chzp' });
  }

  // --- RECOMMENDATIONS (Zalecenia ogólne i szczepienia) ---
  const {
    vac_dtap, vac_flu, vac_covid, vac_shingles, vac_pneumo, vac_rsv,
    vac_hpv, vac_kzm, vac_hbv, vac_hav, vac_mening, vac_mmr, vac_varicella, vac_travel,
    pregnancy_plans, travel_plans
  } = data;

  // 1. Podstawowe
  if (!vac_dtap) {
    if (pregnancy_plans) recommendations.push("Kluczowe: dTap (Tężec, Błonica, Krztusiec) przed ciążą.");
    else recommendations.push("Zalecane: dTap (Tężec, Błonica, Krztusiec) - przypominające co 10 lat.");
  }
  if (!vac_flu) recommendations.push("Zalecane: Grypa - coroczne szczepienie.");
  if (!vac_covid) recommendations.push("Zalecane: COVID-19 - aktualna dawka przypominająca.");

  // 2. Wiek
  if (!vac_shingles && age >= 50) recommendations.push("Zalecane: Półpasiec (wiek i ryzyko).");
  if (!vac_pneumo) {
    if (age >= 65) recommendations.push("Zalecane: Pneumokoki (wiek - pacjenci >65 r.ż.).");
    else if (smoking || cvd || ckd || glucose >= 126) recommendations.push("Wskazane: Pneumokoki (choroby współistniejące/palenie).");
  }
  if (!vac_rsv) {
    if (age >= 60) recommendations.push("Zalecane: RSV (wiek >=60 r.ż.).");
    else if (pregnancy_plans) recommendations.push("Wskazane: RSV (ochrona w czasie ciąży).");
  }
  if (!vac_hpv && age <= 45) recommendations.push("Do rozważenia: HPV (zależnie od historii).");

  // 3. Środowisko
  if (!vac_kzm && ticks_exposure) recommendations.push("Wskazane: Kleszczowe Zapalenie Mózgu (KZM) - narażenie z wywiadu.");
  if (!vac_hbv) recommendations.push("Wskazane: WZW B (szczególnie przed zabiegami lub ryzyko).");
  if (!vac_hav && travel_plans) recommendations.push("Wskazane: WZW A (plany podróżnicze / medycyna pracy).");

  // 4. Szczególne
  if (!vac_mening) recommendations.push("Do rozważenia: Meningokoki (asplenia, akademiki).");
  if ((!vac_varicella || !vac_mmr) && pregnancy_plans) {
    recommendations.push("PILNE: Ospa wietrzna / MMR - Kluczowe przed planowaną ciążą (szczepionki żywe!).");
  } else {
    if (!vac_mmr) recommendations.push("Do rozważenia: MMR (przy braku odporności).");
    if (!vac_varicella) recommendations.push("Do rozważenia: Ospa wietrzna (brak przechorowania).");
  }

  // 5. Podróż
  if (!vac_travel && travel_plans) recommendations.push("Zalecana Konsultacja Medycyny Podróży - Dur brzuszny, Żółta gorączka itp.");

  if (bmi >= 25 || glucose >= 100 || (sbp >= 140)) {
    recommendations.push("Porada Edukacyjno-Dietetyczna / Zmiana stylu życia.");
  }

  return { flags, diagnostics, recommendations, exactBmi: bmi, exactWhr: whr };
};

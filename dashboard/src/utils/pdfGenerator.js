import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import mapping from '../pdfMapping.json';

const drawCheck = (pages, key) => {
    const coord = mapping[key];
    if (!coord) return;
    drawCheckCustom(pages, coord.page, coord.x, coord.y);
};

const drawCheckCustom = (pages, pageIndex, x, y) => {
    const page = pages[pageIndex];
    page.drawLine({ start: { x: x + 2, y: y + 2 }, end: { x: x + 8, y: y + 8 }, color: rgb(0, 0, 0.8), thickness: 1.5 });
    page.drawLine({ start: { x: x + 2, y: y + 8 }, end: { x: x + 8, y: y + 2 }, color: rgb(0, 0, 0.8), thickness: 1.5 });
};

const drawText = (pages, key, text, size = 11, font = null) => {
    const coord = mapping[key];
    if (!coord || !text) return;
    const page = pages[coord.page];

    const options = {
        x: coord.x,
        y: coord.y,
        size: size,
        color: rgb(0, 0, 0.8),
    };
    if (font) options.font = font;

    page.drawText(String(text), options);
};

const drawEllipseMark = (pages, pageIndex, x, y, xScale, yScale) => {
    pages[pageIndex].drawEllipse({
        x: x,
        y: y,
        xScale: xScale,
        yScale: yScale,
        borderWidth: 1.5,
        borderColor: rgb(1, 0, 0),
        color: undefined
    });
};

export const generateNativePDF = async (patientData, settings, recommendations = []) => {
    // 1. Fetch template buffer
    const existingPdfBytes = await fetch('/template.pdf').then(res => res.arrayBuffer());

    // 2. Load PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Rejestrujemy moduł fontkit i osadzamy czcionkę obsługującą polskie znaki
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch('/Roboto-Regular.ttf').then(res => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();

    // 3. Wypełnianie zawartości tekstowej
    const dateNow = new Date().toLocaleDateString('pl-PL');
    drawText(pages, 'date', dateNow, 11, customFont);
    drawText(pages, 'name', patientData.imie_nazwisko, 11, customFont);
    drawText(pages, 'pesel', patientData.pesel, 11, customFont);

    // 4. Mechanika reguł i Checkboxy
    if (patientData.smoking) drawCheck(pages, 'smoking');
    if (patientData.alcohol) drawCheck(pages, 'alcohol');
    if (patientData.low_activity) drawCheck(pages, 'low_activity');
    if (patientData.bad_diet) {
        drawCheck(pages, 'bad_diet_1');
        drawCheck(pages, 'bad_diet_2');
    }

    const bmi = (patientData.weight && patientData.height) ? (patientData.weight / Math.pow(patientData.height / 100, 2)) : 0;

    // Otyłość brzuszna / WHR wg Norm PTMR
    const whr = (patientData.waist && patientData.hips) ? (patientData.waist / patientData.hips) : 0;
    const waistNum = Number(patientData.waist);
    const isObeseTruncal = (patientData.gender === 'F' && (waistNum >= 80 || whr > 0.85)) ||
        (patientData.gender === 'M' && (waistNum >= 94 || whr > 0.90));

    if (bmi >= 25 || isObeseTruncal) drawCheck(pages, 'bmi');

    if (patientData.sbp >= 140 || patientData.dbp >= 90) drawCheck(pages, 'bp');
    if (patientData.hr > 80) drawCheck(pages, 'hr');
    if (patientData.cvd) drawCheck(pages, 'cvd');
    if (patientData.glucose >= 100 || patientData.diabetes) drawCheck(pages, 'glucose');
    if (patientData.ldl > 115) drawCheck(pages, 'ldl');
    if (patientData.ckd) drawCheck(pages, 'ckd');
    if (patientData.depression) drawCheck(pages, 'depression');
    if (patientData.cognitive) drawCheck(pages, 'cognitive');
    if (patientData.psychosocial) drawCheck(pages, 'psychosocial');
    if (patientData.family_cvd) drawCheck(pages, 'family_cvd');
    if (patientData.family_cancer) drawCheck(pages, 'family_cancer');

    const isMale40 = patientData.gender === 'M' && patientData.age > 40;
    const isFe50 = patientData.gender === 'F' && patientData.age > 50;
    if (isMale40 || isFe50) drawCheck(pages, 'age_risk');

    // Checkbox Płeć Męska
    if (patientData.gender === 'M') {
        drawCheckCustom(pages, 0, 484.88, 211.71);
    }

    // Checkbox i wpis dla chorób współistniejących i ryzyk cywilizacyjnych ('inne _______')
    const inneItems = [];
    if (patientData.fh) inneItems.push("FH");
    if (patientData.ra) inneItems.push("RZS");
    if (patientData.migraine) inneItems.push("Migreny");
    if (patientData.stress) inneItems.push("Obc. psychospołeczne");
    if (patientData.sleep_apnea) inneItems.push("Zab. snu/rytmu dobowego");
    if (patientData.pollution) inneItems.push("Cz. Środowiskowe");
    if (patientData.sedentary) inneItems.push("Skrajny tryb siedzący");
    if (inneItems.length > 0) {
        drawCheckCustom(pages, 0, 484.88, 188.46); // checkbox inne
        pages[0].drawText(inneItems.join(", "), {
            x: 68, y: 191, size: 7, font: customFont, color: rgb(0, 0, 0.8)
        });
    }

    if (patientData.score2) {
        // SCORE2 Checkbox
        drawCheck(pages, 'score2_check');

        // Zapis wartości liczbowej nad ".......... %" (X: 246 i Y: 118 by skorygować w lewo i górę)
        pages[0].drawText(String(patientData.score2), {
            x: 260, y: 121, size: 10, font: customFont, color: rgb(0, 0, 0.8)
        });

        // Zakreślenie ryzyka SCORE2 na podstawie wieku i wyniku wg wytycznych ESC:
        let isVeryHigh = false;
        let isHigh = false;
        let st2 = Number(patientData.score2);
        let a = Number(patientData.age) || 50;

        if (a < 50) {
            if (st2 >= 7.5) isVeryHigh = true; else if (st2 >= 2.5) isHigh = true;
        } else if (a < 70) {
            if (st2 >= 10) isVeryHigh = true; else if (st2 >= 5) isHigh = true;
        } else {
            if (st2 >= 15) isVeryHigh = true; else if (st2 >= 7.5) isHigh = true;
        }

        if (isVeryHigh) drawEllipseMark(pages, 0, 489, 123, 40, 8); // bardzo wysokie
        else if (isHigh) drawEllipseMark(pages, 0, 545, 135, 25, 8); // wysokie
        else drawEllipseMark(pages, 0, 469, 135, 55, 8); // niskie lub umiarkowane

        // Pass values to global calculator
        patientData._score2_calculated_lvl = isVeryHigh ? 3 : (isHigh ? 2 : 1);
    }

    if (patientData.lpa) {
        // Zaznaczenie checkboxa obok wg Lp(a)
        drawCheckCustom(pages, 0, 183.75, 157.6);

        // Zapis wartości liczbowej Lp(a) na "............. mg/dl" (Zmieniono X na 260, aby tekst trafił idealnie nad kropki)
        pages[0].drawText(String(patientData.lpa), {
            x: 260, y: 164, size: 10, font: customFont, color: rgb(0, 0, 0.8)
        });

        // Zakreślenie ryzyka wg parametru (niskie, zwiększone, wysokie, bardzo wysokie)
        const lpa = Number(patientData.lpa);
        if (lpa > 180) {
            drawEllipseMark(pages, 0, 489, 157, 40, 8); // bardzo wysokie
            patientData._lpa_calculated_lvl = 3;
        } else if (lpa > 50) {
            drawEllipseMark(pages, 0, 535, 170, 26, 8); // wysokie
            patientData._lpa_calculated_lvl = 2;
        } else if (lpa > 30) {
            drawEllipseMark(pages, 0, 480, 170, 28, 8); // zwiększone
            patientData._lpa_calculated_lvl = 1;
        } else {
            drawEllipseMark(pages, 0, 442, 170, 18, 8); // niskie
            patientData._lpa_calculated_lvl = 1;
        }
    }

    //RYZYKO GLOBALNE (Najwyższe zagregowane ryzyko)
    let globalRisk = 0; // 0=none, 1=low/mod, 2=high, 3=very high
    if (patientData._score2_calculated_lvl) globalRisk = Math.max(globalRisk, patientData._score2_calculated_lvl);
    if (patientData._lpa_calculated_lvl) globalRisk = Math.max(globalRisk, patientData._lpa_calculated_lvl);

    // Twarde czynniki modyfikujące ryzyko w górę:
    const ckdFlag = patientData.ckd || (patientData.egfr && Number(patientData.egfr) < 60);
    if (patientData.cvd) globalRisk = 3; // Choroba naczyniowa = Od razu bardzo wysokie
    else if (ckdFlag || patientData.diabetes) globalRisk = Math.max(globalRisk, 2); // PChN / Cukrzyca = min. wysokie ryzyko
    else if (patientData.fh) globalRisk = Math.max(globalRisk, 2); // FH = wysokie ryzyko
    else if (patientData.sbp >= 180 || patientData.dbp >= 110) globalRisk = Math.max(globalRisk, 2); // Ciężkie NT = wysokie ryzyko
    else if (patientData.tc > 310 || patientData.ldl > 190) globalRisk = Math.max(globalRisk, 2); // Ciężka Hipercholesterolemia

    // Ocena Ryzyka Sercowo-Płucnego (nadpisanie ryzyka globalnego)
    let pochpFlagsGlobal = 0;
    if (patientData.lung_cough) pochpFlagsGlobal++;
    if (patientData.lung_dyspnea) pochpFlagsGlobal++;
    if (patientData.lung_sputum) pochpFlagsGlobal++;
    if (pochpFlagsGlobal >= 1 && globalRisk > 0 && globalRisk < 3) {
        globalRisk = 3;
        patientData._cardiopulmonary_override = true;
    }

    if (globalRisk > 0) {
        drawCheckCustom(pages, 0, 183.75, 87.1); // Zaznacz "globalne" (Zmieniono Y z 99.1 by uderzyć w kwadracik)
        if (globalRisk === 3) {
            drawEllipseMark(pages, 0, 489, 87, 40, 8); // bardzo wysokie
        } else if (globalRisk === 2) {
            drawEllipseMark(pages, 0, 538, 99, 25, 8); // wysokie
        } else {
            drawEllipseMark(pages, 0, 469, 99, 50, 8); // niskie lub umiarkowane
        }
    }

    // STRONA 2
    if (bmi >= 25 || isObeseTruncal || patientData.glucose >= 100 || patientData.diabetes || patientData.sbp >= 140 || patientData.bad_diet) {
        drawCheck(pages, 'zal_diet');
        drawCheck(pages, 'zal_diet_edu');
    }

    if (patientData.low_activity) drawCheck(pages, 'zal_physical');
    if (patientData.glucose >= 100 || patientData.diabetes) drawCheck(pages, 'zal_glucose');

    // Profilaktyka raka szyjki macicy (Skryning zalecany miedzy 25 a 64 r.ż.)
    if (patientData.gender === 'F' && patientData.age >= 25 && patientData.age <= 64) {
        drawCheck(pages, 'zal_cyto');
        // Jeśli mamy datę ostatniego badania, nie zaszkodzi obliczyć, w przeciwnym razie ustawiamy 'co 5 lat / PILNE'
        const cytoDateText = patientData.last_hpv ? String(parseInt(patientData.last_hpv) + 5) : (patientData.last_cyto ? String(parseInt(patientData.last_cyto) + 3) : 'co 5 lat / pilne');
        drawText(pages, 'zal_cyto_date', cytoDateText, 10, customFont);
    }

    // Program Profilaktyki Raka Piersi
    if (patientData.gender === 'F' && patientData.age >= 45 && patientData.age <= 74) {
        drawCheck(pages, 'zal_mammo');
        const mammoDateText = patientData.last_mammography ? String(parseInt(patientData.last_mammography) + 2) : 'co 2 lata / pilne';
        drawText(pages, 'zal_mammo_date', mammoDateText, 10, customFont);
    }
    
    // Profilaktyka Raka Jelita Grubego
    if (patientData.age >= 50 && patientData.age <= 74) {
        drawCheck(pages, 'zal_fit');
        const fitDateText = patientData.last_fit ? String(parseInt(patientData.last_fit) + 2) : 'co 2 lata / pilne';
        drawText(pages, 'zal_fit_date', fitDateText, 10, customFont);
    }

    if (patientData.smoking) drawCheck(pages, 'zal_smoking');
    if (patientData.alcohol) drawCheck(pages, 'zal_alcohol');

    drawText(pages, 'provider', settings.providerName, 12, customFont);
    drawText(pages, 'zal_vaccinations', '(patrz: załącznik)', 10, customFont);

    if (settings.facilityName) {
        pages[1].drawText(String(settings.facilityName), {
            x: 75,
            y: 155,
            size: 11,
            font: customFont,
            color: rgb(0, 0, 0.8),
            lineHeight: 14
        });
    }

    // Dodatkowe zalecenia przenieśliśmy na CZYSTĄ, NOWĄ STRONĘ!
    let draftRecs = [...(recommendations || [])];

    // Diagnostyka Płuc (POChP / NPL) 
    if (patientData.smoking || patientData.pollution) {
        if (patientData.smoking) {
            draftRecs.push("Palenie tytoniu: Zastosowano interwencję antynikotynową oraz interwencję prozdrowotną z zakresu chorób płuc po zebraniu wywiadu.");
        }

        let pochpFlags = 0;
        if (patientData.lung_cough) pochpFlags++;
        if (patientData.lung_dyspnea) pochpFlags++;
        if (patientData.lung_sputum) pochpFlags++;

        if (pochpFlags >= 1) {
            draftRecs.push("Podejrzenie POChP (wytyczne GOLD 2025): Skierowano na badanie Spirometrii z próbą rozkurczową w ramach opieki koordynowanej (ścieżka pulmonologiczna).");
            draftRecs.push("Podejrzenie POChP (wytyczne GOLD 2025): Skierowano pacjenta na badanie RTG klatki piersiowej w ramach pogłębionej diagnostyki.");
        }

        if (patientData.lung_hemoptysis || patientData.lung_weight_loss || patientData.lung_chest_pain) {
            draftRecs.push("PILNE (NPL): Podejrzenie procesu nowotworowego płuc z powodu wystąpienia objawów alarmowych! Zalecono niezwłoczne wydanie karty DILO i dalszą diagnostykę (np. TK klatki piersiowej).");
        }
    }

    if (patientData._cardiopulmonary_override) {
        draftRecs.push("UWAGA: Z powodu nakładania ryzyka sercowo-płucnego (podejrzenie POChP we współistnieniu), globalne ryzyko sercowo-naczyniowe na stronie 1 sklasyfikowano jako Bardzo Wysokie.");
    }

    // -- Wywiad Rodzinny (Nagłe zgony sercowe / Wczesne S-N) --
    if (patientData.family_cvd && patientData.family_cvd_early) {
        draftRecs.push("Z uwagi na obciążony wywiad rodzinny (wczesne zdarzenia sercowo-naczyniowe / nagły zgon sercowy w młodym wieku), wskazane jest ściślejsze monitorowanie profilu lipidowego oraz utrzymywanie rygoru zdrowego stylu życia.");
    }

    // -- Skala Mini-COG --
    if (patientData.minicog_words !== '' && patientData.minicog_clock !== '' && patientData.age >= 60) {
        const score = Number(patientData.minicog_words) + Number(patientData.minicog_clock);
        if (score < 3) {
            draftRecs.push(`Wynik testu przesiewowego mini-COG: ${score}/5 pkt. ZABURZENIA POZNAWCZE. Zalecono pilne skierowanie i pogłębioną diagnostykę w Poradni Neurologicznej lub Psychiatrycznej.`);
            drawCheck(pages, 'cognitive'); // Wymuś zaznaczenie "zaburzenia poznawcze" w PDF
        } else {
            draftRecs.push(`Wynik testu przesiewowego mini-COG: ${score}/5 pkt. Wynik w normie dla wieku. Aktualnie brak wyraźnych cech otępiennych w ujęciu skali PTMR.`);
        }
    }

    // -- Izolacja społeczna i samotność (Drzewo Decyzyjne) --
    if (patientData.isolation) {
        draftRecs.push("KLUCZOWE RYZYKO: Izolacja społeczna i samotność. Przeprowadzono pogłębiony wywiad i wdrożono algorytm zaleceń:");

        if (patientData.iso_life_threat) {
            draftRecs.push("➔ PRIORYTET ABSOLUTNY: Stwierdzono myśli rezygnacyjne/samobójcze. Wymagana pilna konsultacja psychiatryczna! Skierowano na Izbę Przyjęć Psychiatryczną (IPP).");
        }
        if (patientData.iso_adl_limits) {
            draftRecs.push("➔ INTERWENCJA SOCJALNA: Stwierdzono niesamodzielność lub skrajne ubóstwo. Skierowano do Pracownika Socjalnego (MOPS/GOPS) oraz objęto opieką Pielęgniarki Środowiskowej.");
        }
        if (patientData.iso_symptoms) {
            draftRecs.push("➔ WSPARCIE KLINICZNE: Objawy osiowe (anhedonia, lęk). Skierowano do Poradni Zdrowia Psychicznego (PZP). Rozważono farmakoterapię wspierającą (np. SSRI).");
        }
        if (patientData.iso_substances) {
            draftRecs.push("➔ LECZENIE UZALEŻNIEŃ: Samoleczenie samotności używkami. Skierowano do Poradni Leczenia Uzależnień.");
        }
        if (patientData.iso_no_support) {
            draftRecs.push("➔ BRAK SIECI WSPARCIA: Pacjent nie może liczyć na pomoc bliskich. Wskazano kontakt z Pracownikiem Socjalnym (MOPS/GOPS) oraz lokalnymi organizacjami wolontariackimi w celu budowy sieci wsparcia.");
        }

        // Czysta izolacja (brak flag powyżej)
        if (!patientData.iso_life_threat && !patientData.iso_adl_limits && !patientData.iso_symptoms && !patientData.iso_substances) {
            draftRecs.push("➔ PRESKRYPCJA SPOŁECZNA: Czysta izolacja społeczna. Zalecono: Klub Seniora, Uniwersytet Trzeciego Wieku, Koło Gospodyń Wiejskich lub wolontariat.");
        }
    }

    // -- Cyfrowe nawyki i Social Media --
    if (patientData.digital_habits) {
        draftRecs.push("RYZYKO BEHAWIORALNE: Nadmierne korzystanie z mediów społecznościowych (IG, TikTok) i AI.");
        draftRecs.push("➔ ZALECENIE: Zapoznanie się z ulotką informacyjną dotyczącą higieny cyfrowej (Link: >>ulotka_w_przygotowaniu<<).");
        draftRecs.push("➔ SPECJALISTYKA: Skierowano do poradni leczenia uzależnień behawioralnych.");
    }

    // -- Screening Depresji (PHQ-2 / PHQ-9) --
    if (patientData.phq2_1 !== undefined && patientData.phq2_2 !== undefined) {
        const phq2_total = Number(patientData.phq2_1) + Number(patientData.phq2_2);
        
        if (phq2_total >= 3) {
            const q9_keys = ['phq2_1', 'phq2_2', 'phq9_3', 'phq9_4', 'phq9_5', 'phq9_6', 'phq9_7', 'phq9_8', 'phq9_9'];
            const allQ9Answered = q9_keys.every(k => patientData[k] !== undefined);
            
            if (allQ9Answered) {
                const phq9_total = q9_keys.reduce((acc, k) => acc + Number(patientData[k]), 0);
                let interp = "";
                if (phq9_total < 5) interp = "brak depresji";
                else if (phq9_total <= 9) interp = "lagodna depresja";
                else if (phq9_total <= 14) interp = "umiarkowana depresja";
                else if (phq9_total <= 19) interp = "umiarkowanie ciezkia depresja";
                else interp = "ciezka depresja";

                draftRecs.push(`SCREENING DEPRESJI: Wynik PHQ-9 wynosi ${phq9_total} pkt, co sugeruje: ${interp}.`);
                if (phq9_total >= 10) {
                    draftRecs.push("➔ ZALECENIE KLINICZNE: Wskazana pogłębiona diagnostyka psychiatryczna i rozważenie włączenia leczenia.");
                    draftRecs.push("➔ ŚCIEŻKA POMOCY: Najszybszą formą wsparcia jest Centrum Zdrowia Psychicznego (CZP) - pomoc bezpłatna, bez skierowania, w ciągu 72h.");
                }
                if (Number(patientData.phq9_9) > 0) {
                    draftRecs.push("➔ ALARM (CZERWONA FLAGA): Dodatnia odpowiedź w pytaniu o myśli samobójcze! Wymagana pilna ocena ryzyka i ew. skierowanie do IPP.");
                }
            }
        } else {
            draftRecs.push(`SCREENING DEPRESJI: Wynik PHQ-2 wynosi ${phq2_total}/6 pkt (poniżej progu odcięcia). Brak wskazań do pełnej ankiety PHQ-9.`);
        }
    }

    // Obowiązkowa klauzula NFZ / IPOM dla każdego pacjenta
    draftRecs.push("Oświadczenie wykonawcy: Powyższy Indywidualny Plan Opieki Medycznej (IPOM) wystawiono na podstawie zrealizowanej porady i ewaluacji w ramach świadczenia gwarantowanego Bilans Zdrowia Osoby Dorosłej. Powyższa dokumentacja spełnia medyczne wymogi rozliczeń profilaktyki z NFZ według dedykowanych kodów ICD-10.");

    if (draftRecs.length > 0) {
        // Dodajemy nową pustą stronę do dokumentu (rozmiar A4 to 595.28 x 841.89)
        const width = 595.28;
        const height = 841.89;
        const p3 = pdfDoc.addPage([width, height]);

        let cursorY = height - 70; // górny margines
        const marginLeft = 70;
        const printWidth = width - 140;

        // Tytuł
        p3.drawText("Zalacznik: Indywidualne Zalecenia i Wytyczne Szczepienne", {
            x: marginLeft,
            y: cursorY,
            size: 14,
            font: customFont,
            color: rgb(0, 0, 0.6)
        });

        p3.drawLine({ start: { x: marginLeft, y: cursorY - 10 }, end: { x: width - 70, y: cursorY - 10 }, color: rgb(0, 0, 0.6), thickness: 1 });

        cursorY -= 40;
        const fontSize = 11;
        const lineHeight = 16;

        // Funkcja do zawijania długiego tekstu by nie wykraczał za margines kartki!
        const wrapText = (text, maxWidth, font, size) => {
            const words = text.split(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const w = font.widthOfTextAtSize(currentLine + " " + word, size);
                if (w < maxWidth) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        };

        for (const rec of draftRecs) {
            // Zamieniamy na bezpieczne polskie znaki ew. przez font
            const lines = wrapText(`• ${rec}`, printWidth, customFont, fontSize);

            // Dynamiczne pętle by dodawać tekst linijka po linijce
            for (let j = 0; j < lines.length; j++) {
                const indent = j === 0 ? 0 : 15; // wcięcie dla wyrazów przechodzących do nowej linii
                p3.drawText(lines[j], {
                    x: marginLeft + indent,
                    y: cursorY,
                    size: fontSize,
                    font: customFont,
                    color: rgb(0.1, 0.1, 0.1)
                });
                cursorY -= lineHeight;
            }
            cursorY -= 8; // Odstęp miedzy kolejnymi punktami

            // Jesli przeskoczymy stronę - dodajemy kolejną (rozszerzalność)
            if (cursorY < 180) { // Zwiększono margines dolny dla stopki kryzysowej
                // Dla pewnosci limit
                break;
            }
        }

        // Stopka, disclaimer (na dole strony)
        cursorY -= 20;
        const disclaimer = "Powyższe zalecenia mają charakter informacyjny i zostały wygenerowane automatycznie na podstawie wywiadu. Ostateczną decyzję o kwalifikacji oraz wykonaniu szczepienia zawsze podejmuje lekarz.";
        const discLines = wrapText(disclaimer, printWidth, customFont, 9);
        for (const line of discLines) {
            p3.drawText(line, {
                x: marginLeft,
                y: cursorY,
                size: 9,
                font: customFont,
                color: rgb(0.4, 0.4, 0.4)
            });
            cursorY -= 12;
        }

        // Miejsce na pieczątkę i podpis
        p3.drawText(".............................................", {
            x: width - 220,
            y: 90,
            size: 10,
            font: customFont,
            color: rgb(0, 0, 0)
        });
        p3.drawText("Pieczatka i podpis lekarza", {
            x: width - 190,
            y: 75,
            size: 8,
            font: customFont,
            color: rgb(0.4, 0.4, 0.4)
        });
    }

    // Zapisz i zwróć buffor binarny
    return await pdfDoc.save();
};

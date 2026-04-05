# Lista rzeczy do zrobienia (TODO) na przyszłość

## 1. Ulepszenie generowania raportów PDF (Odejście od pdf-lib)
**Status:** Wstrzymane / Do zbadania w przyszłości.

**Kontekst:** 
Próba zmiany narzędzia generującego PDF z `pdf-lib` (które bazuje na "rysowaniu" po współrzędnych na oryginalnym `template.pdf`) na `html2pdf.js` bazujące na przekonwertowanym dokumencie HTML. 
Zależało nam na płynnym ułożeniu (tzw. flow layout) długiej listy zaleceń i szczepień.

**Wnioski z testów (Dlaczego to się nie udało):** 
- Narzędzia konwertujące z PDF do HTML (jak `pdf2htmlEX`) wymuszają rygorystyczny, całkowicie sztywny układ elementów (za pomocą CSS pozycjonowania absolutnego typu `left: 10px`, `top: 50px`). 
- Przeglądarkowe biblioteki takie jak `html2pdf.js` oraz wbudowany pod nią mechanizm `html2canvas` często zgłaszają błędy na takich dokumentach, ucinając elementy i gubiąc style ukrytych czcionek, co skutkuje wyrenderowaniem nieprzyjemnej "pustej" karty.

**Możliwe rozwiązania na później:**
1. **Odtworzenie formularza ręcznie:** Stworzenie od zera, w 100% płynnego (responsywnego) szablonu HTML (z użyciem HTML/CSS np. klas `flex`, `grid`, `table`) przypominającego układem druk NFZ. Wtedy eksport przy użyciu `window.print()` / `html2pdf.js` zagwarantuje piękny rezultat, na który tekst zalecenia wpłynie naturalnie przesuwając inne pola w dół w sposób poprawny.
2. **Backend Rendering:** Zastosowanie serwera (np. Node.js + `Puppeteer`), który otwiera ukryte "czyste" okno Chrome i wykorzystuje domyślne, o wiele potężniejsze opcje konwersji do PDF.
3. *Obecne stabilne obejście:* Dynamiczne doklejanie odrębnego **Załącznika nr 1 (na trzeciej stronie dokumentu pdf-lib)** idealnie wyrównującego zawijający się tekst, dzięki czemu nic nie zachodzi na tabelę na drugiej stronie.

## 2. Inne
- [ ] Rozważyć wdrożenie bazy wiedzy ICD-10 dla innych chorób.
- [ ] Rozwój zaleceń i wytycznych (osobny ekran do zarządzania logiką decyzyjną).

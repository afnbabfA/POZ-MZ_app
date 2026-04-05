#!/bin/bash
# Skrypt do uruchamiania projektu Moje Zdrowie jednym kliknięciem

# Przejdź do folderu skryptu
cd "$(dirname "$0")"
cd dashboard

echo "--- Sprawdzanie środowiska Moje Zdrowie ---"

# Sprawdź czy node_modules istnieje, jeśli nie - zainstaluj
if [ ! -d "node_modules" ]; then
    echo "Instalowanie zależności Node.js..."
    npm install
fi

# Sprawdź czy PyMuPDF jest zainstalowany
echo "Sprawdzanie zależności Python (PyMuPDF)..."
python3 -c "import fitz" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "UWAGA: Brak biblioteki PyMuPDF (fitz) dla Pythona."
    echo "Próba automatycznej instalacji..."
    python3 -m pip install pymupdf
fi

echo "--- Uruchamianie Backend + Frontend ---"
npm run dev:all

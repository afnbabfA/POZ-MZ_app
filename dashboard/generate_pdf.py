import sys
import os
import json
import datetime
try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF (fitz) is required.")
    sys.exit(1)

def find_nearest_checkbox(page, text_phrase, all_boxes, max_dx=350):
    rects = page.search_for(text_phrase)
    if not rects:
        return None
    
    text_y = rects[0].y0
    best_box = None
    min_dy = 999
    for box in all_boxes:
        dy = abs(box.y0 - text_y)
        if dy < 15 and dy < min_dy:
            min_dy = dy
            best_box = box
            
    return best_box

def draw_check(page, rect):
    if rect:
        p1 = fitz.Point(rect.x0 + 3, rect.y0 + 3)
        p2 = fitz.Point(rect.x1 - 3, rect.y1 - 3)
        p3 = fitz.Point(rect.x0 + 3, rect.y1 - 3)
        p4 = fitz.Point(rect.x1 - 3, rect.y0 + 3)
        
        shape = page.new_shape()
        shape.draw_line(p1, p2)
        shape.draw_line(p3, p4)
        shape.finish(color=(0, 0, 0.8), width=2)
        shape.commit()

def fill_pdf(input_pdf, output_pdf, data_json):
    print("Parsing patient data...")
    if not data_json or not os.path.exists(data_json):
        print("Brak pliku JSON!")
        return

    with open(data_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    bmi = 0
    if data.get('weight') and data.get('height') and data['height'] > 0:
        bmi = data['weight'] / ((data['height']/100)**2)
    
    sbp = data.get('sbp', 0) if data.get('sbp') else 0
    dbp = data.get('dbp', 0) if data.get('dbp') else 0
    hr = data.get('hr', 0) if data.get('hr') else 0
    gluk = data.get('glucose', 0) if data.get('glucose') else 0
    ldl = data.get('ldl', 0) if data.get('ldl') else 0
    
    doc = fitz.open(input_pdf)
    
    # STRONA 1
    page1 = doc[0]
    boxes1 = page1.search_for("☐") + page1.search_for("◻")
    
    # 1. Data Wygenerowania
    date_rect = page1.search_for("UTWORZONY DNIA")
    if date_rect:
        current_date = datetime.datetime.now().strftime("%d.%m.%Y")
        page1.insert_text((date_rect[0].x1 + 10, date_rect[0].y1 - 2), current_date, fontsize=12, color=(0,0,0.8), fontname="helv")
    
    # Header
    p_name = page1.search_for("Imię i nazwisko:")
    if p_name: page1.insert_text((p_name[0].x1 + 10, p_name[0].y1 - 2), data.get('imie_nazwisko', ''), fontsize=12, color=(0,0,0.8), fontname="helv")
    
    p_pesel = page1.search_for("PESEL:")
    if p_pesel: page1.insert_text((p_pesel[0].x1 + 10, p_pesel[0].y1 - 2), data.get('pesel', ''), fontsize=12, color=(0,0,0.8), fontname="helv")
    
    # Tabela 1 - Czynniki ryzyka
    if data.get('smoking'): draw_check(page1, find_nearest_checkbox(page1, "palenie tytoniu", boxes1))
    if data.get('alcohol'): draw_check(page1, find_nearest_checkbox(page1, "nadużywanie alkoholu", boxes1))
    if data.get('low_activity'): draw_check(page1, find_nearest_checkbox(page1, "niska aktywność", boxes1))
    if data.get('bad_diet'): draw_check(page1, find_nearest_checkbox(page1, "nieprawidłowe nawyki powięziowe", boxes1))
    if data.get('bad_diet'): draw_check(page1, find_nearest_checkbox(page1, "nieprawidłowe nawyki żywieniowe", boxes1))
    if bmi >= 25: draw_check(page1, find_nearest_checkbox(page1, "nadwaga lub otyłość", boxes1))
    if sbp >= 140 or dbp >= 90: draw_check(page1, find_nearest_checkbox(page1, "podwyższone wartości ciśnienia", boxes1))
    if hr > 80: draw_check(page1, find_nearest_checkbox(page1, "spoczynkowa akcja serca ponad", boxes1))
    if data.get('cvd'): draw_check(page1, find_nearest_checkbox(page1, "rozpoznana choroba sercowo", boxes1))
    if gluk >= 100: draw_check(page1, find_nearest_checkbox(page1, "podwyższone stężenie glukozy", boxes1))
    if ldl > 115: draw_check(page1, find_nearest_checkbox(page1, "nieprawidłowy lipidogram", boxes1))
    if data.get('ckd'): draw_check(page1, find_nearest_checkbox(page1, "poziom kreatyniny", boxes1))
    if data.get('depression'): draw_check(page1, find_nearest_checkbox(page1, "podejrzenie depresji", boxes1))
    if data.get('cognitive'): draw_check(page1, find_nearest_checkbox(page1, "funkcji poznawczych", boxes1))
    if data.get('psychosocial'): draw_check(page1, find_nearest_checkbox(page1, "inne czynniki psychospołeczne", boxes1))
    if data.get('family_cvd'): draw_check(page1, find_nearest_checkbox(page1, "sercowo-naczyniowych w rodzinie", boxes1))
    if data.get('family_cancer'): draw_check(page1, find_nearest_checkbox(page1, "nowotworowych w rodzinie", boxes1))
    
    age = data.get('age', 0) if data.get('age') else 0
    sex = data.get('gender', '')
    if (sex == 'M' and age > 40) or (sex == 'F' and age > 50):
        draw_check(page1, find_nearest_checkbox(page1, "wiek ponad 40 lat u m", boxes1))
        
    score2 = data.get('score2')
    if score2:
        s_rect = page1.search_for("wg SCORE2")
        if s_rect:
            page1.insert_text((s_rect[0].x0 + 190, s_rect[0].y1 - 2), str(score2), fontsize=10, color=(0,0,0.8))
            draw_check(page1, find_nearest_checkbox(page1, "wg SCORE2", boxes1))

    # STRONA 2 (Zalecenia i Edukacja)
    page2 = doc[1]
    boxes2 = page2.search_for("☐") + page2.search_for("◻")
    
    if bmi >= 25 or gluk >= 100 or sbp >= 140 or data.get('bad_diet'):
        draw_check(page2, find_nearest_checkbox(page2, "sposób odżywiania", boxes2))
        draw_check(page2, find_nearest_checkbox(page2, "porada edukacyjna w zakresie odżywiania", boxes2))

    if data.get('low_activity'):
        draw_check(page2, find_nearest_checkbox(page2, "aktywność fizyczna", boxes2))
        
    if gluk >= 100:
        draw_check(page2, find_nearest_checkbox(page2, "stężenie glukozy na czczo", boxes2))
        
    if sex == 'F' and 45 <= age <= 74:
        draw_check(page2, find_nearest_checkbox(page2, "mammografia", boxes2))
    
    if 50 <= age <= 74:
        draw_check(page2, find_nearest_checkbox(page2, "FIT-OC", boxes2))
        
    if data.get('smoking'):
        draw_check(page2, find_nearest_checkbox(page2, "porada antynikotynowa", boxes2))
        
    if data.get('alcohol'):
        draw_check(page2, find_nearest_checkbox(page2, "ograniczenia nadmiernego spożycia", boxes2))

    # OZNACZENIE LEKARZA / PIELĘGNIARKI Z USTAWIEŃ
    prov_rect = page2.search_for("Oznaczenie lekarza/pielęgniarki")
    if prov_rect:
        provider = data.get('providerName', '')
        facility = data.get('facilityName', '')
        page2.insert_text((prov_rect[0].x0, prov_rect[0].y1 + 15), provider, fontsize=12, color=(0,0,0.8), fontname="helv")
        page2.insert_text((prov_rect[0].x0, prov_rect[0].y1 + 40), facility, fontsize=12, color=(0,0,0.8), fontname="helv", italic=True)

    doc.save(output_pdf)
    print("PDF pomyślnie zaktualizowany!")

if __name__ == "__main__":
    baza_dir = "/Users/konto123/Downloads/4POZ_MZ/baza_pdf"
    template_pdf = os.path.join(baza_dir, "Wzor-IPZ-Moje-Zdrowie-PTMR.pdf")
    output_pdf = os.path.join(baza_dir, "Wzor-IPZ-Moje-Zdrowie-PTMR_Wypelniony.pdf")
    
    json_path = sys.argv[1] if len(sys.argv) > 1 else None
    fill_pdf(template_pdf, output_pdf, json_path)

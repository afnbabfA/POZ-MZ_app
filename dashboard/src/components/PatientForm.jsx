import React from 'react';
import { analyzePesel } from '../utils/peselUtils';

import ValidationBanners from './PatientFormSections/ValidationBanners';
import PatientDataSection from './PatientFormSections/PatientDataSection';
import MeasurementsSection from './PatientFormSections/MeasurementsSection';
import LabsSection from './PatientFormSections/LabsSection';
import RiskFactorsSection from './PatientFormSections/RiskFactorsSection';
import ScreeningSection from './PatientFormSections/ScreeningSection';
import PhysicalExamSection from './PatientFormSections/PhysicalExamSection';
import VaccinationSection from './PatientFormSections/VaccinationSection';

const PatientForm = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : (type === 'number' && value !== '' ? Number(value) : value);
    let newData = { ...data, [name]: newValue };

    if (name === 'pesel' && String(newValue).length === 11) {
        const parsed = analyzePesel(String(newValue));
        if (parsed) {
            // Auto-fill wiek if empty
            if (!newData.age) newData.age = parsed.age;
            // Zawsze nadpisz płeć wg peselu
            newData.gender = parsed.gender;
        }
    }

    onChange(newData);
  };

  const parsedPesel = analyzePesel(data.pesel);
  const showAgeWarning = parsedPesel && data.age !== '' && Number(data.age) !== parsedPesel.age;

  const bmi = (data.weight && data.height) ? (data.weight / Math.pow(data.height / 100, 2)).toFixed(1) : '';
  const whr = (data.waist && data.hips) ? (data.waist / data.hips).toFixed(2) : '';

  // Soft/Hard Validation Logic
  const errors = [];
  const warnings = [];

  if (data.height) {
      if (data.height < 100 || data.height > 250) errors.push("Wzrost wydaje się nierealny (<100 lub >250 cm).");
  }
  if (data.weight) {
      if (data.weight < 30 || data.weight > 300) errors.push("Waga wydaje się nierealna (<30 lub >300 kg).");
  }
  if (data.waist) {
      if (data.waist < 40 || data.waist > 300) errors.push("Obwód pasa wydaje się nierealny (<40 lub >300 cm).");
  }
  if (data.hips) {
      if (data.hips < 40 || data.hips > 240) errors.push("Obwód bioder wydaje się nierealny (<40 lub >240 cm).");
  }
  if (data.sbp) {
      if (data.sbp > 220 || data.sbp < 60) errors.push("Skrajnie niebezpieczne wartości sBP.");
      else if (data.sbp >= 160) warnings.push("Wysokie ciśnienie skurczowe (sBP) wpisane w form!");
  }
  if (data.dbp) {
      if (data.dbp > 130 || data.dbp < 40) errors.push("Skrajnie niebezpieczne wartości dBP.");
      else if (data.dbp >= 100) warnings.push("Wysokie ciśnienie rozkurczowe (dBP) wpisane w form!");
  }

  return (
    <>
      <ValidationBanners 
          showAgeWarning={showAgeWarning} 
          parsedPesel={parsedPesel} 
          dataAge={data.age} 
          errors={errors} 
          warnings={warnings} 
      />
      <PatientDataSection data={data} onChange={handleChange} />
      <MeasurementsSection data={data} onChange={handleChange} bmi={bmi} whr={whr} />
      <LabsSection data={data} onChange={handleChange} />
      <RiskFactorsSection data={data} onChange={handleChange} />
      <ScreeningSection data={data} onChange={handleChange} />
      <PhysicalExamSection data={data} onChange={handleChange} bmi={bmi} />
      <VaccinationSection data={data} onChange={handleChange} />
    </>
  );
};

export default PatientForm;

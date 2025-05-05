
import { useState } from 'react';

export const useVaccinationState = (
  initialVaccines: any[] = [],
  initialVaccinationRecords: any[] = []
) => {
  const [vaccines, setVaccines] = useState(initialVaccines);
  const [vaccinationRecords, setVaccinationRecords] = useState(initialVaccinationRecords);

  const addVaccine = (vaccine: any) => {
    setVaccines([...vaccines, vaccine]);
  };

  const addVaccinationRecord = (record: any) => {
    setVaccinationRecords([...vaccinationRecords, record]);
  };

  return {
    vaccines,
    vaccinationRecords,
    addVaccine,
    addVaccinationRecord
  };
};

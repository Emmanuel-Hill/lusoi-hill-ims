
import { downloadExcelFile, downloadPdfFile } from './exportHelpers';
import { formatDate } from './formatHelpers';

// Vaccination Reports
export const generateVaccinationReport = (
  vaccinationRecords: any[],
  vaccines: any[],
  batches: any[],
  fileType: 'excel' | 'pdf'
): void => {
  if (!vaccinationRecords || vaccinationRecords.length === 0) {
    alert('No vaccination data to generate report');
    return;
  }

  const getVaccineName = (vaccineId: string): string => {
    const vaccine = vaccines.find(v => v.id === vaccineId);
    return vaccine ? vaccine.name : 'Unknown Vaccine';
  };

  const getBatchName = (batchId: string): string => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  const reportData = vaccinationRecords.map(record => ({
    Date: formatDate(record.date),
    Batch: getBatchName(record.batchId),
    Vaccine: getVaccineName(record.vaccineId),
    'Next Due Date': record.nextScheduledDate ? formatDate(record.nextScheduledDate) : '-',
    Notes: record.notes || '-'
  }));

  if (fileType === 'excel') {
    downloadExcelFile(reportData, 'vaccination_report');
  } else {
    const columns = ['Date', 'Batch', 'Vaccine', 'Next Due Date', 'Notes'];
    downloadPdfFile(reportData, columns, 'Vaccination Report', 'vaccination_report');
  }
};

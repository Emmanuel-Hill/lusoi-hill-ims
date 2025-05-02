
import { downloadExcelFile, downloadPdfFile } from './exportHelpers';
import { formatDate } from './formatHelpers';

// Batch Reports
export const generateBatchReport = (batches: any[], fileType: 'excel' | 'pdf'): void => {
  if (!batches || batches.length === 0) {
    alert('No batch data to generate report');
    return;
  }

  const reportData = batches.map(batch => ({
    Name: batch.name,
    'Bird Count': batch.birdCount,
    Status: batch.batchStatus,
    'Created At': formatDate(batch.createdAt),
    Notes: batch.notes || '-'
  }));

  if (fileType === 'excel') {
    downloadExcelFile(reportData, 'batches_report');
  } else {
    const columns = ['Name', 'Bird Count', 'Status', 'Created At', 'Notes'];
    downloadPdfFile(reportData, columns, 'Batches Report', 'batches_report');
  }
};

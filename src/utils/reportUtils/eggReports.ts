
import { downloadExcelFile, downloadPdfFile } from './exportHelpers';
import { formatDate } from './formatHelpers';

// Egg Collection Reports
export const generateEggCollectionReport = (
  eggCollections: any[], 
  batches: any[], 
  fileType: 'excel' | 'pdf'
): void => {
  if (!eggCollections || eggCollections.length === 0) {
    alert('No egg collection data to generate report');
    return;
  }

  const getBatchName = (batchId: string): string => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  const reportData = eggCollections.map(collection => ({
    Date: formatDate(collection.date),
    Batch: getBatchName(collection.batchId),
    'Whole Eggs': collection.wholeCount,
    'Broken Eggs': collection.brokenCount,
    'Total Eggs': collection.wholeCount + collection.brokenCount,
    Notes: collection.notes || '-'
  }));

  if (fileType === 'excel') {
    downloadExcelFile(reportData, 'egg_collection_report');
  } else {
    const columns = ['Date', 'Batch', 'Whole Eggs', 'Broken Eggs', 'Total Eggs', 'Notes'];
    downloadPdfFile(reportData, columns, 'Egg Collection Report', 'egg_collection_report');
  }
};

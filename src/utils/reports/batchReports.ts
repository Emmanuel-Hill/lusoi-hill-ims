
import { Batch, EggCollection } from '@/types';
import { exportToExcel, exportToPDF, formatDate } from './shared';

// Generate batch reports
export const generateBatchReport = (
  batches: Batch[],
  format: 'excel' | 'pdf'
): void => {
  const reportData = batches.map(batch => ({
    name: batch.name,
    birdCount: batch.birdCount,
    status: batch.batchStatus,
    createdAt: formatDate(batch.createdAt),
    notes: batch.notes || '-'
  }));
  
  if (format === 'excel') {
    exportToExcel(reportData, 'Batches', 'lusoi_batches_report');
  } else {
    const columns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Bird Count', dataKey: 'birdCount' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Created Date', dataKey: 'createdAt' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    exportToPDF(reportData, 'Lusoi Farm - Batches Report', 'lusoi_batches_report', columns);
  }
};

// Generate egg collection reports
export const generateEggCollectionReport = (
  eggCollections: EggCollection[],
  batches: Batch[],
  format: 'excel' | 'pdf'
): void => {
  const reportData = eggCollections.map(egg => {
    const batch = batches.find(b => b.id === egg.batchId);
    return {
      date: formatDate(egg.date),
      batchName: batch ? batch.name : 'Unknown',
      wholeCount: egg.wholeCount,
      brokenCount: egg.brokenCount,
      totalCount: egg.wholeCount + egg.brokenCount,
      notes: egg.notes || '-'
    };
  });
  
  if (format === 'excel') {
    exportToExcel(reportData, 'Egg Collections', 'lusoi_egg_collections_report');
  } else {
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Batch', dataKey: 'batchName' },
      { header: 'Whole Eggs', dataKey: 'wholeCount' },
      { header: 'Broken Eggs', dataKey: 'brokenCount' },
      { header: 'Total Eggs', dataKey: 'totalCount' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    exportToPDF(reportData, 'Lusoi Farm - Egg Collection Report', 'lusoi_egg_collections_report', columns);
  }
};


import * as XLSX from 'xlsx';
import { downloadExcelFile, createMultiSectionPdfReport } from './exportHelpers';
import { getFileName } from './formatHelpers';
import { formatDate } from './formatHelpers';

// Feed Management Reports
export const generateFeedManagementReport = (
  feedConsumption: any[],
  feedInventory: any[],
  feedTypes: any[],
  batches: any[],
  fileType: 'excel' | 'pdf'
): void => {
  if ((!feedConsumption || feedConsumption.length === 0) && 
      (!feedInventory || feedInventory.length === 0)) {
    alert('No feed data to generate report');
    return;
  }

  const getFeedName = (feedTypeId: string): string => {
    const feedType = feedTypes.find(ft => ft.id === feedTypeId);
    return feedType ? feedType.name : 'Unknown Feed';
  };

  const getBatchName = (batchId: string): string => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  // Consumption Report
  const consumptionData = feedConsumption.map(consumption => ({
    Date: formatDate(consumption.date),
    'Feed Type': getFeedName(consumption.feedTypeId),
    Batch: getBatchName(consumption.batchId),
    'Quantity (kg)': consumption.quantityKg,
    'Time of Day': consumption.timeOfDay,
    Notes: consumption.notes || '-'
  }));

  // Inventory Report
  const inventoryData = feedInventory.map(inventory => ({
    Date: formatDate(inventory.date),
    'Feed Type': getFeedName(inventory.feedTypeId),
    'Quantity (kg)': inventory.quantityKg,
    'Transaction Type': inventory.isProduced ? 'Produced' : 'Purchased',
    Notes: inventory.notes || '-'
  }));

  if (fileType === 'excel') {
    const workbook = XLSX.utils.book_new();
    
    if (consumptionData.length > 0) {
      const consumptionSheet = XLSX.utils.json_to_sheet(consumptionData);
      XLSX.utils.book_append_sheet(workbook, consumptionSheet, 'Consumption');
    }
    
    if (inventoryData.length > 0) {
      const inventorySheet = XLSX.utils.json_to_sheet(inventoryData);
      XLSX.utils.book_append_sheet(workbook, inventorySheet, 'Inventory');
    }
    
    XLSX.writeFile(workbook, getFileName('feed_management_report', 'xlsx'));
  } else {
    // Create multi-section PDF
    const sections = [];
    
    if (consumptionData.length > 0) {
      sections.push({
        title: 'Feed Consumption Records',
        columns: ['Date', 'Feed Type', 'Batch', 'Quantity (kg)', 'Time of Day', 'Notes'],
        data: consumptionData
      });
    }
    
    if (inventoryData.length > 0) {
      sections.push({
        title: 'Feed Inventory Records',
        columns: ['Date', 'Feed Type', 'Quantity (kg)', 'Transaction Type', 'Notes'],
        data: inventoryData
      });
    }
    
    createMultiSectionPdfReport(sections, 'Feed Management Report', 'feed_management_report');
  }
};

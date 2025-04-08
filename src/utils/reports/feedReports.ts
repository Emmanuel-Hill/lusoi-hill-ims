
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Batch, FeedConsumption, FeedInventory, FeedType } from '@/types';
import { exportToExcel, formatDate } from './shared';
import { format } from 'date-fns';

export const generateFeedManagementReport = (
  feedConsumption: FeedConsumption[],
  feedInventory: FeedInventory[],
  feedTypes: FeedType[],
  batches: Batch[],
  format: 'excel' | 'pdf'
): void => {
  // Generate consumption report
  const consumptionData = feedConsumption.map(feed => {
    const feedType = feedTypes.find(f => f.id === feed.feedTypeId);
    const batch = batches.find(b => b.id === feed.batchId);
    return {
      date: formatDate(feed.date),
      batchName: batch ? batch.name : 'Unknown',
      feedName: feedType ? feedType.name : 'Unknown',
      quantity: feed.quantityKg,
      timeOfDay: feed.timeOfDay,
      notes: feed.notes || '-'
    };
  });
  
  // Generate inventory report
  const inventoryData = feedInventory.map(inv => {
    const feedType = feedTypes.find(f => f.id === inv.feedTypeId);
    return {
      date: formatDate(inv.date),
      feedName: feedType ? feedType.name : 'Unknown',
      quantity: inv.quantityKg,
      source: inv.isProduced ? 'Farm-produced' : 'Purchased',
      notes: inv.notes || '-'
    };
  });
  
  // Generate feed types report
  const feedTypesData = feedTypes.map(type => ({
    name: type.name,
    description: type.description || '-',
    birdType: type.birdType
  }));
  
  if (format === 'excel') {
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.json_to_sheet(consumptionData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Feed Consumption');
    
    const ws2 = XLSX.utils.json_to_sheet(inventoryData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Feed Inventory');
    
    const ws3 = XLSX.utils.json_to_sheet(feedTypesData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Feed Types');
    
    // Generate file name and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    XLSX.writeFile(wb, `lusoi_feed_management_report_${currentDate}.xlsx`);
  } else {
    // For PDF, create separate reports
    const consumptionColumns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Batch', dataKey: 'batchName' },
      { header: 'Feed Type', dataKey: 'feedName' },
      { header: 'Quantity (kg)', dataKey: 'quantity' },
      { header: 'Time of Day', dataKey: 'timeOfDay' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    const inventoryColumns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Feed Type', dataKey: 'feedName' },
      { header: 'Quantity (kg)', dataKey: 'quantity' },
      { header: 'Source', dataKey: 'source' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    const feedTypeColumns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Bird Type', dataKey: 'birdType' }
    ];
    
    // Create PDF with multiple tables
    const doc = new jsPDF();
    let y = 20;
    
    // Title
    doc.setFontSize(18);
    doc.text('Lusoi Farm - Feed Management Report', 14, y);
    y += 10;
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, y);
    y += 15;
    
    // Feed Types table
    doc.setFontSize(14);
    doc.text('Feed Types', 14, y);
    y += 10;
    
    // Fix: Convert String to string primitive
    doc.autoTable({
      head: [feedTypeColumns.map(col => col.header)],
      body: feedTypesData.map(row => {
        return feedTypeColumns.map(col => String(row[col.dataKey as keyof typeof row]));
      }),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }
    
    // Consumption table
    doc.setFontSize(14);
    doc.text('Feed Consumption', 14, y);
    y += 10;
    
    // Fix: Convert String to string primitive
    doc.autoTable({
      head: [consumptionColumns.map(col => col.header)],
      body: consumptionData.map(row => {
        return consumptionColumns.map(col => String(row[col.dataKey as keyof typeof row]));
      }),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    
    // Inventory table
    doc.setFontSize(14);
    doc.text('Feed Inventory', 14, y);
    y += 10;
    
    // Fix: Convert String to string primitive
    doc.autoTable({
      head: [inventoryColumns.map(col => col.header)],
      body: inventoryData.map(row => {
        return inventoryColumns.map(col => String(row[col.dataKey as keyof typeof row]));
      }),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    // Generate file name and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    doc.save(`lusoi_feed_management_report_${currentDate}.pdf`);
  }
};


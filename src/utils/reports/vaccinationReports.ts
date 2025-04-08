
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Batch, VaccinationRecord, Vaccine } from '@/types';
import { formatDate } from './shared';
import { format } from 'date-fns';

export const generateVaccinationReport = (
  vaccinationRecords: VaccinationRecord[],
  vaccines: Vaccine[],
  batches: Batch[],
  format: 'excel' | 'pdf'
): void => {
  // Process vaccination records
  const recordsData = vaccinationRecords.map(record => {
    const vaccine = vaccines.find(v => v.id === record.vaccineId);
    const batch = batches.find(b => b.id === record.batchId);
    return {
      date: formatDate(record.date),
      batchName: batch ? batch.name : 'Unknown',
      vaccineName: vaccine ? vaccine.name : 'Unknown',
      nextDueDate: record.nextScheduledDate ? formatDate(record.nextScheduledDate) : '-',
      notes: record.notes || '-'
    };
  });
  
  // Process vaccines catalog
  const vaccinesData = vaccines.map(vaccine => ({
    name: vaccine.name,
    description: vaccine.description || '-',
    intervalDays: vaccine.intervalDays || '-'
  }));
  
  // Process upcoming vaccinations
  const today = new Date();
  const upcomingVaccinations = vaccinationRecords
    .filter(record => record.nextScheduledDate && new Date(record.nextScheduledDate) > today)
    .map(record => {
      const vaccine = vaccines.find(v => v.id === record.vaccineId);
      const batch = batches.find(b => b.id === record.batchId);
      return {
        dueDate: formatDate(record.nextScheduledDate || ''),
        batchName: batch ? batch.name : 'Unknown',
        vaccineName: vaccine ? vaccine.name : 'Unknown',
        previousDate: formatDate(record.date),
        notes: record.notes || '-'
      };
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  if (format === 'excel') {
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.json_to_sheet(recordsData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Vaccination Records');
    
    const ws2 = XLSX.utils.json_to_sheet(vaccinesData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Vaccines');
    
    const ws3 = XLSX.utils.json_to_sheet(upcomingVaccinations);
    XLSX.utils.book_append_sheet(wb, ws3, 'Upcoming Vaccinations');
    
    // Generate file name and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    XLSX.writeFile(wb, `lusoi_vaccination_report_${currentDate}.xlsx`);
  } else {
    const recordsColumns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Batch', dataKey: 'batchName' },
      { header: 'Vaccine', dataKey: 'vaccineName' },
      { header: 'Next Due Date', dataKey: 'nextDueDate' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    const vaccinesColumns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Interval (Days)', dataKey: 'intervalDays' }
    ];
    
    const upcomingColumns = [
      { header: 'Due Date', dataKey: 'dueDate' },
      { header: 'Batch', dataKey: 'batchName' },
      { header: 'Vaccine', dataKey: 'vaccineName' },
      { header: 'Previous Date', dataKey: 'previousDate' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    // Create PDF with multiple tables
    const doc = new jsPDF();
    let y = 20;
    
    // Title
    doc.setFontSize(18);
    doc.text('Lusoi Farm - Vaccination Report', 14, y);
    y += 10;
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, y);
    y += 15;
    
    // Vaccination Records table
    doc.setFontSize(14);
    doc.text('Vaccination Records', 14, y);
    y += 10;
    
    doc.autoTable({
      head: [recordsColumns.map(col => col.header)],
      body: recordsData.map(row => {
        return recordsColumns.map(col => row[col.dataKey as keyof typeof row]);
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
    
    // Vaccines table
    doc.setFontSize(14);
    doc.text('Vaccines Catalog', 14, y);
    y += 10;
    
    doc.autoTable({
      head: [vaccinesColumns.map(col => col.header)],
      body: vaccinesData.map(row => {
        return vaccinesColumns.map(col => row[col.dataKey as keyof typeof row]);
      }),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page for upcoming vaccinations
    if (y > 220 || upcomingVaccinations.length > 5) {
      doc.addPage();
      y = 20;
    }
    
    // Upcoming Vaccinations table
    doc.setFontSize(14);
    doc.text('Upcoming Vaccinations', 14, y);
    y += 10;
    
    doc.autoTable({
      head: [upcomingColumns.map(col => col.header)],
      body: upcomingVaccinations.map(row => {
        return upcomingColumns.map(col => row[col.dataKey as keyof typeof row]);
      }),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    // Generate file name and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    doc.save(`lusoi_vaccination_report_${currentDate}.pdf`);
  }
};

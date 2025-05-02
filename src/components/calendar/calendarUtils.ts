
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { CalendarEvent } from './types';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

// Generate monthly report data
export const generateMonthlyReportData = (date: Date, events: CalendarEvent[]) => {
  // Get all days in the current month
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };
  
  // Prepare report data
  return monthDays.map(day => {
    const dayEvents = getEventsForDay(day);
    
    const eggCollectionEvents = dayEvents.filter(event => event.type === 'egg-collection');
    const feedEvents = dayEvents.filter(event => event.type === 'feed');
    const vaccinationEvents = dayEvents.filter(event => event.type === 'vaccination');
    const saleEvents = dayEvents.filter(event => event.type === 'sale');
    
    return {
      date: format(day, 'yyyy-MM-dd'),
      eggCollections: eggCollectionEvents.length,
      eggDetails: eggCollectionEvents.map(e => e.detail).join('; '),
      feedEvents: feedEvents.length,
      feedDetails: feedEvents.map(e => e.detail).join('; '),
      vaccinationEvents: vaccinationEvents.length,
      vaccinationDetails: vaccinationEvents.map(e => e.detail).join('; '),
      salesEvents: saleEvents.length,
      salesDetails: saleEvents.map(e => e.detail).join('; '),
    };
  }).filter(day => 
    day.eggCollections > 0 || 
    day.feedEvents > 0 || 
    day.vaccinationEvents > 0 || 
    day.salesEvents > 0
  );
};

// Export to Excel
export const exportToExcel = (date: Date, events: CalendarEvent[]) => {
  try {
    const data = generateMonthlyReportData(date, events);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Calendar');
    
    // Generate file name with current month
    const fileName = `calendar_report_${format(date, 'yyyy-MM')}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
    toast.success('Calendar report exported to Excel successfully');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    toast.error('Failed to export calendar report');
  }
};

// Export to PDF
export const exportToPDF = (date: Date, events: CalendarEvent[]) => {
  try {
    const data = generateMonthlyReportData(date, events);
    
    // Initialize PDF
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Calendar Report - ${format(date, 'MMMM yyyy')}`, 14, 22);
    
    // Add generation date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 30);
    
    // Define columns for the table
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Egg Collections', dataKey: 'eggDetails' },
      { header: 'Feed Events', dataKey: 'feedDetails' },
      { header: 'Vaccinations', dataKey: 'vaccinationDetails' },
      { header: 'Sales', dataKey: 'salesDetails' }
    ];
    
    // Create table rows
    const rows = data.map(day => [
      format(new Date(day.date), 'MMM dd, yyyy'),
      day.eggDetails || '-',
      day.feedDetails || '-',
      day.vaccinationDetails || '-',
      day.salesDetails || '-'
    ]);
    
    // Add the table to PDF
    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: rows,
      startY: 40,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [60, 108, 64] } // Lusoi green color
    });
    
    // Save the PDF
    const fileName = `calendar_report_${format(date, 'yyyy-MM')}.pdf`;
    doc.save(fileName);
    
    toast.success('Calendar report exported to PDF successfully');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    toast.error('Failed to export calendar report');
  }
};

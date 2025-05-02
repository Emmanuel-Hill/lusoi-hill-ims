
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { getFileName } from '../../utils/reportUtils/formatHelpers';
import * as XLSX from 'xlsx';
import { CalendarEvent } from './types';

// Calendar utilities can go here
// PDF generation for Calendar events
export const generateCalendarPdf = (events: any[], title: string): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30);
  
  // Create table columns
  const columns = ['Title', 'Date', 'Duration', 'Type', 'Notes'];
  
  // Format data for table
  const data = events.map(event => [
    event.title || '-',
    event.date ? format(new Date(event.date), 'yyyy-MM-dd') : '-',
    event.duration || '-',
    event.type || '-',
    event.notes || '-'
  ]);
  
  // Create table - fix: use (doc as any).autoTable instead of doc.autoTable
  (doc as any).autoTable({
    head: [columns],
    body: data,
    startY: 40,
    styles: { overflow: 'linebreak' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });
  
  // Save the PDF
  doc.save(getFileName('calendar-events', 'pdf'));
};

// Export to Excel functionality
export const exportToExcel = (date: Date, events: CalendarEvent[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(
    events.map(event => ({
      Title: event.title,
      Date: format(new Date(event.date), 'yyyy-MM-dd'),
      Type: event.type,
      Duration: event.duration || '-',
      Notes: event.notes || '-'
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Calendar Events');
  
  // Save the Excel file
  XLSX.writeFile(workbook, getFileName('calendar-events', 'xlsx'));
};

// Export to PDF functionality
export const exportToPDF = (date: Date, events: CalendarEvent[]): void => {
  generateCalendarPdf(events, `Calendar Events - ${format(date, 'MMMM yyyy')}`);
};


import { format, parseISO, isValid } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CalendarEvent } from './types';

// Format date for display in calendar
export const formatCalendarDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Group events by date for list view
export const groupEventsByDate = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
  return events.reduce((acc, event) => {
    // Convert Date object to string format
    const date = format(new Date(event.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);
};

// Get dates for a month
export const getDatesForMonth = (year: number, month: number): Date[] => {
  const dates: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }
  
  return dates;
};

// Export calendar events to PDF
export const exportCalendarToPdf = (events: CalendarEvent[], month: string): void => {
  const doc = new jsPDF();
  
  // Set up document title
  doc.setFontSize(18);
  doc.text(`Farm Calendar - ${month}`, 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, 14, 30);
  
  // Group events by type for the report
  const eventsByType = events.reduce((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    
    acc[event.type].push([
      format(new Date(event.date), 'MMM d, yyyy'),
      event.title,
      event.detail || '',  // Use detail instead of description
    ]);
    
    return acc;
  }, {} as Record<string, any[][]>);
  
  let yPosition = 40;
  
  // Create a section for each event type
  Object.entries(eventsByType).forEach(([eventType, eventData], index) => {
    // Add a new page if we're going to exceed page height
    if (index > 0 && yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add section title
    doc.setFontSize(14);
    const typeTitle = eventType.charAt(0).toUpperCase() + eventType.slice(1);
    doc.text(`${typeTitle} Events`, 14, yPosition);
    
    // Add table of events
    (doc as any).autoTable({
      startY: yPosition + 10,
      head: [['Date', 'Event', 'Details']],
      body: eventData,
      theme: 'grid',
      headStyles: { fillColor: [66, 133, 244], textColor: 255 },
      styles: { overflow: 'linebreak' },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  });
  
  // Save the PDF
  doc.save(`farm-calendar-${month.toLowerCase().replace(' ', '-')}.pdf`);
};

// Get color for event type
export const getEventColor = (eventType: string): string => {
  switch (eventType.toLowerCase()) {
    case 'egg':
    case 'egg-collection':
      return 'bg-green-200 border-green-500';
    case 'feed':
      return 'bg-yellow-200 border-yellow-500';
    case 'vaccination':
      return 'bg-blue-200 border-blue-500';
    case 'sale':
      return 'bg-purple-200 border-purple-500';
    case 'meeting':
      return 'bg-gray-200 border-gray-500';
    case 'task':
      return 'bg-red-200 border-red-500';
    default:
      return 'bg-gray-200 border-gray-500';
  }
};

// Export calendar events to Excel
export const exportToExcel = (date: Date, events: CalendarEvent[]): void => {
  // Filter events for the current month if needed
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });
  
  // Prepare data for Excel
  const excelData = monthEvents.map(event => ({
    Date: format(new Date(event.date), 'yyyy-MM-dd'),
    Type: event.title,
    Details: event.detail || '',
  }));
  
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Calendar Events');
  
  // Save the Excel file
  XLSX.writeFile(wb, `farm-calendar-${format(date, 'yyyy-MM')}.xlsx`);
};

// Export calendar events to PDF
export const exportToPDF = (date: Date, events: CalendarEvent[]): void => {
  // Filter events for the current month
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });
  
  // Export to PDF using the existing function
  exportCalendarToPdf(monthEvents, format(date, 'MMMM yyyy'));
};

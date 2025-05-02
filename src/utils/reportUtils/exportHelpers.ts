
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { getFileName } from './formatHelpers';

// Generic download function for Excel files
export const downloadExcelFile = (data: any[], fileName: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, getFileName(fileName, 'xlsx'));
};

// Generic download function for PDF files
export const downloadPdfFile = (
  data: any[],
  columns: string[],
  title: string,
  fileName: string
): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30);
  
  // Create table
  autoTable(doc, {
    head: [columns],
    body: data.map(item => columns.map(col => item[col] || '-')),
    startY: 40,
    styles: { overflow: 'linebreak' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });
  
  // Save the PDF
  doc.save(getFileName(fileName, 'pdf'));
};

// Create multi-section PDF report
export const createMultiSectionPdfReport = (
  sections: Array<{
    title: string;
    columns: string[];
    data: any[];
  }>,
  mainTitle: string,
  fileName: string
): void => {
  const doc = new jsPDF();
  
  // Main title
  doc.setFontSize(18);
  doc.text(mainTitle, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30);
  
  let yPos = 40;
  
  // Add each section
  sections.forEach((section, index) => {
    // Check if we need a new page
    if (index > 0 && yPos > 180) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text(section.title, 14, yPos);
    
    autoTable(doc, {
      head: [section.columns],
      body: section.data.map(item => section.columns.map(col => item[col] || '-')),
      startY: yPos + 10,
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 20;
  });
  
  // Save the PDF
  doc.save(getFileName(fileName, 'pdf'));
};

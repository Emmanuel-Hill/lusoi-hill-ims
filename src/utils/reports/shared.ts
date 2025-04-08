
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

// Define types for the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Helper function to format date
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};

// Generic function to export data to Excel
export const exportToExcel = <T extends Record<string, any>>(
  data: T[], 
  sheetName: string,
  fileName: string
): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate file name with current date
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const fullFileName = `${fileName}_${currentDate}.xlsx`;
  
  // Write file and trigger download
  XLSX.writeFile(workbook, fullFileName);
};

// Generic function to export data to PDF
export const exportToPDF = <T extends Record<string, any>>(
  data: T[],
  title: string,
  fileName: string,
  columns: { header: string; dataKey: string }[]
): void => {
  // Initialize PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 30);
  
  // Create table data
  const tableData = data.map(item => {
    const rowData: Record<string, any> = {};
    columns.forEach(col => {
      // Handle nested properties using dot notation (e.g., "batch.name")
      if (col.dataKey.includes('.')) {
        const props = col.dataKey.split('.');
        let value = item;
        for (const prop of props) {
          value = value?.[prop];
          if (value === undefined) break;
        }
        rowData[col.dataKey] = value !== undefined ? value : '-';
      } else {
        rowData[col.dataKey] = item[col.dataKey] !== undefined ? item[col.dataKey] : '-';
      }
    });
    return rowData;
  });
  
  // Define table headers
  const headers = columns.map(col => col.header);
  
  // Create table rows
  const rows = tableData.map(row => 
    columns.map(col => {
      let value = row[col.dataKey];
      
      // Format dates if the value looks like a date string
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return formatDate(value);
      }
      
      return value;
    })
  );
  
  // Add the table to the PDF
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [60, 108, 64] }, // Lusoi green color
  });
  
  // Generate file name with current date
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const fullFileName = `${fileName}_${currentDate}.pdf`;
  
  // Save the PDF
  doc.save(fullFileName);
};

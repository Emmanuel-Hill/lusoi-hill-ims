
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Batch, EggCollection, FeedConsumption, FeedInventory, FeedType, VaccinationRecord, Vaccine, Sale, Product, Customer } from '@/types';
import { format } from 'date-fns';

// Define types for the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Helper function to format date
const formatDate = (dateString: string): string => {
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

// Specific report generators for each category
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
  
  if (format === 'excel') {
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.json_to_sheet(consumptionData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Feed Consumption');
    
    const ws2 = XLSX.utils.json_to_sheet(inventoryData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Feed Inventory');
    
    const ws3 = XLSX.utils.json_to_sheet(feedTypes);
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
    
    // Consumption table
    doc.setFontSize(14);
    doc.text('Feed Consumption', 14, y);
    y += 10;
    
    doc.autoTable({
      head: [consumptionColumns.map(col => col.header)],
      body: consumptionData.map(row => consumptionColumns.map(col => row[col.dataKey as keyof typeof row])),
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
    
    doc.autoTable({
      head: [inventoryColumns.map(col => col.header)],
      body: inventoryData.map(row => inventoryColumns.map(col => row[col.dataKey as keyof typeof row])),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    // Generate file name and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    doc.save(`lusoi_feed_management_report_${currentDate}.pdf`);
  }
};

export const generateVaccinationReport = (
  vaccinations: VaccinationRecord[],
  vaccines: Vaccine[],
  batches: Batch[],
  format: 'excel' | 'pdf'
): void => {
  const reportData = vaccinations.map(record => {
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
  
  if (format === 'excel') {
    exportToExcel(reportData, 'Vaccinations', 'lusoi_vaccination_report');
  } else {
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Batch', dataKey: 'batchName' },
      { header: 'Vaccine', dataKey: 'vaccineName' },
      { header: 'Next Due Date', dataKey: 'nextDueDate' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    exportToPDF(reportData, 'Lusoi Farm - Vaccination Report', 'lusoi_vaccination_report', columns);
  }
};

export const generateSalesReport = (
  sales: Sale[],
  products: Product[],
  customers: Customer[],
  format: 'excel' | 'pdf'
): void => {
  // Create detailed sales report with product breakdown
  const reportData = sales.map(sale => {
    const customer = customers.find(c => c.id === sale.customerId);
    
    // Calculate product details
    const productDetails = sale.products.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productName: product ? product.name : 'Unknown',
        quantity: item.quantity,
        unitPrice: item.pricePerUnit,
        subtotal: item.quantity * item.pricePerUnit
      };
    });
    
    // Create main record
    return {
      date: formatDate(sale.date),
      customerName: customer ? customer.name : 'Walk-in Customer',
      totalAmount: sale.totalAmount,
      productsSold: productDetails.map(p => `${p.quantity} x ${p.productName}`).join(', '),
      notes: sale.notes || '-',
      // Extra fields for Excel export
      productDetails: productDetails
    };
  });
  
  if (format === 'excel') {
    // For Excel, create two sheets - one with summary and one with details
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = reportData.map(({date, customerName, totalAmount, productsSold, notes}) => ({
      date, customerName, totalAmount, productsSold, notes
    }));
    const ws1 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Sales Summary');
    
    // Details sheet - flatten the data to include each product as a separate row
    const detailsData: any[] = [];
    reportData.forEach(sale => {
      sale.productDetails.forEach((product: any) => {
        detailsData.push({
          date: sale.date,
          customerName: sale.customerName,
          productName: product.productName,
          quantity: product.quantity,
          unitPrice: product.unitPrice,
          subtotal: product.subtotal
        });
      });
    });
    const ws2 = XLSX.utils.json_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Sales Details');
    
    // Generate filename and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    XLSX.writeFile(wb, `lusoi_sales_report_${currentDate}.xlsx`);
  } else {
    // For PDF
    const doc = new jsPDF();
    let y = 20;
    
    // Title
    doc.setFontSize(18);
    doc.text('Lusoi Farm - Sales Report', 14, y);
    y += 10;
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, y);
    y += 15;
    
    // Summary Table
    const summaryColumns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Customer', dataKey: 'customerName' },
      { header: 'Total Amount', dataKey: 'totalAmount' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    doc.setFontSize(14);
    doc.text('Sales Summary', 14, y);
    y += 10;
    
    const summaryData = reportData.map(({date, customerName, totalAmount, notes}) => ({
      date, customerName, totalAmount: `$${totalAmount.toFixed(2)}`, notes
    }));
    
    doc.autoTable({
      head: [summaryColumns.map(col => col.header)],
      body: summaryData.map(row => summaryColumns.map(col => row[col.dataKey as keyof typeof row])),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page for product details
    if (y > 200) {
      doc.addPage();
      y = 20;
    }
    
    // Product Details
    doc.setFontSize(14);
    doc.text('Product Sales Details', 14, y);
    y += 10;
    
    // Flatten product details
    const detailsData: any[] = [];
    reportData.forEach(sale => {
      sale.productDetails.forEach((product: any) => {
        detailsData.push({
          date: sale.date,
          customerName: sale.customerName,
          productName: product.productName,
          quantity: product.quantity,
          unitPrice: `$${product.unitPrice.toFixed(2)}`,
          subtotal: `$${product.subtotal.toFixed(2)}`
        });
      });
    });
    
    const detailsColumns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Customer', dataKey: 'customerName' },
      { header: 'Product', dataKey: 'productName' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'Unit Price', dataKey: 'unitPrice' },
      { header: 'Subtotal', dataKey: 'subtotal' }
    ];
    
    doc.autoTable({
      head: [detailsColumns.map(col => col.header)],
      body: detailsData.map(row => detailsColumns.map(col => row[col.dataKey])),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    // Generate filename and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    doc.save(`lusoi_sales_report_${currentDate}.pdf`);
  }
};

export const generateCustomerReport = (
  customers: Customer[],
  sales: Sale[],
  format: 'excel' | 'pdf'
): void => {
  // Calculate total sales for each customer
  const customerSales = customers.map(customer => {
    const customerTransactions = sales.filter(sale => sale.customerId === customer.id);
    const totalPurchases = customerTransactions.length;
    const totalSpent = customerTransactions.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const lastPurchaseDate = customerTransactions.length > 0
      ? formatDate(customerTransactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime())[0].date)
      : 'No purchases';
    
    return {
      name: customer.name,
      contactNumber: customer.contactNumber || '-',
      address: customer.address || '-',
      totalPurchases,
      totalSpent: totalSpent.toFixed(2),
      lastPurchaseDate,
      notes: customer.notes || '-'
    };
  });
  
  if (format === 'excel') {
    exportToExcel(customerSales, 'Customers', 'lusoi_customer_report');
  } else {
    const columns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Contact Number', dataKey: 'contactNumber' },
      { header: 'Address', dataKey: 'address' },
      { header: 'Total Purchases', dataKey: 'totalPurchases' },
      { header: 'Total Spent ($)', dataKey: 'totalSpent' },
      { header: 'Last Purchase Date', dataKey: 'lastPurchaseDate' },
      { header: 'Notes', dataKey: 'notes' }
    ];
    
    exportToPDF(customerSales, 'Lusoi Farm - Customer Report', 'lusoi_customer_report', columns);
  }
};

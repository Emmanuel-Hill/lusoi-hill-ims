
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper function to format date
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};

// Helper for filename generation with timestamp
const getFileName = (base: string, extension: string): string => {
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${base}_${timestamp}.${extension}`;
};

// Generic download function for Excel files
const downloadExcelFile = (data: any[], fileName: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, getFileName(fileName, 'xlsx'));
};

// Generic download function for PDF files
const downloadPdfFile = (
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

// Batch Reports
export const generateBatchReport = (batches: any[], fileType: 'excel' | 'pdf'): void => {
  if (!batches || batches.length === 0) {
    alert('No batch data to generate report');
    return;
  }

  const reportData = batches.map(batch => ({
    Name: batch.name,
    'Bird Count': batch.birdCount,
    Status: batch.batchStatus,
    'Created At': formatDate(batch.createdAt),
    Notes: batch.notes || '-'
  }));

  if (fileType === 'excel') {
    downloadExcelFile(reportData, 'batches_report');
  } else {
    const columns = ['Name', 'Bird Count', 'Status', 'Created At', 'Notes'];
    downloadPdfFile(reportData, columns, 'Batches Report', 'batches_report');
  }
};

// Egg Collection Reports
export const generateEggCollectionReport = (
  eggCollections: any[], 
  batches: any[], 
  fileType: 'excel' | 'pdf'
): void => {
  if (!eggCollections || eggCollections.length === 0) {
    alert('No egg collection data to generate report');
    return;
  }

  const getBatchName = (batchId: string): string => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  const reportData = eggCollections.map(collection => ({
    Date: formatDate(collection.date),
    Batch: getBatchName(collection.batchId),
    'Whole Eggs': collection.wholeCount,
    'Broken Eggs': collection.brokenCount,
    'Total Eggs': collection.wholeCount + collection.brokenCount,
    Notes: collection.notes || '-'
  }));

  if (fileType === 'excel') {
    downloadExcelFile(reportData, 'egg_collection_report');
  } else {
    const columns = ['Date', 'Batch', 'Whole Eggs', 'Broken Eggs', 'Total Eggs', 'Notes'];
    downloadPdfFile(reportData, columns, 'Egg Collection Report', 'egg_collection_report');
  }
};

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
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Feed Management Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30);
    
    let yPos = 40;
    
    // Consumption table
    if (consumptionData.length > 0) {
      doc.setFontSize(14);
      doc.text('Feed Consumption Records', 14, yPos);
      
      const consumptionColumns = ['Date', 'Feed Type', 'Batch', 'Quantity (kg)', 'Time of Day', 'Notes'];
      
      autoTable(doc, {
        head: [consumptionColumns],
        body: consumptionData.map(item => consumptionColumns.map(col => item[col] || '-')),
        startY: yPos + 10,
        styles: { overflow: 'linebreak' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Inventory table
    if (inventoryData.length > 0) {
      // Check if we need a new page
      if (yPos > 180) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Feed Inventory Records', 14, yPos);
      
      const inventoryColumns = ['Date', 'Feed Type', 'Quantity (kg)', 'Transaction Type', 'Notes'];
      
      autoTable(doc, {
        head: [inventoryColumns],
        body: inventoryData.map(item => inventoryColumns.map(col => item[col] || '-')),
        startY: yPos + 10,
        styles: { overflow: 'linebreak' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });
    }
    
    // Save the PDF
    doc.save(getFileName('feed_management_report', 'pdf'));
  }
};

// Vaccination Reports
export const generateVaccinationReport = (
  vaccinationRecords: any[],
  vaccines: any[],
  batches: any[],
  fileType: 'excel' | 'pdf'
): void => {
  if (!vaccinationRecords || vaccinationRecords.length === 0) {
    alert('No vaccination data to generate report');
    return;
  }

  const getVaccineName = (vaccineId: string): string => {
    const vaccine = vaccines.find(v => v.id === vaccineId);
    return vaccine ? vaccine.name : 'Unknown Vaccine';
  };

  const getBatchName = (batchId: string): string => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  const reportData = vaccinationRecords.map(record => ({
    Date: formatDate(record.date),
    Batch: getBatchName(record.batchId),
    Vaccine: getVaccineName(record.vaccineId),
    'Next Due Date': record.nextScheduledDate ? formatDate(record.nextScheduledDate) : '-',
    Notes: record.notes || '-'
  }));

  if (fileType === 'excel') {
    downloadExcelFile(reportData, 'vaccination_report');
  } else {
    const columns = ['Date', 'Batch', 'Vaccine', 'Next Due Date', 'Notes'];
    downloadPdfFile(reportData, columns, 'Vaccination Report', 'vaccination_report');
  }
};

// Sales Reports
export const generateSalesReport = (
  sales: any[],
  products: any[],
  customers: any[],
  fileType: 'excel' | 'pdf'
): void => {
  if (!sales || sales.length === 0) {
    alert('No sales data to generate report');
    return;
  }

  const getProductName = (productId: string): string => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getCustomerName = (customerId: string): string => {
    if (!customerId || customerId === 'walkin') return 'Walk-in Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const reportData = sales.map(sale => ({
    Date: formatDate(sale.date),
    Customer: getCustomerName(sale.customerId),
    'Total Amount': `$${sale.totalAmount.toFixed(2)}`,
    'Products Count': sale.products.length,
    Notes: sale.notes || '-'
  }));

  // Create detailed sales data with products
  const detailedData: any[] = [];
  sales.forEach(sale => {
    sale.products.forEach((product: any) => {
      detailedData.push({
        Date: formatDate(sale.date),
        Customer: getCustomerName(sale.customerId),
        Product: getProductName(product.productId),
        Quantity: product.quantity,
        'Unit Price': `$${product.pricePerUnit.toFixed(2)}`,
        'Total': `$${(product.quantity * product.pricePerUnit).toFixed(2)}`
      });
    });
  });

  if (fileType === 'excel') {
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summarySheet = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Sales Summary');
    
    // Details sheet
    const detailsSheet = XLSX.utils.json_to_sheet(detailedData);
    XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Sales Details');
    
    XLSX.writeFile(workbook, getFileName('sales_report', 'xlsx'));
  } else {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30);
    
    // Summary table
    const summaryColumns = ['Date', 'Customer', 'Total Amount', 'Products Count', 'Notes'];
    autoTable(doc, {
      head: [summaryColumns],
      body: reportData.map(item => summaryColumns.map(col => item[col] || '-')),
      startY: 40,
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
    
    // Add a new page for details
    doc.addPage();
    
    // Details title
    doc.setFontSize(14);
    doc.text('Sales Details', 14, 20);
    
    // Details table
    const detailColumns = ['Date', 'Customer', 'Product', 'Quantity', 'Unit Price', 'Total'];
    autoTable(doc, {
      head: [detailColumns],
      body: detailedData.map(item => detailColumns.map(col => item[col] || '-')),
      startY: 30,
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
    
    // Save the PDF
    doc.save(getFileName('sales_report', 'pdf'));
  }
};

// Customer Reports
export const generateCustomerReport = (
  customers: any[],
  sales: any[],
  orders: any[],
  fileType: 'excel' | 'pdf'
): void => {
  if (!customers || customers.length === 0) {
    alert('No customer data to generate report');
    return;
  }

  // Basic customer information
  const customerData = customers.map(customer => {
    // Calculate customer stats
    const customerSales = sales.filter(sale => sale.customerId === customer.id);
    const totalSpent = customerSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const orderCount = customerSales.length;
    
    return {
      Name: customer.name,
      Contact: customer.contactNumber || '-',
      Address: customer.address || '-',
      'Total Orders': orderCount,
      'Total Spent': `$${totalSpent.toFixed(2)}`,
      Notes: customer.notes || '-'
    };
  });

  if (fileType === 'excel') {
    downloadExcelFile(customerData, 'customers_report');
  } else {
    const columns = ['Name', 'Contact', 'Address', 'Total Orders', 'Total Spent', 'Notes'];
    downloadPdfFile(customerData, columns, 'Customer Report', 'customers_report');
  }
};

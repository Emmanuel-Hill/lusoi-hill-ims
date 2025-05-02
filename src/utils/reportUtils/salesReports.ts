
import * as XLSX from 'xlsx';
import { getFileName } from './formatHelpers';
import { createMultiSectionPdfReport } from './exportHelpers';
import { formatDate } from './formatHelpers';

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
    // Create multi-section PDF
    const sections = [
      {
        title: 'Sales Summary',
        columns: ['Date', 'Customer', 'Total Amount', 'Products Count', 'Notes'],
        data: reportData
      },
      {
        title: 'Sales Details',
        columns: ['Date', 'Customer', 'Product', 'Quantity', 'Unit Price', 'Total'],
        data: detailedData
      }
    ];
    
    createMultiSectionPdfReport(sections, 'Sales Report', 'sales_report');
  }
};

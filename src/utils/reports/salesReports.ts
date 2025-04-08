
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Sale, Product, Customer } from '@/types';
import { formatDate } from './shared';
import { format } from 'date-fns';

export const generateSalesReport = (
  sales: Sale[],
  products: Product[],
  customers: Customer[],
  format: 'excel' | 'pdf'
): void => {
  // Create detailed sales report with product breakdown
  const salesData = sales.map(sale => {
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
  
  // Create products catalog data
  const productsData = products.map(product => ({
    name: product.name,
    type: product.type,
    condition: product.condition || 'N/A',
    price: product.currentPrice,
    lastUpdated: formatDate(product.priceUpdatedAt)
  }));
  
  if (format === 'excel') {
    // For Excel, create three sheets - sales summary, details, and products catalog
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = salesData.map(({date, customerName, totalAmount, productsSold, notes}) => ({
      date, customerName, totalAmount, productsSold, notes
    }));
    const ws1 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Sales Summary');
    
    // Details sheet - flatten the data to include each product as a separate row
    const detailsData: any[] = [];
    salesData.forEach(sale => {
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
    
    // Products catalog sheet
    const ws3 = XLSX.utils.json_to_sheet(productsData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Products Catalog');
    
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
    
    // Products Catalog Table
    const productsColumns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Type', dataKey: 'type' },
      { header: 'Condition', dataKey: 'condition' },
      { header: 'Price ($)', dataKey: 'price' },
      { header: 'Last Updated', dataKey: 'lastUpdated' }
    ];
    
    doc.setFontSize(14);
    doc.text('Products Catalog', 14, y);
    y += 10;
    
    // Fix: Convert String to string primitive
    doc.autoTable({
      head: [productsColumns.map(col => col.header)],
      body: productsData.map(row => {
        return productsColumns.map(col => String(row[col.dataKey as keyof typeof row]));
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
    
    const summaryData = salesData.map(({date, customerName, totalAmount, notes}) => ({
      date, customerName, totalAmount: `$${totalAmount.toFixed(2)}`, notes
    }));
    
    // Fix: Convert String to string primitive
    doc.autoTable({
      head: [summaryColumns.map(col => col.header)],
      body: summaryData.map(row => {
        return summaryColumns.map(col => String(row[col.dataKey as keyof typeof row]));
      }),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    doc.addPage();
    y = 20;
    
    // Product Details
    doc.setFontSize(14);
    doc.text('Product Sales Details', 14, y);
    y += 10;
    
    // Flatten product details
    const detailsData: any[] = [];
    salesData.forEach(sale => {
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
    
    // Fix: Convert String to string primitive
    doc.autoTable({
      head: [detailsColumns.map(col => col.header)],
      body: detailsData.map(row => {
        return detailsColumns.map(col => String(row[col.dataKey]));
      }),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    // Generate filename and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    doc.save(`lusoi_sales_report_${currentDate}.pdf`);
  }
};


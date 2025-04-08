
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Customer, Sale, Order } from '@/types';
import { formatDate } from './shared';
import { format } from 'date-fns';

export const generateCustomerReport = (
  customers: Customer[],
  sales: Sale[],
  orders: Order[],
  format: 'excel' | 'pdf'
): void => {
  // Calculate total sales for each customer
  const customerData = customers.map(customer => {
    const customerTransactions = sales.filter(sale => sale.customerId === customer.id);
    const customerOrders = orders.filter(order => order.customerId === customer.id);
    const totalPurchases = customerTransactions.length;
    const totalSpent = customerTransactions.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const pendingOrders = customerOrders.filter(order => order.status === 'Pending' || order.status === 'Processing').length;
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
      pendingOrders,
      lastPurchaseDate,
      notes: customer.notes || '-'
    };
  });
  
  // Prepare orders data
  const ordersData = orders.map(order => {
    const customer = customers.find(c => c.id === order.customerId);
    return {
      date: formatDate(order.date),
      deliveryDate: formatDate(order.deliveryDate),
      customerName: customer ? customer.name : 'Unknown',
      location: order.deliveryLocation,
      contactPerson: order.contactPerson,
      contactNumber: order.contactNumber || '-',
      products: order.products.length,
      status: order.status,
      notes: order.notes || '-'
    };
  });
  
  if (format === 'excel') {
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.json_to_sheet(customerData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Customers');
    
    const ws2 = XLSX.utils.json_to_sheet(ordersData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Orders');
    
    // Generate filename and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    XLSX.writeFile(wb, `lusoi_customer_report_${currentDate}.xlsx`);
  } else {
    const customerColumns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Contact Number', dataKey: 'contactNumber' },
      { header: 'Address', dataKey: 'address' },
      { header: 'Total Purchases', dataKey: 'totalPurchases' },
      { header: 'Total Spent ($)', dataKey: 'totalSpent' },
      { header: 'Pending Orders', dataKey: 'pendingOrders' },
      { header: 'Last Purchase Date', dataKey: 'lastPurchaseDate' }
    ];
    
    const orderColumns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Delivery Date', dataKey: 'deliveryDate' },
      { header: 'Customer', dataKey: 'customerName' },
      { header: 'Location', dataKey: 'location' },
      { header: 'Contact Person', dataKey: 'contactPerson' },
      { header: 'Status', dataKey: 'status' }
    ];
    
    // Create PDF with multiple tables
    const doc = new jsPDF();
    let y = 20;
    
    // Title
    doc.setFontSize(18);
    doc.text('Lusoi Farm - Customer Report', 14, y);
    y += 10;
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, y);
    y += 15;
    
    // Customers table
    doc.setFontSize(14);
    doc.text('Customers', 14, y);
    y += 10;
    
    // Fix: Convert String to string primitive
    doc.autoTable({
      head: [customerColumns.map(col => col.header)],
      body: customerData.map(row => {
        return customerColumns.map(col => String(row[col.dataKey as keyof typeof row]));
      }),
      startY: y,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    // Check if we need a new page
    doc.addPage();
    y = 20;
    
    // Orders table
    doc.setFontSize(14);
    doc.text('Orders', 14, y);
    y += 10;
    
    // Fix: Convert String to string primitive
    doc.autoTable({
      head: [orderColumns.map(col => col.header)],
      body: ordersData.map(row => {
        return orderColumns.map(col => String(row[col.dataKey as keyof typeof row]));
      }),
      startY: y,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [60, 108, 64] }
    });
    
    // Generate filename and save
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    doc.save(`lusoi_customer_report_${currentDate}.pdf`);
  }
};


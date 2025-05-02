
import { downloadExcelFile, downloadPdfFile } from './exportHelpers';

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

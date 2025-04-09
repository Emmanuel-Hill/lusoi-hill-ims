
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sale, Product, Customer } from '@/types';

interface SalesListProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
}

const SalesList = ({ sales, products, customers }: SalesListProps) => {
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return 'Walk-in Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.length > 0 ? (
          sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.date}</TableCell>
              <TableCell>{getCustomerName(sale.customerId)}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 max-h-20 overflow-y-auto">
                  {sale.products.map((item) => (
                    <div key={item.productId} className="text-xs">
                      {getProductName(item.productId)} x {item.quantity}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
              <TableCell className="max-w-[200px] truncate">{sale.notes || '-'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
              No sales recorded yet. Start by recording a sale.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SalesList;


import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { Order, Customer, Product } from '@/types';

interface OrdersListProps {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  onEditOrder: (order: Order) => void;
}

const OrdersList = ({ orders, customers, products, onEditOrder }: OrdersListProps) => {
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getProductsText = (order: Order) => {
    if (order.products.length === 0) return 'No products';
    
    // Get product names for first few items
    const productNames = order.products
      .slice(0, 2)
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        return product ? `${product.name} (x${item.quantity})` : 'Unknown';
      });
    
    // Add "and X more" if there are more items
    if (order.products.length > 2) {
      productNames.push(`and ${order.products.length - 2} more`);
    }
    
    return productNames.join(', ');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Delivery Date</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{getCustomerName(order.customerId)}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {getProductsText(order)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    order.status === 'Delivered' ? 'success' : 
                    order.status === 'Processing' ? 'default' :
                    order.status === 'Pending' ? 'secondary' : 'destructive'
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditOrder(order)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              No orders found. Start by creating a new order.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OrdersList;

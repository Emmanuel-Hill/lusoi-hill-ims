
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
import { Trash2 } from 'lucide-react';
import { Product, OrderItem } from '@/types';

interface OrderItemsListProps {
  items: OrderItem[];
  products: Product[];
  onRemove: (productId: string) => void;
}

const OrderItemsList = ({ items, products, onRemove }: OrderItemsListProps) => {
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  // Add product price lookup
  const getProductPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.currentPrice : 0;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const unitPrice = getProductPrice(item.productId);
          const total = unitPrice * item.quantity;
          
          return (
            <TableRow key={item.productId}>
              <TableCell>{getProductName(item.productId)}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right">${unitPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">${total.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.productId)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OrderItemsList;

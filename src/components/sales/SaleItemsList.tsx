
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
import { Product } from '@/types';

interface SaleItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

interface SaleItemsListProps {
  items: SaleItem[];
  products: Product[];
  onRemove: (productId: string) => void;
}

const SaleItemsList = ({ items, products, onRemove }: SaleItemsListProps) => {
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Total</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.productId}>
            <TableCell>{getProductName(item.productId)}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>${item.pricePerUnit.toFixed(2)}</TableCell>
            <TableCell>${(item.quantity * item.pricePerUnit).toFixed(2)}</TableCell>
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
        ))}
      </TableBody>
    </Table>
  );
};

export default SaleItemsList;

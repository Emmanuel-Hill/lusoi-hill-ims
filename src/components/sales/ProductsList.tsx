
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
import { Product } from '@/types';
import { Tag } from 'lucide-react';
import { formatCurrency } from '@/utils/currencyUtils';

interface ProductsListProps {
  products: Product[];
  onEditPrice: (product: Product) => void;
}

const ProductsList = ({ products, onEditPrice }: ProductsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.type}</Badge>
              </TableCell>
              <TableCell>
                {product.condition === 'NA' ? '-' : product.condition}
              </TableCell>
              <TableCell>{formatCurrency(product.currentPrice)}</TableCell>
              <TableCell>{product.priceUpdatedAt}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditPrice(product)}
                >
                  <Tag className="h-4 w-4 mr-1" />
                  Update Price
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              No products added yet. Start by adding a product.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ProductsList;

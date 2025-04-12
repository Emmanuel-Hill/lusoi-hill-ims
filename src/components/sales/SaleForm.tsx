
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DialogFooter,
} from '@/components/ui/dialog';
import { Product, Customer } from '@/types';
import SaleItemsList from './SaleItemsList';
import { formatCurrency } from '@/utils/currencyUtils';

interface SaleFormProps {
  saleForm: {
    date: string;
    customerId: string;
    products: { productId: string; quantity: number; pricePerUnit: number }[];
    totalAmount: number;
    notes: string;
  };
  saleProduct: {
    productId: string;
    quantity: number;
  };
  products: Product[];
  customers: Customer[];
  onSaleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCustomerChange: (customerId: string) => void;
  onProductSelect: (productId: string) => void;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddToSale: () => void;
  onRemoveProduct: (productId: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({
  saleForm,
  saleProduct,
  products,
  customers,
  onSaleFormChange,
  onCustomerChange,
  onProductSelect,
  onQuantityChange,
  onAddToSale,
  onRemoveProduct,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={saleForm.date}
          onChange={onSaleFormChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerId" className="text-right">
          Customer
        </Label>
        <Select onValueChange={onCustomerChange}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select customer (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="walkin">Walk-in Customer</SelectItem>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-md p-3">
        <h4 className="font-medium mb-2">Add Products to Sale</h4>
        <div className="flex items-end gap-2 mb-4">
          <div className="flex-grow">
            <Label htmlFor="productId" className="mb-1 block">
              Product
            </Label>
            <Select onValueChange={onProductSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({formatCurrency(product.currentPrice)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-24">
            <Label htmlFor="quantity" className="mb-1 block">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={saleProduct.quantity}
              onChange={onQuantityChange}
            />
          </div>
          <Button onClick={onAddToSale}>
            Add
          </Button>
        </div>
        
        {saleForm.products.length > 0 ? (
          <div>
            <h4 className="font-medium mb-2">Sale Items</h4>
            <SaleItemsList
              items={saleForm.products}
              products={products}
              onRemove={onRemoveProduct}
            />
            <div className="flex justify-end mt-2">
              <Badge className="text-lg py-1 px-3">
                Total: {formatCurrency(saleForm.totalAmount)}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-muted-foreground">
            No products added to this sale yet.
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={saleForm.notes}
          onChange={onSaleFormChange}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={saleForm.products.length === 0}>
          Record Sale
        </Button>
      </DialogFooter>
    </div>
  );
};

export default SaleForm;

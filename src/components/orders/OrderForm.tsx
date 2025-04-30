
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Customer, Product, OrderItem } from '@/types';
import OrderItemsList from './OrderItemsList';

interface OrderFormProps {
  orderForm: {
    customerId: string;
    date: string;
    deliveryDate: string;
    deliveryLocation: string;
    contactPerson: string;
    contactNumber: string;
    products: OrderItem[];
    notes: string;
    status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  };
  orderItem: {
    productId: string;
    quantity: number;
  };
  customers: Customer[];
  products: Product[];
  onOrderFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCustomerChange: (customerId: string) => void;
  onStatusChange: (status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled') => void;
  onProductSelect: (productId: string) => void;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddToOrder: () => void;
  onRemoveProduct: (productId: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  orderForm,
  orderItem,
  customers,
  products,
  onOrderFormChange,
  onCustomerChange,
  onStatusChange,
  onProductSelect,
  onQuantityChange,
  onAddToOrder,
  onRemoveProduct,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerId" className="text-right">
          Customer
        </Label>
        <Select value={orderForm.customerId} onValueChange={onCustomerChange}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Order Date
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={orderForm.date}
          onChange={onOrderFormChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="deliveryDate" className="text-right">
          Delivery Date
        </Label>
        <Input
          id="deliveryDate"
          name="deliveryDate"
          type="date"
          value={orderForm.deliveryDate}
          onChange={onOrderFormChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="deliveryLocation" className="text-right">
          Delivery Location
        </Label>
        <Input
          id="deliveryLocation"
          name="deliveryLocation"
          value={orderForm.deliveryLocation}
          onChange={onOrderFormChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contactPerson" className="text-right">
          Contact Person
        </Label>
        <Input
          id="contactPerson"
          name="contactPerson"
          value={orderForm.contactPerson}
          onChange={onOrderFormChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contactNumber" className="text-right">
          Contact Number
        </Label>
        <Input
          id="contactNumber"
          name="contactNumber"
          value={orderForm.contactNumber}
          onChange={onOrderFormChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select value={orderForm.status} onValueChange={(value) => onStatusChange(value as any)}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-md p-3">
        <h4 className="font-medium mb-2">Add Products to Order</h4>
        <div className="flex items-end gap-2 mb-4">
          <div className="flex-grow">
            <Label htmlFor="productId" className="mb-1 block">
              Product
            </Label>
            <Select value={orderItem.productId} onValueChange={onProductSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
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
              value={orderItem.quantity}
              onChange={onQuantityChange}
            />
          </div>
          <Button onClick={onAddToOrder}>
            Add
          </Button>
        </div>
        
        {orderForm.products.length > 0 ? (
          <div>
            <h4 className="font-medium mb-2">Order Items</h4>
            <OrderItemsList
              items={orderForm.products}
              products={products}
              onRemove={onRemoveProduct}
            />
          </div>
        ) : (
          <div className="text-center py-2 text-muted-foreground">
            No products added to this order yet.
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
          value={orderForm.notes}
          onChange={onOrderFormChange}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!orderForm.customerId || orderForm.products.length === 0}>
          Create Order
        </Button>
      </DialogFooter>
    </div>
  );
};

export default OrderForm;

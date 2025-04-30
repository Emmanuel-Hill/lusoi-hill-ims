
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Order } from '@/types';

interface EditOrderStatusFormProps {
  order: Order;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  onStatusChange: (status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled') => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const EditOrderStatusForm: React.FC<EditOrderStatusFormProps> = ({
  order,
  status,
  onStatusChange,
  onSubmit,
  onCancel
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogDescription>
          Change the status of this order.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="mb-4">
          <p><strong>Order ID:</strong> {order.id.substring(0, 8)}...</p>
          <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
          <p><strong>Current Status:</strong> {order.status}</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              New Status
            </Label>
            <Select value={status} onValueChange={(value) => onStatusChange(value as any)}>
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
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          Update Status
        </Button>
      </DialogFooter>
    </>
  );
};

export default EditOrderStatusForm;

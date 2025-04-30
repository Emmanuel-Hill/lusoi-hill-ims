
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Order } from '@/types';

interface OrdersDialogProps {
  orders: Order[];
  onClose: () => void;
}

const OrdersDialog = ({ orders, onClose }: OrdersDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Customer Orders</DialogTitle>
        <DialogDescription>
          View all orders for this customer
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
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
                  <TableCell>{order.products.length} items</TableCell>
                  <TableCell>{order.deliveryLocation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-8 text-muted-foreground">No orders found for this customer</p>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default OrdersDialog;

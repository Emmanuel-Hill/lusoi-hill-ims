
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import OrdersList from '@/components/orders/OrdersList';
import OrderForm from '@/components/orders/OrderForm';
import EditOrderStatusForm from '@/components/orders/EditOrderStatusForm';
import { Order, OrderItem } from '@/types';

const Orders = () => {
  const { customers, products, orders, addOrder, updateOrderStatus } = useAppContext();
  
  // Dialog states
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false);
  
  // Form state
  const [orderForm, setOrderForm] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    deliveryLocation: '',
    contactPerson: '',
    contactNumber: '',
    products: [] as OrderItem[],
    notes: '',
    status: 'Pending' as 'Pending' | 'Processing' | 'Delivered' | 'Cancelled',
  });
  
  // Selected order for editing status
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<'Pending' | 'Processing' | 'Delivered' | 'Cancelled'>('Processing');
  
  // Temporary state for adding products to an order
  const [orderItem, setOrderItem] = useState({
    productId: '',
    quantity: 1,
  });

  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value,
    });
  };

  const handleAddToOrder = () => {
    if (!orderItem.productId || orderItem.quantity <= 0) {
      toast.error('Please select a product and enter a valid quantity');
      return;
    }

    // Check if product already exists in the order
    const existingItemIndex = orderForm.products.findIndex(p => p.productId === orderItem.productId);

    if (existingItemIndex >= 0) {
      // Update existing product
      const updatedProducts = [...orderForm.products];
      updatedProducts[existingItemIndex].quantity += orderItem.quantity;
      
      setOrderForm({
        ...orderForm,
        products: updatedProducts,
      });
    } else {
      // Add new product
      setOrderForm({
        ...orderForm,
        products: [...orderForm.products, { ...orderItem }],
      });
    }

    // Reset order item form
    setOrderItem({
      productId: '',
      quantity: 1,
    });
  };

  const removeProductFromOrder = (productId: string) => {
    setOrderForm({
      ...orderForm,
      products: orderForm.products.filter(p => p.productId !== productId),
    });
  };

  const handleCreateOrder = () => {
    if (!orderForm.customerId) {
      toast.error('Please select a customer');
      return;
    }

    if (orderForm.products.length === 0) {
      toast.error('Please add at least one product to the order');
      return;
    }

    // Find customer for auto-filling contact details if not provided
    if (!orderForm.deliveryLocation || !orderForm.contactPerson) {
      const customer = customers.find(c => c.id === orderForm.customerId);
      if (customer) {
        if (!orderForm.deliveryLocation) {
          orderForm.deliveryLocation = customer.address || '';
        }
        if (!orderForm.contactPerson) {
          orderForm.contactPerson = customer.name;
        }
        if (!orderForm.contactNumber) {
          orderForm.contactNumber = customer.contactNumber || '';
        }
      }
    }

    addOrder({
      id: crypto.randomUUID(),
      ...orderForm,
    });

    // Reset the form
    setOrderForm({
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryLocation: '',
      contactPerson: '',
      contactNumber: '',
      products: [],
      notes: '',
      status: 'Pending',
    });

    setIsAddOrderDialogOpen(false);
    toast.success('Order created successfully');
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setIsEditStatusDialogOpen(true);
  };

  const handleUpdateOrderStatus = () => {
    if (!selectedOrder) return;

    updateOrderStatus(selectedOrder.id, editStatus);
    setIsEditStatusDialogOpen(false);
    toast.success('Order status updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <Dialog open={isAddOrderDialogOpen} onOpenChange={setIsAddOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <OrderForm
              orderForm={orderForm}
              orderItem={orderItem}
              customers={customers}
              products={products}
              onOrderFormChange={handleOrderFormChange}
              onCustomerChange={(customerId) => setOrderForm({ ...orderForm, customerId })}
              onStatusChange={(status) => setOrderForm({ ...orderForm, status })}
              onProductSelect={(productId) => setOrderItem({ ...orderItem, productId })}
              onQuantityChange={(e) => setOrderItem({ ...orderItem, quantity: parseInt(e.target.value) || 0 })}
              onAddToOrder={handleAddToOrder}
              onRemoveProduct={removeProductFromOrder}
              onSubmit={handleCreateOrder}
              onCancel={() => setIsAddOrderDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersList
            orders={orders}
            customers={customers}
            products={products}
            onEditOrder={handleEditOrder}
          />
        </CardContent>
      </Card>

      {/* Edit Order Status Dialog */}
      {selectedOrder && (
        <Dialog open={isEditStatusDialogOpen} onOpenChange={setIsEditStatusDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <EditOrderStatusForm
              order={selectedOrder}
              status={editStatus}
              onStatusChange={setEditStatus}
              onSubmit={handleUpdateOrderStatus}
              onCancel={() => setIsEditStatusDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Orders;

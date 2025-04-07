
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Phone,
  MapPin,
  FileText,
  User,
  CalendarCheck,
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const statusColorMap = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Processing': 'bg-blue-100 text-blue-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

const statusIconMap = {
  'Pending': Clock,
  'Processing': ShoppingCart,
  'Delivered': CheckCircle,
  'Cancelled': X
};

const Customers = () => {
  const { 
    customers, addCustomer, 
    products,
    orders, addOrder, updateOrderStatus 
  } = useAppContext();
  
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  
  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    name: '',
    contactNumber: '',
    address: '',
    notes: ''
  });
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryLocation: '',
    contactPerson: '',
    contactNumber: '',
    products: [] as { productId: string; quantity: number }[],
    status: 'Pending' as 'Pending' | 'Processing' | 'Delivered' | 'Cancelled',
    notes: ''
  });
  
  // Order product state (temporary for adding products)
  const [orderProduct, setOrderProduct] = useState({
    productId: '',
    quantity: 1
  });
  
  // State for updating order status
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    orderId: '',
    status: 'Pending' as 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'
  });
  
  // Handle customer form changes
  const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerForm({
      ...customerForm,
      [name]: value
    });
  };
  
  // Handle order form changes
  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value
    });
  };
  
  // Handle adding a customer
  const handleAddCustomer = () => {
    if (!customerForm.name) {
      toast.error('Please enter a customer name');
      return;
    }
    
    addCustomer(customerForm);
    setCustomerForm({
      name: '',
      contactNumber: '',
      address: '',
      notes: ''
    });
    setIsCustomerDialogOpen(false);
    toast.success('Customer added successfully');
  };
  
  // Handle customer selection for order
  const handleSelectCustomer = (customerId: string) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setOrderForm({
        ...orderForm,
        customerId,
        contactPerson: selectedCustomer.name,
        contactNumber: selectedCustomer.contactNumber || '',
        deliveryLocation: selectedCustomer.address || ''
      });
    }
  };
  
  // Handle adding product to order
  const handleAddProductToOrder = () => {
    if (!orderProduct.productId || orderProduct.quantity <= 0) {
      toast.error('Please select a product and enter a valid quantity');
      return;
    }
    
    // Check if product is already in the order
    const existingProductIndex = orderForm.products.findIndex(
      p => p.productId === orderProduct.productId
    );
    
    if (existingProductIndex >= 0) {
      // Update existing product quantity
      const updatedProducts = [...orderForm.products];
      updatedProducts[existingProductIndex].quantity += orderProduct.quantity;
      
      setOrderForm({
        ...orderForm,
        products: updatedProducts
      });
    } else {
      // Add new product to order
      setOrderForm({
        ...orderForm,
        products: [
          ...orderForm.products,
          { ...orderProduct }
        ]
      });
    }
    
    // Reset product selection
    setOrderProduct({
      productId: '',
      quantity: 1
    });
  };
  
  // Handle removing product from order
  const handleRemoveProductFromOrder = (productId: string) => {
    setOrderForm({
      ...orderForm,
      products: orderForm.products.filter(p => p.productId !== productId)
    });
  };
  
  // Handle submitting an order
  const handleSubmitOrder = () => {
    if (!orderForm.customerId || !orderForm.deliveryDate || !orderForm.deliveryLocation || !orderForm.contactPerson || orderForm.products.length === 0) {
      toast.error('Please fill in all required fields and add at least one product');
      return;
    }
    
    addOrder(orderForm);
    setOrderForm({
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryLocation: '',
      contactPerson: '',
      contactNumber: '',
      products: [],
      status: 'Pending',
      notes: ''
    });
    setIsOrderDialogOpen(false);
    toast.success('Order added successfully');
  };
  
  // Open status update dialog
  const openStatusUpdateDialog = (order: any) => {
    setStatusUpdateForm({
      orderId: order.id,
      status: order.status
    });
    setIsUpdateStatusDialogOpen(true);
  };
  
  // Handle status update
  const handleStatusUpdate = () => {
    updateOrderStatus(statusUpdateForm.orderId, statusUpdateForm.status);
    setIsUpdateStatusDialogOpen(false);
    toast.success('Order status updated successfully');
  };
  
  // Helper functions to get names
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
      
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Create a new customer record.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={customerForm.name}
                      onChange={handleCustomerFormChange}
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
                      value={customerForm.contactNumber}
                      onChange={handleCustomerFormChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={customerForm.address}
                      onChange={handleCustomerFormChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={customerForm.notes}
                      onChange={handleCustomerFormChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCustomer}>Save Customer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>Manage your customer records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            {customer.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.contactNumber ? (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              {customer.contactNumber}
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {customer.address ? (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              {customer.address}
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {customer.notes ? (
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              {customer.notes}
                            </div>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No customers added yet. Start by adding a customer.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>
                    Create a new order for a customer.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customerId" className="text-right">
                      Customer
                    </Label>
                    <Select 
                      onValueChange={handleSelectCustomer} 
                      value={orderForm.customerId}
                    >
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
                      onChange={handleOrderFormChange}
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
                      onChange={handleOrderFormChange}
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
                      onChange={handleOrderFormChange}
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
                      onChange={handleOrderFormChange}
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
                      onChange={handleOrderFormChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  {/* Products for order */}
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-2">Add Products to Order</h4>
                    <div className="flex items-end gap-2 mb-4">
                      <div className="flex-grow">
                        <Label htmlFor="productId" className="mb-1 block">
                          Product
                        </Label>
                        <Select onValueChange={(value) => setOrderProduct({...orderProduct, productId: value})}>
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
                          value={orderProduct.quantity}
                          onChange={(e) => setOrderProduct({...orderProduct, quantity: parseInt(e.target.value) || 1})}
                        />
                      </div>
                      <Button onClick={handleAddProductToOrder}>
                        Add
                      </Button>
                    </div>
                    
                    {orderForm.products.length > 0 ? (
                      <div>
                        <h4 className="font-medium mb-2">Order Items</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderForm.products.map((item) => (
                              <TableRow key={item.productId}>
                                <TableCell>{getProductName(item.productId)}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveProductFromOrder(item.productId)}
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                      onChange={handleOrderFormChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitOrder} disabled={orderForm.products.length === 0}>
                    Create Order
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => {
                      const StatusIcon = statusIconMap[order.status];
                      return (
                        <TableRow key={order.id}>
                          <TableCell>{getCustomerName(order.customerId)}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.deliveryDate}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 max-h-20 overflow-y-auto">
                              {order.products.map((item) => (
                                <div key={item.productId} className="text-xs">
                                  {getProductName(item.productId)} x {item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Badge variant="outline" className={`flex items-center space-x-1 ${statusColorMap[order.status]}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                <span>{order.status}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openStatusUpdateDialog(order)}
                            >
                              Update Status
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No orders created yet. Start by creating an order.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Order Status Update Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of this order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) => setStatusUpdateForm({
                  ...statusUpdateForm, 
                  status: value as 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'
                })}
                defaultValue={statusUpdateForm.status}
              >
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;

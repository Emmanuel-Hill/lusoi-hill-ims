
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Calendar,
  PhoneCall,
  MapPin,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { generateCustomerReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';

const Customers = () => {
  const { customers, addCustomer, sales, orders } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    address: '',
    notes: '',
  });
  
  // Add contact dialog state
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);
  
  // Add map dialog state
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  
  // Add orders dialog state
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Please provide a name');
      return;
    }

    addCustomer({
      id: crypto.randomUUID(),
      name: formData.name,
      contactNumber: formData.contactNumber,
      address: formData.address,
      notes: formData.notes,
    });

    setFormData({
      name: '',
      contactNumber: '',
      address: '',
      notes: '',
    });

    setIsDialogOpen(false);
    toast.success('Customer added successfully');
  };
  
  // Handle contact button click
  const handleContactClick = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setCurrentCustomer(customerId);
    setIsContactDialogOpen(true);
  };
  
  // Handle map button click
  const handleMapClick = (address: string) => {
    setMapAddress(address);
    setIsMapDialogOpen(true);
  };
  
  // Handle orders button click
  const handleOrdersClick = (customerId: string) => {
    const customerOrders = orders.filter(order => order.customerId === customerId);
    setCustomerOrders(customerOrders);
    setIsOrdersDialogOpen(true);
  };
  
  // Add report generation handler
  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateCustomerReport(customers, sales, orders, format);
      toast.success(`Customers report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
        <div className="flex gap-2">
          <ReportButton 
            onExcelExport={() => handleGenerateReport('excel')} 
            onPdfExport={() => handleGenerateReport('pdf')} 
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter details for the new customer
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactNumber" className="text-right">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  Add Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customer list</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.contactNumber || '-'}</TableCell>
                    <TableCell>{customer.address || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDistanceToNow(new Date(), {
                          addSuffix: true,
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleContactClick(customer.id)}
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMapClick(customer.address || '')}
                        disabled={!customer.address}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Map
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOrdersClick(customer.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Orders
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No customers added yet. Start by adding a customer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Customer</DialogTitle>
            <DialogDescription>
              Customer contact information
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentCustomer && (
              <div className="space-y-4">
                {(() => {
                  const customer = customers.find(c => c.id === currentCustomer);
                  return customer ? (
                    <>
                      <div>
                        <h3 className="font-medium">Name</h3>
                        <p>{customer.name}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p>{customer.contactNumber || 'Not provided'}</p>
                        {customer.contactNumber && (
                          <Button 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => window.open(`tel:${customer.contactNumber}`)}
                          >
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">Notes</h3>
                        <p>{customer.notes || 'No notes'}</p>
                      </div>
                    </>
                  ) : (
                    <p>Customer not found</p>
                  );
                })()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Map Dialog */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Location</DialogTitle>
            <DialogDescription>
              {mapAddress || 'No address provided'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {mapAddress ? (
              <div className="space-y-4">
                <div className="bg-muted aspect-video rounded-md flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p>{mapAddress}</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(mapAddress)}`, '_blank')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No address available for this customer</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMapDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Orders Dialog */}
      <Dialog open={isOrdersDialogOpen} onOpenChange={setIsOrdersDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Customer Orders</DialogTitle>
            <DialogDescription>
              View all orders for this customer
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {customerOrders.length > 0 ? (
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
                  {customerOrders.map((order) => (
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
            <Button variant="outline" onClick={() => setIsOrdersDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;

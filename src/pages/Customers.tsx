
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
import { generateCustomerReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';
import CustomerList from '@/components/customers/CustomerList';
import CustomerForm from '@/components/customers/CustomerForm';
import ContactDialog from '@/components/customers/ContactDialog';
import MapDialog from '@/components/customers/MapDialog';
import OrdersDialog from '@/components/customers/OrdersDialog';
import { Customer } from '@/types';

const Customers = () => {
  const { customers, addCustomer, orders } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    address: '',
    notes: '',
  });
  
  // Dialog states
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  
  // Selected data
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(null);
  const [mapAddress, setMapAddress] = useState('');
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  // Get current customer
  const currentCustomer = currentCustomerId 
    ? customers.find(c => c.id === currentCustomerId) || null 
    : null;

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
    setCurrentCustomerId(customerId);
    setIsContactDialogOpen(true);
  };
  
  // Handle map button click
  const handleMapClick = (address: string) => {
    setMapAddress(address);
    setIsMapDialogOpen(true);
  };
  
  // Handle orders button click
  const handleOrdersClick = (customerId: string) => {
    const filteredOrders = orders.filter(order => order.customerId === customerId);
    setCustomerOrders(filteredOrders);
    setIsOrdersDialogOpen(true);
  };
  
  // Add report generation handler
  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateCustomerReport(customers, [], orders, format);
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
              <CustomerForm 
                formData={formData} 
                onInputChange={handleInputChange} 
                onSubmit={handleSubmit} 
                onCancel={() => setIsDialogOpen(false)}
              />
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
          <CustomerList 
            customers={customers} 
            onContactClick={handleContactClick} 
            onMapClick={handleMapClick} 
            onOrdersClick={handleOrdersClick}
          />
        </CardContent>
      </Card>
      
      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <ContactDialog 
          customer={currentCustomer} 
          onClose={() => setIsContactDialogOpen(false)} 
        />
      </Dialog>
      
      {/* Map Dialog */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <MapDialog 
          address={mapAddress} 
          onClose={() => setIsMapDialogOpen(false)} 
        />
      </Dialog>
      
      {/* Orders Dialog */}
      <Dialog open={isOrdersDialogOpen} onOpenChange={setIsOrdersDialogOpen}>
        <OrdersDialog 
          orders={customerOrders} 
          onClose={() => setIsOrdersDialogOpen(false)} 
        />
      </Dialog>
    </div>
  );
};

export default Customers;

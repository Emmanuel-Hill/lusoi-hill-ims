
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
import { Customer } from '@/types';
import { Calendar, MapPin, PhoneCall, ShoppingCart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CustomerListProps {
  customers: Customer[];
  onContactClick: (customerId: string) => void;
  onMapClick: (address: string) => void;
  onOrdersClick: (customerId: string) => void;
}

const CustomerList = ({ customers, onContactClick, onMapClick, onOrdersClick }: CustomerListProps) => {
  return (
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
                  onClick={() => onContactClick(customer.id)}
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onMapClick(customer.address || '')}
                  disabled={!customer.address}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Map
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onOrdersClick(customer.id)}
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
  );
};

export default CustomerList;

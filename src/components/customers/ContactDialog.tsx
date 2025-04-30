
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';
import { Customer } from '@/types';

interface ContactDialogProps {
  customer: Customer | null;
  onClose: () => void;
}

const ContactDialog = ({ customer, onClose }: ContactDialogProps) => {
  if (!customer) return null;
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Contact Customer</DialogTitle>
        <DialogDescription>
          Customer contact information
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="space-y-4">
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
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ContactDialog;

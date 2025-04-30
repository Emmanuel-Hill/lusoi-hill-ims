
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface MapDialogProps {
  address: string;
  onClose: () => void;
}

const MapDialog = ({ address, onClose }: MapDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Customer Location</DialogTitle>
        <DialogDescription>
          {address || 'No address provided'}
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {address ? (
          <div className="space-y-4">
            <div className="bg-muted aspect-video rounded-md flex items-center justify-center">
              <div className="text-center p-4">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>{address}</p>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank')}
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
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default MapDialog;

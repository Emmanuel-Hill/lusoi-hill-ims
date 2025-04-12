
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  DialogFooter,
} from '@/components/ui/dialog';
import { Batch } from '@/types';

interface BatchDetailsProps {
  batch: Batch | null;
  onClose: () => void;
  getBadgeColor: (status: string) => string;
}

const BatchDetails: React.FC<BatchDetailsProps> = ({ batch, onClose, getBadgeColor }) => {
  if (!batch) return null;
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <div className="col-span-3">{batch.name}</div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="birdCount" className="text-right">Bird Count</Label>
        <div className="col-span-3">{batch.birdCount}</div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <div className="col-span-3">
          <Badge className={getBadgeColor(batch.batchStatus)}>
            {batch.batchStatus}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="createdAt" className="text-right">Created At</Label>
        <div className="col-span-3">{batch.createdAt}</div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="notes" className="text-right">Notes</Label>
        <div className="col-span-3">{batch.notes || '-'}</div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );
};

export default BatchDetails;

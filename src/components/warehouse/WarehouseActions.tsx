
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface WarehouseActionsProps {
  onAddItem?: () => void;
  onRecordReceived?: () => void;
  onRecordDispatched?: () => void;
}

const WarehouseActions: React.FC<WarehouseActionsProps> = ({
  onAddItem,
  onRecordReceived,
  onRecordDispatched
}) => {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new item to your warehouse inventory
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            Item form will be implemented here.
          </div>
          <div className="flex justify-end">
            <Button onClick={onAddItem}>Add Item</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehouseActions;

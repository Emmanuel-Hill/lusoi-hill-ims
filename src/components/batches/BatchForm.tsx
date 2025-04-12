
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DialogFooter,
} from '@/components/ui/dialog';

interface BatchFormProps {
  formData: {
    name: string;
    birdCount: number;
    batchStatus: 'New' | 'Laying' | 'Not Laying' | 'Retired';
    notes: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onStatusChange: (value: 'New' | 'Laying' | 'Not Laying' | 'Retired') => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonText?: string;
}

const BatchForm: React.FC<BatchFormProps> = ({
  formData,
  onInputChange,
  onStatusChange,
  onSubmit,
  onCancel,
  submitButtonText = 'Add Batch'
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="birdCount" className="text-right">Bird Count</Label>
        <Input
          id="birdCount"
          name="birdCount"
          type="number"
          value={formData.birdCount}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select
          value={formData.batchStatus}
          onValueChange={(value) => onStatusChange(value as 'New' | 'Laying' | 'Not Laying' | 'Retired')}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Laying">Laying</SelectItem>
            <SelectItem value="Not Laying">Not Laying</SelectItem>
            <SelectItem value="Retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {submitButtonText}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default BatchForm;

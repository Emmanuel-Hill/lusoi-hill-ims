
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Batch } from '@/types';

interface BatchProductFormProps {
  batchProductForm: {
    batchId: string;
    name: string;
    currentPrice: number;
  };
  retiredBatches: Batch[];
  onBatchSelect: (batchId: string) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const BatchProductForm: React.FC<BatchProductFormProps> = ({
  batchProductForm,
  retiredBatches,
  onBatchSelect,
  onPriceChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="batch" className="text-right">
          Batch
        </Label>
        <Select onValueChange={onBatchSelect}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select retired batch" />
          </SelectTrigger>
          <SelectContent>
            {retiredBatches.length > 0 ? (
              retiredBatches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name} ({batch.birdCount} birds)
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>No retired batches available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="batchProductName" className="text-right">
          Product Name
        </Label>
        <Input
          id="batchProductName"
          value={batchProductForm.name}
          readOnly
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="batchProductPrice" className="text-right">
          Price (KES)
        </Label>
        <Input
          id="batchProductPrice"
          type="number"
          step="0.01"
          min="0"
          value={batchProductForm.currentPrice}
          onChange={onPriceChange}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={!batchProductForm.batchId || batchProductForm.currentPrice <= 0}
        >
          Add to Products
        </Button>
      </DialogFooter>
    </div>
  );
};

export default BatchProductForm;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DialogFooter,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/utils/currencyUtils';

interface PriceUpdateFormProps {
  newPrice: number;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const PriceUpdateForm: React.FC<PriceUpdateFormProps> = ({
  newPrice,
  onPriceChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="newPrice" className="text-right">
          New Price (KES)
        </Label>
        <Input
          id="newPrice"
          type="number"
          step="0.01"
          min="0"
          value={newPrice}
          onChange={onPriceChange}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Update Price</Button>
      </DialogFooter>
    </div>
  );
};

export default PriceUpdateForm;

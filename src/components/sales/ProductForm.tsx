
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

interface ProductFormProps {
  productForm: {
    name: string;
    type: 'Egg' | 'Bird';
    condition: 'Whole' | 'Broken' | 'NA';
    currentPrice: number;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (value: 'Egg' | 'Bird') => void;
  onConditionChange: (value: 'Whole' | 'Broken' | 'NA') => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productForm,
  onInputChange,
  onTypeChange,
  onConditionChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={productForm.name}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Type
        </Label>
        <Select onValueChange={(value) => onTypeChange(value as 'Egg' | 'Bird')}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Egg">Egg</SelectItem>
            <SelectItem value="Bird">Bird</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {productForm.type === 'Egg' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="condition" className="text-right">
            Condition
          </Label>
          <Select onValueChange={(value) => onConditionChange(value as 'Whole' | 'Broken' | 'NA')}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Whole">Whole</SelectItem>
              <SelectItem value="Broken">Broken</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="currentPrice" className="text-right">
          Price (KES)
        </Label>
        <Input
          id="currentPrice"
          name="currentPrice"
          type="number"
          step="0.01"
          min="0"
          value={productForm.currentPrice}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Save Product</Button>
      </DialogFooter>
    </div>
  );
};

export default ProductForm;

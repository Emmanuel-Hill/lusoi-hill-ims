
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
  Switch,
} from "@/components/ui/switch";

interface FeedInventoryFormProps {
  formData: {
    feedTypeId: string;
    date: string;
    quantityKg: number;
    isProduced: boolean;
    notes: string;
  };
  feedTypes: Array<{ id: string; name: string }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFeedTypeChange: (value: string) => void;
  onIsProducedChange: (checked: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const FeedInventoryForm = ({
  formData,
  feedTypes,
  onChange,
  onFeedTypeChange,
  onIsProducedChange,
  onSubmit,
  onCancel
}: FeedInventoryFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="feedTypeId" className="text-right">
          Feed Type
        </Label>
        <Select
          value={formData.feedTypeId}
          onValueChange={onFeedTypeChange}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select feed type" />
          </SelectTrigger>
          <SelectContent>
            {feedTypes.length > 0 ? (
              feedTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No feed types available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantityKg" className="text-right">
          Quantity (kg)
        </Label>
        <Input
          id="quantityKg"
          name="quantityKg"
          type="number"
          min="0"
          step="0.1"
          value={formData.quantityKg}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isProduced" className="text-right">
          Farm Produced
        </Label>
        <div className="flex items-center space-x-2 col-span-3">
          <Switch
            id="isProduced"
            checked={formData.isProduced}
            onCheckedChange={onIsProducedChange}
          />
          <Label htmlFor="isProduced">
            {formData.isProduced ? 'Yes' : 'No'}
          </Label>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Save Inventory</Button>
      </div>
    </div>
  );
};

export default FeedInventoryForm;

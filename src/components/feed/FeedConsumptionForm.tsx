
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

interface FeedConsumptionFormProps {
  formData: {
    feedTypeId: string;
    batchId: string;
    date: string;
    quantityKg: number;
    timeOfDay: string;
    notes: string;
  };
  feedTypes: Array<{ id: string; name: string }>;
  batches: Array<{ id: string; name: string; birdCount: number }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFeedTypeChange: (value: string) => void;
  onBatchChange: (value: string) => void;
  onTimeOfDayChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const FeedConsumptionForm = ({
  formData,
  feedTypes,
  batches,
  onChange,
  onFeedTypeChange,
  onBatchChange,
  onTimeOfDayChange,
  onSubmit,
  onCancel
}: FeedConsumptionFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="batch" className="text-right">
          Batch
        </Label>
        <Select onValueChange={onBatchChange}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.length > 0 ? (
              batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name} ({batch.birdCount} birds)
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No batches available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="feedType" className="text-right">
          Feed Type
        </Label>
        <Select onValueChange={onFeedTypeChange}>
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
        <Label htmlFor="timeOfDay" className="text-right">
          Time of Day
        </Label>
        <Select onValueChange={onTimeOfDayChange}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Morning">Morning</SelectItem>
            <SelectItem value="Afternoon">Afternoon</SelectItem>
            <SelectItem value="Evening">Evening</SelectItem>
          </SelectContent>
        </Select>
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
        <Button onClick={onSubmit}>Record Consumption</Button>
      </div>
    </div>
  );
};

export default FeedConsumptionForm;

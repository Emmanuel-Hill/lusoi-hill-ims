
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

interface FeedTypeFormProps {
  formData: {
    name: string;
    description: string;
    birdType: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBirdTypeChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const FeedTypeForm = ({ formData, onChange, onBirdTypeChange, onSubmit, onCancel }: FeedTypeFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="birdType" className="text-right">
          Bird Type
        </Label>
        <Select onValueChange={onBirdTypeChange}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select bird type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Layer">Layer</SelectItem>
            <SelectItem value="Broiler">Broiler</SelectItem>
            <SelectItem value="Chick">Chick</SelectItem>
            <SelectItem value="All">All Types</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Save Feed Type</Button>
      </div>
    </div>
  );
};

export default FeedTypeForm;

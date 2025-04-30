
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Batch } from '@/types';

interface EggCollectionFormProps {
  form: {
    batchId: string;
    date: string;
    goodEggs: number;
    brokenEggs: number;
    smallEggs: number;
    mediumEggs: number;
    largeEggs: number;
    xlEggs: number;
    notes: string;
  };
  batches: Batch[];
  date: Date | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDateSelect: (date: Date | undefined) => void;
  onBatchSelect: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const EggCollectionForm = ({
  form,
  batches,
  date,
  onInputChange,
  onDateSelect,
  onBatchSelect,
  onSubmit,
  onCancel
}: EggCollectionFormProps) => {
  return (
    <div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="batchId" className="text-right">Batch</Label>
          <div className="col-span-3">
            <Select onValueChange={onBatchSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.length > 0 ? (
                  batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No batches available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">Date</Label>
          <Input 
            id="date" 
            name="date" 
            type="date" 
            value={form.date}
            onChange={onInputChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="goodEggs" className="text-right">Good Eggs</Label>
          <Input 
            id="goodEggs" 
            name="goodEggs" 
            type="number" 
            value={form.goodEggs}
            onChange={onInputChange}
            min={0}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="brokenEggs" className="text-right">Broken Eggs</Label>
          <Input 
            id="brokenEggs" 
            name="brokenEggs" 
            type="number" 
            value={form.brokenEggs}
            onChange={onInputChange}
            min={0}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="smallEggs" className="text-right">Small Eggs</Label>
          <Input 
            id="smallEggs" 
            name="smallEggs" 
            type="number" 
            value={form.smallEggs}
            onChange={onInputChange}
            min={0}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="mediumEggs" className="text-right">Medium Eggs</Label>
          <Input 
            id="mediumEggs" 
            name="mediumEggs" 
            type="number" 
            value={form.mediumEggs}
            onChange={onInputChange}
            min={0}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="largeEggs" className="text-right">Large Eggs</Label>
          <Input 
            id="largeEggs" 
            name="largeEggs" 
            type="number" 
            value={form.largeEggs}
            onChange={onInputChange}
            min={0}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="xlEggs" className="text-right">XL Eggs</Label>
          <Input 
            id="xlEggs" 
            name="xlEggs" 
            type="number" 
            value={form.xlEggs}
            onChange={onInputChange}
            min={0}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">Notes</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            value={form.notes}
            onChange={onInputChange}
            className="col-span-3"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit}>Save</Button>
      </DialogFooter>
    </div>
  );
};

export default EggCollectionForm;

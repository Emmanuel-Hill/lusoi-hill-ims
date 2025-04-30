import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import EggCollectionList from '@/components/egg-collection/EggCollectionList';
import EggCollectionForm from '@/components/egg-collection/EggCollectionForm';
import { EggCollection } from '@/types';

const EggCollectionPage = () => {
  const { batches, eggCollections, addEggCollection } = useAppContext();

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    goodEggs: 0,
    brokenEggs: 0,
    smallEggs: 0,
    mediumEggs: 0,
    largeEggs: 0,
    xlEggs: 0,
    notes: '',
  });

  // Calendar state
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'goodEggs' || name === 'brokenEggs' || name === 'smallEggs' || 
               name === 'mediumEggs' || name === 'largeEggs' || name === 'xlEggs' 
              ? parseInt(value) || 0 
              : value,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setForm({
        ...form,
        date: date.toISOString().split('T')[0],
      });
    }
  };

  const handleSubmit = () => {
    if (!form.batchId) {
      toast.error('Please select a batch');
      return;
    }

    // Validate that at least one egg count is greater than 0
    if (
      form.goodEggs <= 0 &&
      form.brokenEggs <= 0 &&
      form.smallEggs <= 0 &&
      form.mediumEggs <= 0 &&
      form.largeEggs <= 0 &&
      form.xlEggs <= 0
    ) {
      toast.error('Please enter egg counts');
      return;
    }

    // Calculate whole and broken counts for EggCollection type compatibility
    const wholeCount = form.goodEggs + form.smallEggs + form.mediumEggs + form.largeEggs + form.xlEggs;
    const brokenCount = form.brokenEggs;

    addEggCollection({
      id: crypto.randomUUID(),
      batchId: form.batchId,
      date: form.date,
      wholeCount,
      brokenCount,
      notes: form.notes,
      smallEggs: form.smallEggs,
      mediumEggs: form.mediumEggs,
      largeEggs: form.largeEggs,
      xlEggs: form.xlEggs,
      goodEggs: form.goodEggs,
      brokenEggs: form.brokenEggs
    });
    
    setForm({
      batchId: '',
      date: new Date().toISOString().split('T')[0],
      goodEggs: 0,
      brokenEggs: 0,
      smallEggs: 0,
      mediumEggs: 0,
      largeEggs: 0,
      xlEggs: 0,
      notes: '',
    });
    
    setIsDialogOpen(false);
    toast.success('Egg collection recorded successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Egg Collection</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Egg Collection</DialogTitle>
              <DialogDescription>
                Record a new egg collection entry.
              </DialogDescription>
            </DialogHeader>
            <EggCollectionForm
              form={form}
              batches={batches}
              date={date}
              onInputChange={handleInputChange}
              onDateSelect={handleDateSelect}
              onBatchSelect={(e) => {
                // Convert the value manually to make TypeScript happy
                const syntheticEvent = {
                  target: {
                    name: "batchId",
                    value: e
                  }
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(syntheticEvent);
              }}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>Manage egg collection records</CardDescription>
        </CardHeader>
        <CardContent>
          <EggCollectionList eggCollections={eggCollections} batches={batches} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EggCollectionPage;

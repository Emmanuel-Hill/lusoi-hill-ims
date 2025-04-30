import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const EggCollection = () => {
  const { batches, eggCollections, addEggCollection } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    wholeCount: 0,
    brokenCount: 0,
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCollectionForm({
      ...collectionForm,
      [name]: name === 'wholeCount' || name === 'brokenCount' ? parseInt(value) : value,
    });
  };

  const handleAddCollection = () => {
    if (!collectionForm.batchId || collectionForm.date === '') {
      toast.error('Please select a batch and date');
      return;
    }

    addEggCollection({
      id: crypto.randomUUID(), // Add id
      batchId: collectionForm.batchId,
      date: collectionForm.date,
      wholeCount: collectionForm.wholeCount,
      brokenCount: collectionForm.brokenCount,
      notes: collectionForm.notes,
    });

    setCollectionForm({
      batchId: '',
      date: new Date().toISOString().split('T')[0],
      wholeCount: 0,
      brokenCount: 0,
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record New Egg Collection</DialogTitle>
              <DialogDescription>
                Enter details for the egg collection
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batchId" className="text-right">Batch</Label>
                <select
                  id="batchId"
                  name="batchId"
                  value={collectionForm.batchId}
                  onChange={handleInputChange}
                  className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={collectionForm.date}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wholeCount" className="text-right">Whole Eggs</Label>
                <Input
                  id="wholeCount"
                  name="wholeCount"
                  type="number"
                  value={collectionForm.wholeCount}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brokenCount" className="text-right">Broken Eggs</Label>
                <Input
                  id="brokenCount"
                  name="brokenCount"
                  type="number"
                  value={collectionForm.brokenCount}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={collectionForm.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCollection}>
                Record Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Egg Collection History</CardTitle>
          <CardDescription>View all recorded egg collections</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Whole Eggs</TableHead>
                <TableHead>Broken Eggs</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eggCollections.length > 0 ? (
                eggCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      {batches.find(batch => batch.id === collection.batchId)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>{collection.date}</TableCell>
                    <TableCell>{collection.wholeCount}</TableCell>
                    <TableCell>{collection.brokenCount}</TableCell>
                    <TableCell>{collection.notes || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No egg collections recorded yet. Start by adding a collection.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EggCollection;

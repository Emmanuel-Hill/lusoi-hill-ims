import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit,
  Trash2,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import ReportButton from '@/components/ReportButton';
import { generateBatchReport } from '@/utils/reportGenerator';

const Batches = () => {
  const { batches, addBatch, updateBatch } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [batchForm, setBatchForm] = useState({
    name: '',
    birdCount: 0,
    batchStatus: 'New' as 'New' | 'Laying' | 'Not Laying' | 'Retired',
    notes: '',
  });
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBatchForm({
      ...batchForm,
      [name]: name === 'birdCount' ? parseInt(value) : value,
    });
  };

  const handleStatusChange = (value: 'New' | 'Laying' | 'Not Laying' | 'Retired') => {
    setBatchForm({
      ...batchForm,
      batchStatus: value,
    });
  };

  const handleAddBatch = () => {
    if (!batchForm.name || batchForm.birdCount <= 0) {
      toast.error('Please provide a name and valid bird count');
      return;
    }

    addBatch({
      id: crypto.randomUUID(),
      name: batchForm.name,
      birdCount: batchForm.birdCount,
      batchStatus: batchForm.batchStatus,
      notes: batchForm.notes,
      createdAt: new Date().toISOString().split('T')[0], // Add createdAt
    });

    setBatchForm({
      name: '',
      birdCount: 0,
      batchStatus: 'New',
      notes: '',
    });

    setIsDialogOpen(false);
    toast.success('Batch added successfully');
  };

  const handleEditClick = (batch) => {
    setSelectedBatch(batch);
    setBatchForm({
      name: batch.name,
      birdCount: batch.birdCount,
      batchStatus: batch.batchStatus,
      notes: batch.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBatch = () => {
    if (!batchForm.name || batchForm.birdCount <= 0) {
      toast.error('Please provide a name and valid bird count');
      return;
    }

    if (!selectedBatch) return;

    updateBatch({
      id: selectedBatch.id,
      name: batchForm.name,
      birdCount: batchForm.birdCount,
      batchStatus: batchForm.batchStatus,
      notes: batchForm.notes,
      createdAt: selectedBatch.createdAt,
    });

    setBatchForm({
      name: '',
      birdCount: 0,
      batchStatus: 'New',
      notes: '',
    });

    setIsEditDialogOpen(false);
    setSelectedBatch(null);
    toast.success('Batch updated successfully');
  };

  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateBatchReport(batches, format);
      toast.success(`Batch report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Batch Management</h1>
        <div className="flex gap-2">
          <ReportButton 
            onExcelExport={() => handleGenerateReport('excel')} 
            onPdfExport={() => handleGenerateReport('pdf')} 
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
                <DialogDescription>
                  Create a new batch of birds
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={batchForm.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="birdCount" className="text-right">Bird Count</Label>
                  <Input
                    id="birdCount"
                    name="birdCount"
                    type="number"
                    value={batchForm.birdCount}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batchStatus" className="text-right">Batch Status</Label>
                  <select
                    id="batchStatus"
                    name="batchStatus"
                    value={batchForm.batchStatus}
                    onChange={(e) => handleStatusChange(e.target.value as 'New' | 'Laying' | 'Not Laying' | 'Retired')}
                    className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="New">New</option>
                    <option value="Laying">Laying</option>
                    <option value="Not Laying">Not Laying</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={batchForm.notes}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBatch}>
                  Add Batch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batches</CardTitle>
          <CardDescription>Manage your batches of birds</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Bird Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{batch.birdCount}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          batch.batchStatus === 'Laying' ? 'success' : 
                          batch.batchStatus === 'Not Laying' ? 'secondary' : 
                          batch.batchStatus === 'Retired' ? 'destructive' : 'default'
                        }
                      >
                        {batch.batchStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{batch.createdAt}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(batch)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No batches added yet. Start by adding a batch.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>
              Update batch details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={batchForm.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birdCount" className="text-right">Bird Count</Label>
              <Input
                id="birdCount"
                name="birdCount"
                type="number"
                value={batchForm.birdCount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batchStatus" className="text-right">Batch Status</Label>
              <select
                id="batchStatus"
                name="batchStatus"
                value={batchForm.batchStatus}
                onChange={(e) => handleStatusChange(e.target.value as 'New' | 'Laying' | 'Not Laying' | 'Retired')}
                className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="New">New</option>
                <option value="Laying">Laying</option>
                <option value="Not Laying">Not Laying</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={batchForm.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBatch}>
              Update Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Batches;

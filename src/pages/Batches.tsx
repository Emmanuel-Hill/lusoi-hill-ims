
import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Batch } from '@/types';

const BatchesPage = () => {
  const { batches, addBatch, updateBatch } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birdCount: 0,
    batchStatus: 'New' as 'New' | 'Laying' | 'Not Laying' | 'Retired',
    notes: '',
  });

  useEffect(() => {
    if (selectedBatch) {
      setFormData({
        name: selectedBatch.name,
        birdCount: selectedBatch.birdCount,
        batchStatus: selectedBatch.batchStatus,
        notes: selectedBatch.notes || '',
      });
    } else {
      setFormData({
        name: '',
        birdCount: 0,
        batchStatus: 'New',
        notes: '',
      });
    }
  }, [selectedBatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['birdCount'].includes(name) ? parseInt(value) || 0 : value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      batchStatus: value as 'New' | 'Laying' | 'Not Laying' | 'Retired',
    });
  };

  const handleAddBatch = () => {
    if (!formData.name || !formData.birdCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    addBatch(formData);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      birdCount: 0,
      batchStatus: 'New',
      notes: '',
    });
    toast.success('Batch added successfully');
  };

  const handleUpdateBatch = () => {
    if (!formData.name || !formData.birdCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedBatch) {
      updateBatch({ ...selectedBatch, ...formData });
      setIsEditDialogOpen(false);
      setSelectedBatch(null);
      setFormData({
        name: '',
        birdCount: 0,
        batchStatus: 'New',
        notes: '',
      });
      toast.success('Batch updated successfully');
    }
  };

  const handleEditClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedBatch(null);
    setFormData({
      name: '',
      birdCount: 0,
      batchStatus: 'New',
      notes: '',
    });
  };

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'Laying':
        return 'default';
      case 'New':
        return 'secondary';
      case 'Not Laying':
        return 'outline';
      case 'Retired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Batches</h1>
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
                Create a new batch of birds.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birdCount" className="text-right">
                  Bird Count
                </Label>
                <Input
                  id="birdCount"
                  name="birdCount"
                  type="number"
                  min="0"
                  value={formData.birdCount}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batchStatus" className="text-right">
                  Status
                </Label>
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Laying">Laying</SelectItem>
                    <SelectItem value="Not Laying">Not Laying</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBatch}>Add Batch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batches History</CardTitle>
          <CardDescription>Manage your batches</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Bird Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.name}</TableCell>
                    <TableCell>{batch.birdCount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(batch.batchStatus)}>
                        {batch.batchStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{batch.createdAt}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{batch.notes || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(batch)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No batches recorded. Start by adding a batch.
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
              Make changes to your batch.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birdCount" className="text-right">
                Bird Count
              </Label>
              <Input
                id="birdCount"
                name="birdCount"
                type="number"
                min="0"
                value={formData.birdCount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batchStatus" className="text-right">
                Status
              </Label>
              <Select onValueChange={handleStatusChange} defaultValue={formData.batchStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Laying">Laying</SelectItem>
                  <SelectItem value="Not Laying">Not Laying</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBatch}>Update Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchesPage;

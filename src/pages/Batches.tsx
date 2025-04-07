
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Batch } from '@/types';

const BatchesPage = () => {
  const { batches, addBatch, updateBatch } = useAppContext();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birdCount: 0,
    batchStatus: 'New',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'birdCount' ? parseInt(value) || 0 : value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      batchStatus: value as 'New' | 'Laying' | 'Not Laying' | 'Retired',
    });
  };

  const handleAddBatch = () => {
    addBatch(formData);
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      birdCount: 0,
      batchStatus: 'New',
      notes: '',
    });
    toast.success('Batch added successfully');
  };

  const handleEditBatch = () => {
    if (selectedBatch) {
      updateBatch({
        ...selectedBatch,
        ...formData,
      });
      setIsEditDialogOpen(false);
      setSelectedBatch(null);
      toast.success('Batch updated successfully');
    }
  };

  const openEditDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setFormData({
      name: batch.name,
      birdCount: batch.birdCount,
      batchStatus: batch.batchStatus,
      notes: batch.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const getBatchStatusColor = (status: Batch['batchStatus']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Laying':
        return 'bg-green-100 text-green-800';
      case 'Not Laying':
        return 'bg-yellow-100 text-yellow-800';
      case 'Retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBirds = batches.reduce((sum, batch) => sum + batch.birdCount, 0);
  const layingBirds = batches
    .filter(batch => batch.batchStatus === 'Laying')
    .reduce((sum, batch) => sum + batch.birdCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Batch Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Batch</DialogTitle>
              <DialogDescription>
                Create a new batch to track your birds.
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
                  placeholder="Batch name"
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
                  value={formData.birdCount}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={handleStatusChange}
                  defaultValue={formData.batchStatus}
                >
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBatch}>Add Batch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Batch Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Batch</DialogTitle>
              <DialogDescription>
                Update batch information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-birdCount" className="text-right">
                  Bird Count
                </Label>
                <Input
                  id="edit-birdCount"
                  name="birdCount"
                  type="number"
                  value={formData.birdCount}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={handleStatusChange}
                  defaultValue={formData.batchStatus}
                >
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
                <Label htmlFor="edit-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditBatch}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Total Birds</CardTitle>
              <CardDescription>Across all batches</CardDescription>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalBirds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Laying Birds</CardTitle>
              <CardDescription>Currently productive</CardDescription>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{layingBirds}</div>
            <div className="text-sm text-muted-foreground">
              {totalBirds > 0
                ? `${Math.round((layingBirds / totalBirds) * 100)}% of total birds`
                : '0% of total birds'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch List</CardTitle>
          <CardDescription>Manage your batches of birds</CardDescription>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{batch.birdCount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getBatchStatusColor(batch.batchStatus)}>
                        {batch.batchStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {batch.notes || '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(batch)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No batches found. Add your first batch.
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

export default BatchesPage;

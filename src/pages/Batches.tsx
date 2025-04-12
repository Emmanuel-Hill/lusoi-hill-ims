
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Info, Edit } from 'lucide-react';
import { generateBatchReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';

const Batches = () => {
  const { batches, addBatch, updateBatch } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    birdCount: 0,
    batchStatus: 'New' as 'New' | 'Laying' | 'Not Laying' | 'Retired',
    createdAt: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    birdCount: 0,
    batchStatus: 'New' as 'New' | 'Laying' | 'Not Laying' | 'Retired',
    createdAt: '',
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'birdCount' ? parseInt(value) : value
    });
  };
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'birdCount' ? parseInt(value) : value
    });
  };
  
  const handleStatusChange = (value: 'New' | 'Laying' | 'Not Laying' | 'Retired') => {
    setFormData({
      ...formData,
      batchStatus: value
    });
  };
  
  const handleEditStatusChange = (value: 'New' | 'Laying' | 'Not Laying' | 'Retired') => {
    setEditFormData({
      ...editFormData,
      batchStatus: value
    });
  };
  
  const handleSubmit = () => {
    if (!formData.name || formData.birdCount <= 0) {
      toast.error('Please provide a name and a valid bird count');
      return;
    }
    
    addBatch({
      name: formData.name,
      birdCount: formData.birdCount,
      batchStatus: formData.batchStatus,
      notes: formData.notes,
    });
    
    setFormData({
      name: '',
      birdCount: 0,
      batchStatus: 'New',
      createdAt: new Date().toISOString().split('T')[0],
      notes: ''
    });
    
    setIsDialogOpen(false);
    toast.success('Batch added successfully');
  };
  
  const handleEditSubmit = () => {
    if (!editFormData.name || editFormData.birdCount <= 0) {
      toast.error('Please provide a name and a valid bird count');
      return;
    }
    
    updateBatch({
      id: editFormData.id,
      name: editFormData.name,
      birdCount: editFormData.birdCount,
      batchStatus: editFormData.batchStatus,
      createdAt: editFormData.createdAt,
      notes: editFormData.notes,
    });
    
    setIsEditDialogOpen(false);
    toast.success('Batch updated successfully');
  };
  
  const handleEditBatch = (batch: any) => {
    setEditFormData({
      id: batch.id,
      name: batch.name,
      birdCount: batch.birdCount,
      batchStatus: batch.batchStatus,
      createdAt: batch.createdAt,
      notes: batch.notes || '',
    });
    setIsEditDialogOpen(true);
  };
  
  const handleViewDetails = (batch: any) => {
    setSelectedBatch(batch);
    setIsViewDetailsOpen(true);
  };
  
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Laying':
        return 'bg-green-100 text-green-800';
      case 'Not Laying':
        return 'bg-yellow-100 text-yellow-800';
      case 'Retired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Add report generation handler
  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateBatchReport(batches, format);
      toast.success(`Batches report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Batches Management</h1>
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
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
                <DialogDescription>
                  Enter details for the new batch of birds
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
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
                    value={formData.birdCount}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select
                    value={formData.batchStatus}
                    onValueChange={(value) => handleStatusChange(value as 'New' | 'Laying' | 'Not Laying' | 'Retired')}
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
                  <Label htmlFor="notes" className="text-right">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>{batch.birdCount}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(batch.batchStatus)}>
                      {batch.batchStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{batch.createdAt}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditBatch(batch)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(batch)}>
                      <Info className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <TableCaption>
            {batches.length} total batches
          </TableCaption>
        </CardFooter>
      </Card>
      
      {/* Edit Batch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>
              Update details for this batch
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-birdCount" className="text-right">Bird Count</Label>
              <Input
                id="edit-birdCount"
                name="birdCount"
                type="number"
                value={editFormData.birdCount}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">Status</Label>
              <Select
                value={editFormData.batchStatus}
                onValueChange={(value) => handleEditStatusChange(value as 'New' | 'Laying' | 'Not Laying' | 'Retired')}
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
              <Label htmlFor="edit-notes" className="text-right">Notes</Label>
              <Textarea
                id="edit-notes"
                name="notes"
                value={editFormData.notes}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Batch Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Batch Details</DialogTitle>
            <DialogDescription>
              Details for the selected batch
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <div className="col-span-3">{selectedBatch?.name}</div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="birdCount" className="text-right">Bird Count</Label>
              <div className="col-span-3">{selectedBatch?.birdCount}</div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <div className="col-span-3">
                <Badge className={getBadgeColor(selectedBatch?.batchStatus)}>
                  {selectedBatch?.batchStatus}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="createdAt" className="text-right">Created At</Label>
              <div className="col-span-3">{selectedBatch?.createdAt}</div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <div className="col-span-3">{selectedBatch?.notes || '-'}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Batches;

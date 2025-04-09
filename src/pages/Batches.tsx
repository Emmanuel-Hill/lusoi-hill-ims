import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Users,
  Edit,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { addDays, format, isAfter, isBefore, startOfToday } from 'date-fns';
import { generateBatchReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';

const Batches = () => {
  const { batches, addBatch, updateBatchStatus } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birdCount: 0,
    batchStatus: 'Growing' as 'Growing' | 'Laying' | 'Retired',
    createdAt: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    batchStatus: 'Growing' as 'Growing' | 'Laying' | 'Retired',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'birdCount' ? parseInt(value) || 0 : value,
    });
  };

  const handleBatchStatusChange = (value: 'Growing' | 'Laying' | 'Retired') => {
    setFormData({
      ...formData,
      batchStatus: value,
    });
  };

  const handleAddBatch = () => {
    if (!formData.name || formData.birdCount <= 0) {
      toast.error('Please enter a batch name and valid bird count');
      return;
    }

    addBatch(formData);
    setFormData({
      name: '',
      birdCount: 0,
      batchStatus: 'Growing',
      createdAt: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsDialogOpen(false);
    toast.success('Batch added successfully');
  };

  const openStatusUpdateDialog = (batchId: string) => {
    const batch = batches.find(batch => batch.id === batchId);
    if (batch) {
      setSelectedBatchId(batchId);
      setStatusUpdateForm({ batchStatus: batch.batchStatus });
      setIsStatusDialogOpen(true);
    }
  };

  const handleStatusUpdate = () => {
    if (selectedBatchId) {
      updateBatchStatus(selectedBatchId, statusUpdateForm.batchStatus);
      setIsStatusDialogOpen(false);
      toast.success('Batch status updated successfully');
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Batches</h1>
        <div className="flex items-center gap-2">
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
                    min="1"
                    value={formData.birdCount}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batchStatus" className="text-right">
                    Status
                  </Label>
                  <Select onValueChange={handleBatchStatusChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Growing">Growing</SelectItem>
                      <SelectItem value="Laying">Laying</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="createdAt" className="text-right">
                    Created At
                  </Label>
                  <Input
                    id="createdAt"
                    name="createdAt"
                    type="date"
                    value={formData.createdAt}
                    onChange={handleInputChange}
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
                <Button onClick={handleAddBatch}>Save Batch</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batches</CardTitle>
          <CardDescription>Manage your bird batches.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Bird Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{batch.birdCount}</TableCell>
                    <TableCell>{batch.batchStatus}</TableCell>
                    <TableCell>{batch.createdAt}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{batch.notes || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openStatusUpdateDialog(batch.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Status
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

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Batch Status</DialogTitle>
            <DialogDescription>
              Change the status of this batch.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={(value) => setStatusUpdateForm({ batchStatus: value as 'Growing' | 'Laying' | 'Retired' })} defaultValue={statusUpdateForm.batchStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Growing">Growing</SelectItem>
                  <SelectItem value="Laying">Laying</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Batches;

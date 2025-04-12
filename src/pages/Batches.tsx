
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TableCaption } from "@/components/ui/table";
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { generateBatchReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';
import BatchForm from '@/components/batches/BatchForm';
import BatchTable from '@/components/batches/BatchTable';
import BatchDetails from '@/components/batches/BatchDetails';
import { formatCurrency } from '@/utils/currencyUtils';

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
              <BatchForm 
                formData={formData}
                onInputChange={handleInputChange}
                onStatusChange={handleStatusChange}
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
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
          <BatchTable 
            batches={batches} 
            onEdit={handleEditBatch} 
            onViewDetails={handleViewDetails} 
          />
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
          <BatchForm 
            formData={editFormData}
            onInputChange={handleEditInputChange}
            onStatusChange={handleEditStatusChange}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditDialogOpen(false)}
            submitButtonText="Save Changes"
          />
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
          <BatchDetails 
            batch={selectedBatch}
            onClose={() => setIsViewDetailsOpen(false)}
            getBadgeColor={getBadgeColor}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Batches;

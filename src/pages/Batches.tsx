
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Batch } from '@/types';

const Batches = () => {
  const { batches, addBatch, updateBatch } = useAppContext();
  const { toast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  
  // Form state for new batch
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchCount, setNewBatchCount] = useState("");
  const [newBatchStatus, setNewBatchStatus] = useState<Batch['batchStatus']>("New");
  const [newBatchNotes, setNewBatchNotes] = useState("");

  // Form state for editing batch
  const [editBatchName, setEditBatchName] = useState("");
  const [editBatchCount, setEditBatchCount] = useState("");
  const [editBatchStatus, setEditBatchStatus] = useState<Batch['batchStatus']>("New");
  const [editBatchNotes, setEditBatchNotes] = useState("");

  const handleAddBatch = () => {
    if (!newBatchName || !newBatchCount) {
      toast({
        title: "Missing information",
        description: "Please provide a name and bird count for the batch.",
        variant: "destructive",
      });
      return;
    }

    addBatch({
      name: newBatchName,
      birdCount: Number(newBatchCount),
      batchStatus: newBatchStatus,
      notes: newBatchNotes
    });

    // Reset form
    setNewBatchName("");
    setNewBatchCount("");
    setNewBatchStatus("New");
    setNewBatchNotes("");

    toast({
      title: "Batch Added",
      description: `Batch "${newBatchName}" has been added successfully.`,
    });
  };

  const openEditModal = (batch: Batch) => {
    setCurrentBatch(batch);
    setEditBatchName(batch.name);
    setEditBatchCount(batch.birdCount.toString());
    setEditBatchStatus(batch.batchStatus);
    setEditBatchNotes(batch.notes || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateBatch = () => {
    if (!currentBatch) return;

    updateBatch({
      ...currentBatch,
      name: editBatchName,
      birdCount: Number(editBatchCount),
      batchStatus: editBatchStatus,
      notes: editBatchNotes
    });

    setIsEditModalOpen(false);
    toast({
      title: "Batch Updated",
      description: `Batch "${editBatchName}" has been updated successfully.`,
    });
  };

  const getBadgeVariant = (status: Batch['batchStatus']) => {
    switch(status) {
      case "Laying":
        return "success";
      case "Not Laying":
        return "warning";
      case "Retired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Batch Management</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Batch</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Batch</DialogTitle>
              <DialogDescription>
                Enter the details for the new batch of birds.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batch-name" className="text-right">
                  Batch Name
                </Label>
                <Input 
                  id="batch-name" 
                  value={newBatchName} 
                  onChange={(e) => setNewBatchName(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bird-count" className="text-right">
                  Bird Count
                </Label>
                <Input 
                  id="bird-count" 
                  type="number" 
                  value={newBatchCount} 
                  onChange={(e) => setNewBatchCount(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batch-status" className="text-right">
                  Status
                </Label>
                <Select value={newBatchStatus} onValueChange={(value: Batch['batchStatus']) => setNewBatchStatus(value)}>
                  <SelectTrigger id="batch-status" className="col-span-3">
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
                <Label htmlFor="batch-notes" className="text-right">
                  Notes
                </Label>
                <Textarea 
                  id="batch-notes" 
                  value={newBatchNotes} 
                  onChange={(e) => setNewBatchNotes(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddBatch}>Add Batch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{batch.name}</CardTitle>
                  <CardDescription>Created: {batch.createdAt}</CardDescription>
                </div>
                <Badge variant={getBadgeVariant(batch.batchStatus)}>{batch.batchStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bird Count:</span>
                  <span className="font-medium">{batch.birdCount}</span>
                </div>
                {batch.notes && (
                  <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="mt-1 text-sm">{batch.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => openEditModal(batch)}>
                Edit Batch
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>
              Update the details for this batch of birds.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-batch-name" className="text-right">
                Batch Name
              </Label>
              <Input 
                id="edit-batch-name" 
                value={editBatchName} 
                onChange={(e) => setEditBatchName(e.target.value)} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bird-count" className="text-right">
                Bird Count
              </Label>
              <Input 
                id="edit-bird-count" 
                type="number" 
                value={editBatchCount} 
                onChange={(e) => setEditBatchCount(e.target.value)} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-batch-status" className="text-right">
                Status
              </Label>
              <Select value={editBatchStatus} onValueChange={(value: Batch['batchStatus']) => setEditBatchStatus(value)}>
                <SelectTrigger id="edit-batch-status" className="col-span-3">
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
              <Label htmlFor="edit-batch-notes" className="text-right">
                Notes
              </Label>
              <Textarea 
                id="edit-batch-notes" 
                value={editBatchNotes} 
                onChange={(e) => setEditBatchNotes(e.target.value)} 
                className="col-span-3" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBatch}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Batches;

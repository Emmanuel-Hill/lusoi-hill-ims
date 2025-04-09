
import React, { useState } from 'react';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { generateFeedManagementReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';
import FeedTypeForm from '@/components/feed/FeedTypeForm';
import FeedInventoryForm from '@/components/feed/FeedInventoryForm';
import FeedConsumptionForm from '@/components/feed/FeedConsumptionForm';

const FeedManagement = () => {
  const { 
    feedTypes, addFeedType,
    feedInventory, addFeedInventory,
    feedConsumption, addFeedConsumption,
    batches
  } = useAppContext();
  
  // Dialog state
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] = useState(false);
  
  // Form states
  const [feedTypeForm, setFeedTypeForm] = useState({
    name: '',
    description: '',
    birdType: 'All'
  });
  
  const [inventoryForm, setInventoryForm] = useState({
    feedTypeId: '',
    date: new Date().toISOString().split('T')[0],
    quantityKg: 0,
    isProduced: false,
    notes: ''
  });
  
  const [consumptionForm, setConsumptionForm] = useState({
    feedTypeId: '',
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    quantityKg: 0,
    timeOfDay: 'Morning',
    notes: ''
  });
  
  // Form change handlers
  const handleFeedTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedTypeForm({
      ...feedTypeForm,
      [name]: value
    });
  };
  
  const handleBirdTypeChange = (value: string) => {
    setFeedTypeForm({
      ...feedTypeForm,
      birdType: value
    });
  };
  
  const handleInventoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInventoryForm({
      ...inventoryForm,
      [name]: name === 'quantityKg' ? parseFloat(value) || 0 : value
    });
  };
  
  const handleInventoryFeedTypeChange = (value: string) => {
    setInventoryForm({
      ...inventoryForm,
      feedTypeId: value
    });
  };
  
  const handleIsProducedChange = (checked: boolean) => {
    setInventoryForm({
      ...inventoryForm,
      isProduced: checked
    });
  };
  
  const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConsumptionForm({
      ...consumptionForm,
      [name]: name === 'quantityKg' ? parseFloat(value) || 0 : value
    });
  };
  
  const handleConsumptionFeedTypeChange = (value: string) => {
    setConsumptionForm({
      ...consumptionForm,
      feedTypeId: value
    });
  };
  
  const handleConsumptionBatchChange = (value: string) => {
    setConsumptionForm({
      ...consumptionForm,
      batchId: value
    });
  };
  
  const handleTimeOfDayChange = (value: string) => {
    setConsumptionForm({
      ...consumptionForm,
      timeOfDay: value
    });
  };
  
  // Submit handlers
  const handleAddFeedType = () => {
    if (!feedTypeForm.name) {
      toast.error('Please enter a feed type name');
      return;
    }
    
    addFeedType(feedTypeForm);
    setFeedTypeForm({
      name: '',
      description: '',
      birdType: 'All'
    });
    setIsTypeDialogOpen(false);
    toast.success('Feed type added successfully');
  };
  
  const handleAddFeedInventory = () => {
    if (!inventoryForm.feedTypeId) {
      toast.error('Please select a feed type');
      return;
    }
    
    if (inventoryForm.quantityKg <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    addFeedInventory(inventoryForm);
    setInventoryForm({
      feedTypeId: '',
      date: new Date().toISOString().split('T')[0],
      quantityKg: 0,
      isProduced: false,
      notes: ''
    });
    setIsInventoryDialogOpen(false);
    toast.success('Feed inventory added successfully');
  };
  
  const handleAddFeedConsumption = () => {
    if (!consumptionForm.feedTypeId || !consumptionForm.batchId) {
      toast.error('Please select both feed type and batch');
      return;
    }
    
    if (consumptionForm.quantityKg <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    addFeedConsumption(consumptionForm);
    setConsumptionForm({
      feedTypeId: '',
      batchId: '',
      date: new Date().toISOString().split('T')[0],
      quantityKg: 0,
      timeOfDay: 'Morning',
      notes: ''
    });
    setIsConsumptionDialogOpen(false);
    toast.success('Feed consumption recorded successfully');
  };
  
  // Helper functions
  const getFeedTypeName = (id: string): string => {
    const type = feedTypes.find(t => t.id === id);
    return type ? type.name : 'Unknown Feed Type';
  };
  
  const getBatchName = (id: string): string => {
    const batch = batches.find(b => b.id === id);
    return batch ? batch.name : 'Unknown Batch';
  };
  
  // Calculate total inventory
  const calculateTotalInventory = (feedTypeId?: string): number => {
    let inventory = feedInventory;
    let consumption = feedConsumption;
    
    if (feedTypeId) {
      inventory = inventory.filter(i => i.feedTypeId === feedTypeId);
      consumption = consumption.filter(c => c.feedTypeId === feedTypeId);
    }
    
    const totalPurchased = inventory.reduce((sum, item) => sum + item.quantityKg, 0);
    const totalConsumed = consumption.reduce((sum, item) => sum + item.quantityKg, 0);
    
    return totalPurchased - totalConsumed;
  };

  // Report generation
  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateFeedManagementReport(feedConsumption, feedInventory, feedTypes, batches, format);
      toast.success(`Feed management report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Feed Management</h1>
        <ReportButton 
          onExcelExport={() => handleGenerateReport('excel')} 
          onPdfExport={() => handleGenerateReport('pdf')} 
        />
      </div>
      
      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="types">Feed Types</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
        </TabsList>
        
        {/* Feed Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feed Type
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Feed Type</DialogTitle>
                  <DialogDescription>
                    Create a new feed type for your farm.
                  </DialogDescription>
                </DialogHeader>
                <FeedTypeForm
                  formData={feedTypeForm}
                  onChange={handleFeedTypeChange}
                  onBirdTypeChange={handleBirdTypeChange}
                  onSubmit={handleAddFeedType}
                  onCancel={() => setIsTypeDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Types</CardTitle>
              <CardDescription>Manage the types of feed used on your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Bird Type</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedTypes.length > 0 ? (
                    feedTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{type.birdType}</Badge>
                        </TableCell>
                        <TableCell>
                          {calculateTotalInventory(type.id).toFixed(2)} kg
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          {type.description || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No feed types added yet. Start by adding a feed type.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Inventory
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Feed Inventory</DialogTitle>
                  <DialogDescription>
                    Record purchased or produced feed.
                  </DialogDescription>
                </DialogHeader>
                <FeedInventoryForm
                  formData={inventoryForm}
                  feedTypes={feedTypes}
                  onChange={handleInventoryChange}
                  onFeedTypeChange={handleInventoryFeedTypeChange}
                  onIsProducedChange={handleIsProducedChange}
                  onSubmit={handleAddFeedInventory}
                  onCancel={() => setIsInventoryDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Inventory</CardTitle>
              <CardDescription>Record of all feed purchases and production</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedInventory.length > 0 ? (
                    feedInventory
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            {new Date(entry.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{getFeedTypeName(entry.feedTypeId)}</TableCell>
                          <TableCell>{entry.quantityKg} kg</TableCell>
                          <TableCell>
                            <Badge variant={entry.isProduced ? "default" : "outline"}>
                              {entry.isProduced ? "Farm-produced" : "Purchased"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {entry.notes || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No inventory records yet. Start by adding an inventory entry.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Consumption Tab */}
        <TabsContent value="consumption" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isConsumptionDialogOpen} onOpenChange={setIsConsumptionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Consumption
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record Feed Consumption</DialogTitle>
                  <DialogDescription>
                    Track the feed consumed by your birds.
                  </DialogDescription>
                </DialogHeader>
                <FeedConsumptionForm
                  formData={consumptionForm}
                  feedTypes={feedTypes}
                  batches={batches}
                  onChange={handleConsumptionChange}
                  onFeedTypeChange={handleConsumptionFeedTypeChange}
                  onBatchChange={handleConsumptionBatchChange}
                  onTimeOfDayChange={handleTimeOfDayChange}
                  onSubmit={handleAddFeedConsumption}
                  onCancel={() => setIsConsumptionDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Consumption</CardTitle>
              <CardDescription>Record of all feed given to birds</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Time of Day</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedConsumption.length > 0 ? (
                    feedConsumption
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            {new Date(entry.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{getBatchName(entry.batchId)}</TableCell>
                          <TableCell>{getFeedTypeName(entry.feedTypeId)}</TableCell>
                          <TableCell>{entry.quantityKg} kg</TableCell>
                          <TableCell>{entry.timeOfDay}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {entry.notes || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No consumption records yet. Start by recording consumption.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedManagement;

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Package } from 'lucide-react';
import FeedTypeForm from '@/components/feed/FeedTypeForm';
import FeedConsumptionForm from '@/components/feed/FeedConsumptionForm';
import FeedInventoryForm from '@/components/feed/FeedInventoryForm';
import { generateFeedManagementReport } from '@/utils/reportGenerator';
import ReportButton from '@/components/ReportButton';

const FeedManagement = () => {
  const [isTypesDialogOpen, setIsTypesDialogOpen] = useState(false);
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("types");

  const {
    feedTypes,
    addFeedType,
    feedConsumption,
    addFeedInventory,
    feedInventory,
    batches,
  } = useAppContext();

  // Feed Types form state
  const [feedTypeForm, setFeedTypeForm] = useState({
    name: '',
    description: '',
    birdType: 'Layer' as 'Layer' | 'Broiler' | 'Chick' | 'All',
  });

  // Feed Consumption form state
  const [feedConsumptionForm, setFeedConsumptionForm] = useState({
    feedTypeId: '',
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    quantityKg: 0,
    timeOfDay: 'Morning' as 'Morning' | 'Afternoon' | 'Evening',
    notes: '',
  });

  // Feed Inventory form state
  const [feedInventoryForm, setFeedInventoryForm] = useState({
    feedTypeId: '',
    date: new Date().toISOString().split('T')[0],
    quantityKg: 0,
    isProduced: false,
    notes: '',
  });

  const handleFeedTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedTypeForm({
      ...feedTypeForm,
      [name]: value,
    });
  };

  const handleBirdTypeChange = (value: string) => {
    setFeedTypeForm({
      ...feedTypeForm,
      birdType: value as 'Layer' | 'Broiler' | 'Chick' | 'All',
    });
  };

  const handleFeedConsumptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFeedConsumptionForm({
      ...feedConsumptionForm,
      [name]: name === 'quantityKg' ? parseFloat(value) : value,
    });
  };

  const handleFeedInventoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFeedInventoryForm({
      ...feedInventoryForm,
      [name]: type === 'checkbox' ? checked : name === 'quantityKg' ? parseFloat(value) : value,
    });
  };

  const handleAddFeedType = () => {
    if (!feedTypeForm.name || !feedTypeForm.birdType) {
      toast.error('Please fill in all required fields');
      return;
    }

    addFeedType({
      name: feedTypeForm.name,
      description: feedTypeForm.description,
      birdType: feedTypeForm.birdType,
    });

    setFeedTypeForm({
      name: '',
      description: '',
      birdType: 'Layer',
    });

    setIsTypesDialogOpen(false);
    toast.success('Feed type added successfully');
  };

  const handleAddFeedConsumption = () => {
    if (
      !feedConsumptionForm.feedTypeId ||
      !feedConsumptionForm.batchId ||
      feedConsumptionForm.quantityKg <= 0
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    addFeedConsumption({
      feedTypeId: feedConsumptionForm.feedTypeId,
      batchId: feedConsumptionForm.batchId,
      date: feedConsumptionForm.date,
      quantityKg: feedConsumptionForm.quantityKg,
      timeOfDay: feedConsumptionForm.timeOfDay,
      notes: feedConsumptionForm.notes,
    });

    setFeedConsumptionForm({
      feedTypeId: '',
      batchId: '',
      date: new Date().toISOString().split('T')[0],
      quantityKg: 0,
      timeOfDay: 'Morning',
      notes: '',
    });

    setIsConsumptionDialogOpen(false);
    toast.success('Feed consumption recorded successfully');
  };

  const handleAddFeedInventory = () => {
    if (!feedInventoryForm.feedTypeId || feedInventoryForm.quantityKg <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    addFeedInventory({
      feedTypeId: feedInventoryForm.feedTypeId,
      date: feedInventoryForm.date,
      quantityKg: feedInventoryForm.quantityKg,
      isProduced: feedInventoryForm.isProduced,
      notes: feedInventoryForm.notes,
    });

    setFeedInventoryForm({
      feedTypeId: '',
      date: new Date().toISOString().split('T')[0],
      quantityKg: 0,
      isProduced: false,
      notes: '',
    });

    setIsInventoryDialogOpen(false);
    toast.success('Feed inventory updated successfully');
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    return batch ? batch.name : 'Unknown batch';
  };

  const getFeedTypeName = (feedTypeId: string) => {
    const feedType = feedTypes.find((ft) => ft.id === feedTypeId);
    return feedType ? feedType.name : 'Unknown feed';
  };

  // Add report generation handler
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Feed Management</h1>
        <div className="flex gap-2">
          <ReportButton 
            onExcelExport={() => handleGenerateReport('excel')} 
            onPdfExport={() => handleGenerateReport('pdf')} 
          />
        </div>
      </div>
      
      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="types">Feed Types</TabsTrigger>
          <TabsTrigger value="consumption">Feed Consumption</TabsTrigger>
          <TabsTrigger value="inventory">Feed Inventory</TabsTrigger>
        </TabsList>
        
        {/* Feed Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isTypesDialogOpen} onOpenChange={setIsTypesDialogOpen}>
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
                    Add a new feed type to the catalog.
                  </DialogDescription>
                </DialogHeader>
                <FeedTypeForm
                  formData={feedTypeForm}
                  onChange={handleFeedTypeChange}
                  onBirdTypeChange={handleBirdTypeChange}
                  onSubmit={handleAddFeedType}
                  onCancel={() => setIsTypesDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Types</CardTitle>
              <CardDescription>Manage your feed types catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Bird Type</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedTypes.length > 0 ? (
                    feedTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.birdType}</TableCell>
                        <TableCell>{type.description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No feed types added yet. Start by adding a feed type.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Feed Consumption Tab */}
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
                    Record feed consumption for a batch.
                  </DialogDescription>
                </DialogHeader>
                <FeedConsumptionForm
                  formData={feedConsumptionForm}
                  onChange={handleFeedConsumptionChange}
                  onSubmit={handleAddFeedConsumption}
                  onCancel={() => setIsConsumptionDialogOpen(false)}
                  feedTypes={feedTypes}
                  batches={batches}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Consumption</CardTitle>
              <CardDescription>Record and view feed consumption history</CardDescription>
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
                    feedConsumption.map((consumption) => (
                      <TableRow key={consumption.id}>
                        <TableCell>{consumption.date}</TableCell>
                        <TableCell>{getBatchName(consumption.batchId)}</TableCell>
                        <TableCell>{getFeedTypeName(consumption.feedTypeId)}</TableCell>
                        <TableCell>{consumption.quantityKg}</TableCell>
                        <TableCell>{consumption.timeOfDay}</TableCell>
                        <TableCell>{consumption.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No feed consumption recorded yet. Start by recording feed consumption.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Feed Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Update Inventory
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Feed Inventory</DialogTitle>
                  <DialogDescription>
                    Add or subtract feed from the inventory.
                  </DialogDescription>
                </DialogHeader>
                <FeedInventoryForm
                  formData={feedInventoryForm}
                  onChange={handleFeedInventoryChange}
                  onSubmit={handleAddFeedInventory}
                  onCancel={() => setIsInventoryDialogOpen(false)}
                  feedTypes={feedTypes}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Inventory</CardTitle>
              <CardDescription>View and manage your feed inventory</CardDescription>
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
                    feedInventory.map((inventory) => (
                      <TableRow key={inventory.id}>
                        <TableCell>{inventory.date}</TableCell>
                        <TableCell>{getFeedTypeName(inventory.feedTypeId)}</TableCell>
                        <TableCell>{inventory.quantityKg}</TableCell>
                        <TableCell>{inventory.isProduced ? 'Farm-produced' : 'Purchased'}</TableCell>
                        <TableCell>{inventory.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No feed inventory recorded yet. Start by updating feed inventory.
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

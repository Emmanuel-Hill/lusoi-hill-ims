import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import FeedTypeForm from '@/components/feed/FeedTypeForm';
import FeedConsumptionForm from '@/components/feed/FeedConsumptionForm';
import FeedInventoryForm from '@/components/feed/FeedInventoryForm';
import FeedTypeList from '@/components/feed/FeedTypeList';
import FeedConsumptionList from '@/components/feed/FeedConsumptionList';
import FeedInventoryList from '@/components/feed/FeedInventoryList';
import ReportButton from '@/components/ReportButton';
import { generateFeedManagementReport } from '@/utils/reportGenerator';

const FeedManagement = () => {
  const {
    feedTypes,
    addFeedType,
    updateFeedType,
    deleteFeedType,
    feedConsumption,
    addFeedConsumption: addConsumption,
    feedInventory,
    addFeedInventory,
    batches
  } = useAppContext();

  // Feed Type Dialog State
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isTypeEditMode, setIsTypeEditMode] = useState(false);
  const [selectedFeedType, setSelectedFeedType] = useState<any>(null);
  
  const [feedTypeForm, setFeedTypeForm] = useState({
    name: '',
    description: '',
    birdType: 'Layers' as 'Layers' | 'Growers' | 'Other',
  });

  // Feed Consumption Dialog State
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] = useState(false);
  const [consumptionForm, setConsumptionForm] = useState({
    feedTypeId: '',
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    quantityKg: 0,
    timeOfDay: 'Morning' as 'Morning' | 'Afternoon' | 'Evening',
    notes: '',
  });

  // Feed Inventory Dialog State
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [inventoryForm, setInventoryForm] = useState({
    feedTypeId: '',
    date: new Date().toISOString().split('T')[0],
    quantityKg: 0,
    isProduced: false,
    notes: '',
  });
  
  // Feed Type handlers
  const handleFeedTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedTypeForm({
      ...feedTypeForm,
      [name]: value,
    });
  };
  
  const handleBirdTypeChange = (value: 'Layers' | 'Growers' | 'Other') => {
    setFeedTypeForm({
      ...feedTypeForm,
      birdType: value,
    });
  };
  
  const handleFeedTypeSubmit = () => {
    if (!feedTypeForm.name) {
      toast.error('Please enter a feed type name');
      return;
    }
    
    if (isTypeEditMode && selectedFeedType) {
      updateFeedType(selectedFeedType.id, feedTypeForm);
      toast.success('Feed type updated successfully');
    } else {
      addFeedType(feedTypeForm);
      toast.success('Feed type added successfully');
    }
    
    resetFeedTypeForm();
    setIsTypeDialogOpen(false);
  };
  
  const handleEditFeedType = (feedType: any) => {
    setSelectedFeedType(feedType);
    setFeedTypeForm({
      name: feedType.name,
      description: feedType.description || '',
      birdType: feedType.birdType,
    });
    setIsTypeEditMode(true);
    setIsTypeDialogOpen(true);
  };
  
  const handleDeleteFeedType = (id: string) => {
    deleteFeedType(id);
    toast.success('Feed type deleted successfully');
  };
  
  const resetFeedTypeForm = () => {
    setFeedTypeForm({
      name: '',
      description: '',
      birdType: 'Layers',
    });
    setSelectedFeedType(null);
    setIsTypeEditMode(false);
  };

  // Feed Consumption handlers
  const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConsumptionForm({
      ...consumptionForm,
      [name]: name === 'quantityKg' ? Number(value) : value,
    });
  };
  
  const handleFeedTypeSelect = (value: string) => {
    setConsumptionForm({
      ...consumptionForm,
      feedTypeId: value,
    });
  };
  
  const handleBatchSelect = (value: string) => {
    setConsumptionForm({
      ...consumptionForm,
      batchId: value,
    });
  };
  
  const handleTimeOfDayChange = (value: 'Morning' | 'Afternoon' | 'Evening') => {
    setConsumptionForm({
      ...consumptionForm,
      timeOfDay: value,
    });
  };
  
  const handleConsumptionSubmit = () => {
    if (!consumptionForm.feedTypeId || !consumptionForm.batchId || consumptionForm.quantityKg <= 0) {
      toast.error('Please fill all required fields with valid values');
      return;
    }
    
    addConsumption(consumptionForm);
    resetConsumptionForm();
    setIsConsumptionDialogOpen(false);
    toast.success('Feed consumption recorded successfully');
  };
  
  const resetConsumptionForm = () => {
    setConsumptionForm({
      feedTypeId: '',
      batchId: '',
      date: new Date().toISOString().split('T')[0],
      quantityKg: 0,
      timeOfDay: 'Morning',
      notes: '',
    });
  };

  // Feed Inventory handlers
  const handleInventoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setInventoryForm({
      ...inventoryForm,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'quantityKg' ? Number(value) : value,
    });
  };
  
  const handleInventoryFeedTypeSelect = (value: string) => {
    setInventoryForm({
      ...inventoryForm,
      feedTypeId: value,
    });
  };
  
  const handleIsProducedChange = (value: boolean) => {
    setInventoryForm({
      ...inventoryForm,
      isProduced: value,
    });
  };
  
  const handleInventorySubmit = () => {
    if (!inventoryForm.feedTypeId || inventoryForm.quantityKg <= 0) {
      toast.error('Please fill all required fields with valid values');
      return;
    }
    
    addFeedInventory(inventoryForm);
    resetInventoryForm();
    setIsInventoryDialogOpen(false);
    toast.success('Feed inventory updated successfully');
  };
  
  const resetInventoryForm = () => {
    setInventoryForm({
      feedTypeId: '',
      date: new Date().toISOString().split('T')[0],
      quantityKg: 0,
      isProduced: false,
      notes: '',
    });
  };

  // Generate report handler
  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateFeedManagementReport(feedConsumption, feedInventory, feedTypes, batches, format);
      toast.success(`Feed report generated successfully (${format.toUpperCase()})`);
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
            <Button onClick={() => {
              resetFeedTypeForm();
              setIsTypeDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Feed Type
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Types</CardTitle>
              <CardDescription>
                Manage the different types of feed you use on your farm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedTypeList 
                feedTypes={feedTypes}
                onEdit={handleEditFeedType}
                onDelete={handleDeleteFeedType}
              />
            </CardContent>
          </Card>
          
          <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {isTypeEditMode ? 'Edit Feed Type' : 'Add New Feed Type'}
                </DialogTitle>
              </DialogHeader>
              <FeedTypeForm 
                formData={feedTypeForm}
                onChange={handleFeedTypeChange}
                onBirdTypeChange={handleBirdTypeChange}
                onSubmit={handleFeedTypeSubmit}
                onCancel={() => setIsTypeDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* Feed Consumption Tab */}
        <TabsContent value="consumption" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              resetConsumptionForm();
              setIsConsumptionDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Record Feed Consumption
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Consumption Records</CardTitle>
              <CardDescription>
                Track how much feed is being consumed by each batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedConsumptionList 
                feedConsumption={feedConsumption}
                feedTypes={feedTypes}
                batches={batches}
              />
            </CardContent>
          </Card>
          
          <Dialog open={isConsumptionDialogOpen} onOpenChange={setIsConsumptionDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Feed Consumption</DialogTitle>
              </DialogHeader>
              <FeedConsumptionForm 
                formData={consumptionForm}
                onChange={handleConsumptionChange}
                onSubmit={handleConsumptionSubmit}
                onCancel={() => setIsConsumptionDialogOpen(false)}
                feedTypes={feedTypes}
                batches={batches}
                onFeedTypeChange={handleFeedTypeSelect}
                onBatchChange={handleBatchSelect}
                onTimeOfDayChange={handleTimeOfDayChange}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* Feed Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
              resetInventoryForm();
              setIsInventoryDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Update Feed Inventory
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Inventory</CardTitle>
              <CardDescription>
                Track your feed stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedInventoryList 
                feedInventory={feedInventory}
                feedTypes={feedTypes}
              />
            </CardContent>
          </Card>
          
          <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Feed Inventory</DialogTitle>
              </DialogHeader>
              <FeedInventoryForm 
                formData={inventoryForm}
                onChange={handleInventoryChange}
                onSubmit={handleInventorySubmit}
                onCancel={() => setIsInventoryDialogOpen(false)}
                feedTypes={feedTypes}
                onFeedTypeChange={handleInventoryFeedTypeSelect}
                onIsProducedChange={handleIsProducedChange}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedManagement;

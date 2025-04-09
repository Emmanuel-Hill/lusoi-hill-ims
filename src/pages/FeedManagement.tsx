
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, FileSpreadsheet, FilePdf } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { generateFeedManagementReport } from '@/utils/reportGenerator';

const FeedManagement = () => {
  const { 
    feedTypes, addFeedType, 
    batches,
    feedInventory, addFeedInventory,
    feedConsumption, addFeedConsumption 
  } = useAppContext();
  
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] = useState(false);
  
  const [feedTypeForm, setFeedTypeForm] = useState({
    name: '',
    description: '',
    birdType: 'Layers' as 'Layers' | 'Growers' | 'Other'
  });
  
  const [inventoryForm, setInventoryForm] = useState({
    feedTypeId: '',
    quantityKg: 0,
    date: new Date().toISOString().split('T')[0],
    isProduced: false,
    notes: ''
  });
  
  const [consumptionForm, setConsumptionForm] = useState({
    batchId: '',
    feedTypeId: '',
    quantityKg: 0,
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'Morning' as 'Morning' | 'Afternoon' | 'Evening',
    notes: ''
  });

  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateFeedManagementReport(feedConsumption, feedInventory, feedTypes, batches, format);
      toast.success(`Feed management report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

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
      birdType: value as 'Layers' | 'Growers' | 'Other',
    });
  };

  const handleInventoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInventoryForm({
      ...inventoryForm,
      [name]: name === 'quantityKg' ? Number(value) : value,
    });
  };

  const handleInventoryCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInventoryForm({
      ...inventoryForm,
      isProduced: e.target.checked,
    });
  };

  const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConsumptionForm({
      ...consumptionForm,
      [name]: name === 'quantityKg' ? Number(value) : value,
    });
  };

  const handleFeedTypeSubmit = () => {
    if (!feedTypeForm.name || !feedTypeForm.birdType) {
      toast.error('Please fill in all required fields');
      return;
    }

    addFeedType(feedTypeForm);
    setFeedTypeForm({
      name: '',
      description: '',
      birdType: 'Layers',
    });
    setIsTypeDialogOpen(false);
    toast.success('Feed type added successfully');
  };

  const handleInventorySubmit = () => {
    if (!inventoryForm.feedTypeId || !inventoryForm.quantityKg) {
      toast.error('Please fill in all required fields');
      return;
    }

    addFeedInventory(inventoryForm);
    setInventoryForm({
      feedTypeId: '',
      quantityKg: 0,
      date: new Date().toISOString().split('T')[0],
      isProduced: false,
      notes: ''
    });
    setIsInventoryDialogOpen(false);
    toast.success('Inventory added successfully');
  };

  const handleConsumptionSubmit = () => {
    if (!consumptionForm.batchId || !consumptionForm.feedTypeId || !consumptionForm.quantityKg) {
      toast.error('Please fill in all required fields');
      return;
    }

    addFeedConsumption(consumptionForm);
    setConsumptionForm({
      batchId: '',
      feedTypeId: '',
      quantityKg: 0,
      date: new Date().toISOString().split('T')[0],
      timeOfDay: 'Morning',
      notes: ''
    });
    setIsConsumptionDialogOpen(false);
    toast.success('Feed consumption added successfully');
  };

  const getFeedTypeName = (id: string) => {
    const feedType = feedTypes.find(type => type.id === id);
    return feedType ? feedType.name : 'Unknown';
  };

  const getBatchName = (id: string) => {
    const batch = batches.find(b => b.id === id);
    return batch ? batch.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Feed Management</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Reports
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleGenerateReport('excel')}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleGenerateReport('pdf')}>
              <FilePdf className="mr-2 h-4 w-4" />
              Export to PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="types">Feed Types</TabsTrigger>
          <TabsTrigger value="inventory">Feed Inventory</TabsTrigger>
          <TabsTrigger value="consumption">Feed Consumption</TabsTrigger>
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
                    Create a new type of feed for your birds.
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
                      value={feedTypeForm.name}
                      onChange={handleFeedTypeChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={feedTypeForm.description}
                      onChange={handleFeedTypeChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="birdType" className="text-right">
                      Bird Type
                    </Label>
                    <Select onValueChange={handleBirdTypeChange}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select bird type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Layers">Layers</SelectItem>
                        <SelectItem value="Growers">Growers</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTypeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFeedTypeSubmit}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Types</CardTitle>
              <CardDescription>Manage different types of feed for your birds</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Bird Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedTypes.length > 0 ? (
                    feedTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.description || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{type.birdType}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No feed types added. Start by adding a feed type.
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
                  Add Inventory
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Feed Inventory</DialogTitle>
                  <DialogDescription>
                    Record new feed inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="feedTypeId" className="text-right">
                      Feed Type
                    </Label>
                    <Select onValueChange={(value) => setInventoryForm({...inventoryForm, feedTypeId: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select feed type" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantityKg" className="text-right">
                      Quantity (kg)
                    </Label>
                    <Input
                      id="quantityKg"
                      name="quantityKg"
                      type="number"
                      min="0"
                      value={inventoryForm.quantityKg}
                      onChange={handleInventoryChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={inventoryForm.date}
                      onChange={handleInventoryChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isProduced" className="text-right">
                      Farm Produced
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <input
                        id="isProduced"
                        name="isProduced"
                        type="checkbox"
                        checked={inventoryForm.isProduced}
                        onChange={handleInventoryCheckbox}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-muted-foreground">Check if feed was produced on farm</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={inventoryForm.notes}
                      onChange={handleInventoryChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInventoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInventorySubmit}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Inventory</CardTitle>
              <CardDescription>Track your feed stock</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedInventory.length > 0 ? (
                    feedInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{getFeedTypeName(item.feedTypeId)}</TableCell>
                        <TableCell>{item.quantityKg} kg</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.isProduced ? 'Farm Produced' : 'Purchased'}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{item.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No inventory records. Start by adding feed inventory.
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
                    Track feed consumption by batch.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="batchId" className="text-right">
                      Batch
                    </Label>
                    <Select onValueChange={(value) => setConsumptionForm({...consumptionForm, batchId: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="feedTypeId" className="text-right">
                      Feed Type
                    </Label>
                    <Select onValueChange={(value) => setConsumptionForm({...consumptionForm, feedTypeId: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select feed type" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantityKg" className="text-right">
                      Quantity (kg)
                    </Label>
                    <Input
                      id="quantityKg"
                      name="quantityKg"
                      type="number"
                      min="0"
                      step="0.1"
                      value={consumptionForm.quantityKg}
                      onChange={handleConsumptionChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={consumptionForm.date}
                      onChange={handleConsumptionChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="timeOfDay" className="text-right">
                      Time of Day
                    </Label>
                    <Select onValueChange={(value) => setConsumptionForm({
                      ...consumptionForm, 
                      timeOfDay: value as 'Morning' | 'Afternoon' | 'Evening'
                    })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
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
                      value={consumptionForm.notes}
                      onChange={handleConsumptionChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsConsumptionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleConsumptionSubmit}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Feed Consumption</CardTitle>
              <CardDescription>Track feed consumption by batch</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedConsumption.length > 0 ? (
                    feedConsumption.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{getBatchName(item.batchId)}</TableCell>
                        <TableCell>{getFeedTypeName(item.feedTypeId)}</TableCell>
                        <TableCell>{item.quantityKg} kg</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.timeOfDay}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{item.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No consumption records. Start by recording feed consumption.
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

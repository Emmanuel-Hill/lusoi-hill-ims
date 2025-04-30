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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FeedType, FeedConsumption, FeedInventory } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const FeedManagement = () => {
  const {
    batches,
    feedTypes,
    feedConsumption,
    feedInventory,
    addFeedType,
    updateFeedType,
    deleteFeedType,
    addFeedConsumption,
    addFeedInventory,
  } = useAppContext();

  const [isFeedTypeDialogOpen, setIsFeedTypeDialogOpen] = useState(false);
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);

  const [feedTypeForm, setFeedTypeForm] = useState({
    name: '',
    description: '',
    birdType: 'Layers' as 'Layers' | 'Growers' | 'Other',
  });

  const [consumptionForm, setConsumptionForm] = useState({
    feedTypeId: '',
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    quantityKg: 0,
    timeOfDay: 'Morning' as 'Morning' | 'Afternoon' | 'Evening',
    notes: '',
  });

  const [inventoryForm, setInventoryForm] = useState({
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

  const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConsumptionForm({
      ...consumptionForm,
      [name]: name === 'quantityKg' ? parseFloat(value) : value,
    });
  };

  const handleInventoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInventoryForm({
      ...inventoryForm,
      [name]: name === 'quantityKg' ? parseFloat(value) : value,
    });
  };

  const handleAddFeedType = () => {
    if (!feedTypeForm.name || !feedTypeForm.birdType) {
      toast.error('Please provide a name and select bird type');
      return;
    }

    addFeedType({
      id: crypto.randomUUID(),
      name: feedTypeForm.name,
      description: feedTypeForm.description,
      birdType: feedTypeForm.birdType,
    });

    setFeedTypeForm({
      name: '',
      description: '',
      birdType: 'Layers',
    });

    setIsFeedTypeDialogOpen(false);
    toast.success('Feed type added successfully');
  };

  const handleAddConsumption = () => {
    if (!consumptionForm.batchId || !consumptionForm.feedTypeId) {
      toast.error('Please select a batch and feed type');
      return;
    }

    addFeedConsumption({
      id: crypto.randomUUID(),
      feedTypeId: consumptionForm.feedTypeId,
      batchId: consumptionForm.batchId,
      date: consumptionForm.date,
      quantityKg: consumptionForm.quantityKg,
      timeOfDay: consumptionForm.timeOfDay,
      notes: consumptionForm.notes,
    });

    setConsumptionForm({
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

  const handleAddInventory = () => {
    if (!inventoryForm.feedTypeId) {
      toast.error('Please select a feed type');
      return;
    }

    addFeedInventory({
      id: crypto.randomUUID(),
      feedTypeId: inventoryForm.feedTypeId,
      date: inventoryForm.date,
      quantityKg: inventoryForm.quantityKg,
      isProduced: inventoryForm.isProduced,
      notes: inventoryForm.notes,
    });

    setInventoryForm({
      feedTypeId: '',
      date: new Date().toISOString().split('T')[0],
      quantityKg: 0,
      isProduced: false,
      notes: '',
    });

    setIsInventoryDialogOpen(false);
    toast.success('Feed inventory updated successfully');
  };

  const getFeedTypeName = (feedTypeId: string) => {
    const feedType = feedTypes.find(type => type.id === feedTypeId);
    return feedType ? feedType.name : 'Unknown Feed Type';
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(batch => batch.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Feed Management</h1>

      <Tabs defaultValue="feed-types" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="feed-types">Feed Types</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* Feed Types Tab */}
        <TabsContent value="feed-types" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isFeedTypeDialogOpen} onOpenChange={setIsFeedTypeDialogOpen}>
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
                    Add a new type of feed used in your farm.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={feedTypeForm.name}
                      onChange={handleFeedTypeChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={feedTypeForm.description}
                      onChange={handleFeedTypeChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="birdType" className="text-right">Bird Type</Label>
                    <Select onValueChange={(value) => setFeedTypeForm({ ...feedTypeForm, birdType: value as 'Layers' | 'Growers' | 'Other' })}>
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
                  <Button variant="outline" onClick={() => setIsFeedTypeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFeedType}>
                    Add Feed Type
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feed Types</CardTitle>
              <CardDescription>Manage different types of feed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Bird Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedTypes.length > 0 ? (
                    feedTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.description || '-'}</TableCell>
                        <TableCell>{type.birdType}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
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
                    Record feed consumption for a specific batch.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="batchId" className="text-right">Batch</Label>
                    <Select onValueChange={(value) => setConsumptionForm({ ...consumptionForm, batchId: value })}>
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
                    <Label htmlFor="feedTypeId" className="text-right">Feed Type</Label>
                    <Select onValueChange={(value) => setConsumptionForm({ ...consumptionForm, feedTypeId: value })}>
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
                    <Label htmlFor="date" className="text-right">Date</Label>
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
                    <Label htmlFor="quantityKg" className="text-right">Quantity (Kg)</Label>
                    <Input
                      id="quantityKg"
                      name="quantityKg"
                      type="number"
                      step="0.01"
                      value={consumptionForm.quantityKg}
                      onChange={handleConsumptionChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="timeOfDay" className="text-right">Time of Day</Label>
                    <Select onValueChange={(value) => setConsumptionForm({ ...consumptionForm, timeOfDay: value as 'Morning' | 'Afternoon' | 'Evening' })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select time of day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Notes</Label>
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
                  <Button onClick={handleAddConsumption}>
                    Record Consumption
                  </Button>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Quantity (Kg)</TableHead>
                    <TableHead>Time of Day</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedConsumption.length > 0 ? (
                    feedConsumption.map((consumption) => (
                      <TableRow key={consumption.id}>
                        <TableCell className="font-medium">{getBatchName(consumption.batchId)}</TableCell>
                        <TableCell>{getFeedTypeName(consumption.feedTypeId)}</TableCell>
                        <TableCell>{consumption.date}</TableCell>
                        <TableCell>{consumption.quantityKg}</TableCell>
                        <TableCell>{consumption.timeOfDay}</TableCell>
                        <TableCell>{consumption.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No feed consumption records added yet. Start by recording feed consumption.
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
                  Update Inventory
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Feed Inventory</DialogTitle>
                  <DialogDescription>
                    Record changes to feed inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="feedTypeId" className="text-right">Feed Type</Label>
                    <Select onValueChange={(value) => setInventoryForm({ ...inventoryForm, feedTypeId: value })}>
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
                    <Label htmlFor="date" className="text-right">Date</Label>
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
                    <Label htmlFor="quantityKg" className="text-right">Quantity (Kg)</Label>
                    <Input
                      id="quantityKg"
                      name="quantityKg"
                      type="number"
                      step="0.01"
                      value={inventoryForm.quantityKg}
                      onChange={handleInventoryChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isProduced" className="text-right">Farm Produced?</Label>
                    <Input
                      id="isProduced"
                      name="isProduced"
                      type="checkbox"
                      checked={inventoryForm.isProduced}
                      onChange={() => setInventoryForm({ ...inventoryForm, isProduced: !inventoryForm.isProduced })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Notes</Label>
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
                  <Button onClick={handleAddInventory}>
                    Update Inventory
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feed Inventory</CardTitle>
              <CardDescription>Track current feed inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Quantity (Kg)</TableHead>
                    <TableHead>Farm Produced?</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedInventory.length > 0 ? (
                    feedInventory.map((inventory) => (
                      <TableRow key={inventory.id}>
                        <TableCell className="font-medium">{getFeedTypeName(inventory.feedTypeId)}</TableCell>
                        <TableCell>{inventory.date}</TableCell>
                        <TableCell>{inventory.quantityKg}</TableCell>
                        <TableCell>{inventory.isProduced ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{inventory.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No feed inventory records added yet. Start by updating feed inventory.
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


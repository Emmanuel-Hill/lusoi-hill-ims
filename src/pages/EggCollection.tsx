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
import { 
  Egg, 
  Plus, 
  FileSpreadsheet, 
  FileText 
} from 'lucide-react';
import { toast } from 'sonner';
import { generateEggCollectionReport } from '@/utils/reportGenerator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportButton from '@/components/ReportButton';

const EggCollectionPage = () => {
  const { batches, eggCollections, addEggCollection } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    wholeCount: 0,
    brokenCount: 0,
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['wholeCount', 'brokenCount'].includes(name) ? parseInt(value) || 0 : value,
    });
  };

  const handleBatchChange = (value: string) => {
    setFormData({
      ...formData,
      batchId: value,
    });
  };

  const handleAddCollection = () => {
    if (!formData.batchId) {
      toast.error('Please select a batch');
      return;
    }

    addEggCollection(formData);
    setIsDialogOpen(false);
    setFormData({
      batchId: '',
      date: new Date().toISOString().split('T')[0],
      wholeCount: 0,
      brokenCount: 0,
      notes: '',
    });
    toast.success('Egg collection recorded successfully');
  };

  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateEggCollectionReport(eggCollections, batches, format);
      toast.success(`Egg collection report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  // Get only laying batches for the selection
  const layingBatches = batches.filter(batch => batch.batchStatus === 'Laying');

  // Calculate totals
  const totalWhole = eggCollections.reduce((sum, collection) => sum + collection.wholeCount, 0);
  const totalBroken = eggCollections.reduce((sum, collection) => sum + collection.brokenCount, 0);
  const totalEggs = totalWhole + totalBroken;

  // Get batch name by ID
  const getBatchName = (batchId: string) => {
    const batch = batches.find(batch => batch.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Egg Collection</h1>
        <div className="flex space-x-2">
          <ReportButton 
            onExcelExport={() => handleGenerateReport('excel')} 
            onPdfExport={() => handleGenerateReport('pdf')} 
          />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Egg Collection</DialogTitle>
                <DialogDescription>
                  Enter the details of your egg collection.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batch" className="text-right">
                    Batch
                  </Label>
                  <Select onValueChange={handleBatchChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {layingBatches.length > 0 ? (
                        layingBatches.map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name} ({batch.birdCount} birds)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No laying batches available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="wholeCount" className="text-right">
                    Whole Eggs
                  </Label>
                  <Input
                    id="wholeCount"
                    name="wholeCount"
                    type="number"
                    min="0"
                    value={formData.wholeCount}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="brokenCount" className="text-right">
                    Broken Eggs
                  </Label>
                  <Input
                    id="brokenCount"
                    name="brokenCount"
                    type="number"
                    min="0"
                    value={formData.brokenCount}
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
                <Button onClick={handleAddCollection}>Record Collection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Total Eggs</CardTitle>
              <CardDescription>All time collections</CardDescription>
            </div>
            <Egg className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalEggs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Whole Eggs</CardTitle>
              <CardDescription>Good condition</CardDescription>
            </div>
            <Egg className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalWhole}</div>
            <div className="text-sm text-muted-foreground">
              {totalEggs > 0
                ? `${Math.round((totalWhole / totalEggs) * 100)}% of total eggs`
                : '0% of total eggs'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Broken Eggs</CardTitle>
              <CardDescription>Damaged condition</CardDescription>
            </div>
            <Egg className="h-8 w-8 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalBroken}</div>
            <div className="text-sm text-muted-foreground">
              {totalEggs > 0
                ? `${Math.round((totalBroken / totalEggs) * 100)}% of total eggs`
                : '0% of total eggs'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection History</CardTitle>
          <CardDescription>Recent egg collections</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Whole Eggs</TableHead>
                <TableHead>Broken Eggs</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eggCollections.length > 0 ? (
                eggCollections
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        {new Date(collection.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getBatchName(collection.batchId)}</TableCell>
                      <TableCell>{collection.wholeCount}</TableCell>
                      <TableCell>{collection.brokenCount}</TableCell>
                      <TableCell>{collection.wholeCount + collection.brokenCount}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {collection.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No egg collections recorded. Start by recording a collection.
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

export default EggCollectionPage;

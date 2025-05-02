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
  DialogFooter,
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
import { addDays, format } from 'date-fns';
import ReportButton from '@/components/ReportButton';
import { generateVaccinationReport } from '@/utils/reportGenerator';

const Vaccination = () => {
  const {
    batches,
    vaccines,
    vaccinationRecords,
    addVaccine,
    addVaccinationRecord
  } = useAppContext();

  const [isVaccineDialogOpen, setIsVaccineDialogOpen] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);

  const [vaccineForm, setVaccineForm] = useState({
    name: '',
    description: '',
    intervalDays: 30,
  });

  const [recordForm, setRecordForm] = useState({
    batchId: '',
    vaccineId: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleVaccineChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVaccineForm({
      ...vaccineForm,
      [name]: name === 'intervalDays' ? parseInt(value) : value,
    });
  };

  const handleRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecordForm({
      ...recordForm,
      [name]: value,
    });
  };

  const handleAddVaccine = () => {
    if (!vaccineForm.name) {
      toast.error('Please provide a vaccine name');
      return;
    }

    addVaccine({
      id: crypto.randomUUID(),
      name: vaccineForm.name,
      description: vaccineForm.description,
      intervalDays: vaccineForm.intervalDays,
    });

    setVaccineForm({
      name: '',
      description: '',
      intervalDays: 30,
    });

    setIsVaccineDialogOpen(false);
    toast.success('Vaccine added successfully');
  };

  const handleAddRecord = () => {
    if (!recordForm.batchId || !recordForm.vaccineId) {
      toast.error('Please select a batch and vaccine');
      return;
    }

    const selectedVaccine = vaccines.find(v => v.id === recordForm.vaccineId);
    const nextScheduledDate = selectedVaccine && selectedVaccine.intervalDays
      ? format(addDays(new Date(recordForm.date), selectedVaccine.intervalDays), 'yyyy-MM-dd')
      : undefined;

    addVaccinationRecord({
      id: crypto.randomUUID(),
      batchId: recordForm.batchId,
      vaccineId: recordForm.vaccineId,
      date: recordForm.date,
      notes: recordForm.notes,
      nextScheduledDate: nextScheduledDate,
    });

    setRecordForm({
      batchId: '',
      vaccineId: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });

    setIsRecordDialogOpen(false);
    toast.success('Vaccination record added successfully');
  };

  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      generateVaccinationReport(vaccinationRecords, vaccines, batches, format);
      toast.success(`Vaccination report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vaccination Management</h1>
        <ReportButton 
          onExcelExport={() => handleGenerateReport('excel')} 
          onPdfExport={() => handleGenerateReport('pdf')} 
        />
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
        </TabsList>

        {/* Records Tab */}
        <TabsContent value="records" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Vaccination Record</DialogTitle>
                  <DialogDescription>
                    Record a new vaccination for a batch of birds.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="batchId" className="text-right">Batch</Label>
                    <Select onValueChange={(value) => setRecordForm({ ...recordForm, batchId: value })}>
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
                    <Label htmlFor="vaccineId" className="text-right">Vaccine</Label>
                    <Select onValueChange={(value) => setRecordForm({ ...recordForm, vaccineId: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select vaccine" />
                      </SelectTrigger>
                      <SelectContent>
                        {vaccines.map((vaccine) => (
                          <SelectItem key={vaccine.id} value={vaccine.id}>{vaccine.name}</SelectItem>
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
                      value={recordForm.date}
                      onChange={handleRecordChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={recordForm.notes}
                      onChange={handleRecordChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRecord}>
                    Add Record
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vaccination Records</CardTitle>
              <CardDescription>Manage vaccination records for your batches</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Vaccination Records Table */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vaccines Tab */}
        <TabsContent value="vaccines" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isVaccineDialogOpen} onOpenChange={setIsVaccineDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vaccine
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Vaccine</DialogTitle>
                  <DialogDescription>
                    Add a new vaccine to the list of available vaccines.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={vaccineForm.name}
                      onChange={handleVaccineChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={vaccineForm.description}
                      onChange={handleVaccineChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="intervalDays" className="text-right">Interval (Days)</Label>
                    <Input
                      id="intervalDays"
                      name="intervalDays"
                      type="number"
                      value={vaccineForm.intervalDays}
                      onChange={handleVaccineChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsVaccineDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddVaccine}>
                    Add Vaccine
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vaccines</CardTitle>
              <CardDescription>Manage the list of available vaccines</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Vaccines Table */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vaccination;

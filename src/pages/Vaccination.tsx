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
  Pill,
  Plus,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { generateVaccinationReport } from '@/utils/reportGenerator';
import { Badge } from '@/components/ui/badge';
import { addDays, format, isAfter, isBefore, startOfToday } from 'date-fns';
import ReportButton from '@/components/ReportButton';

interface Vaccine {
  id: string;
  name: string;
  description?: string;
  intervalDays?: number;
}

interface VaccinationRecord {
  id: string;
  batchId: string;
  vaccineId: string;
  date: string;
  nextScheduledDate?: string;
  notes?: string;
}

const VaccinationPage = () => {
  const { batches, vaccines, vaccinationRecords, addVaccine, addVaccinationRecord } = useAppContext();

  // Dialog state
  const [isVaccineDialogOpen, setIsVaccineDialogOpen] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);

  // Form state
  const [vaccineForm, setVaccineForm] = useState({
    name: '',
    description: '',
    intervalDays: 30,
  });

  const [recordForm, setRecordForm] = useState({
    batchId: '',
    vaccineId: '',
    date: new Date().toISOString().split('T')[0],
    nextScheduledDate: addDays(startOfToday(), vaccineForm.intervalDays).toISOString().split('T')[0],
    notes: '',
  });

  // Form change handlers
  const handleVaccineFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVaccineForm({
      ...vaccineForm,
      [name]: value,
    });
  };

  const handleRecordFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecordForm({
      ...recordForm,
      [name]: value,
    });
  };

  const handleIntervalDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const interval = parseInt(value);
    setVaccineForm({
      ...vaccineForm,
      intervalDays: interval,
    });
    // Update nextScheduledDate when intervalDays changes
    setRecordForm({
      ...recordForm,
      nextScheduledDate: addDays(new Date(recordForm.date), interval).toISOString().split('T')[0],
    });
  };

  const handleBatchChange = (value: string) => {
    setRecordForm({
      ...recordForm,
      batchId: value,
    });
  };

  const handleVaccineChange = (value: string) => {
    const selectedVaccine = vaccines.find(vaccine => vaccine.id === value);
    setRecordForm({
      ...recordForm,
      vaccineId: value,
      nextScheduledDate: selectedVaccine?.intervalDays ? addDays(new Date(recordForm.date), selectedVaccine.intervalDays).toISOString().split('T')[0] : recordForm.nextScheduledDate,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
      setRecordForm({
        ...recordForm,
        date: value,
        nextScheduledDate: vaccineForm.intervalDays ? addDays(new Date(value), vaccineForm.intervalDays).toISOString().split('T')[0] : recordForm.nextScheduledDate,
      });
  };

  // Submit handlers
  const handleAddVaccine = () => {
    if (!vaccineForm.name) {
      toast.error('Please enter a vaccine name');
      return;
    }

    addVaccine(vaccineForm);
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

    addVaccinationRecord(recordForm);
    setRecordForm({
      batchId: '',
      vaccineId: '',
      date: new Date().toISOString().split('T')[0],
      nextScheduledDate: addDays(startOfToday(), vaccineForm.intervalDays).toISOString().split('T')[0],
      notes: '',
    });
    setIsRecordDialogOpen(false);
    toast.success('Vaccination record added successfully');
  };

  // Helper functions
  const getBatchName = (id: string) => {
    const batch = batches.find(batch => batch.id === id);
    return batch ? batch.name : 'Unknown Batch';
  };

  const getVaccineName = (id: string) => {
    const vaccine = vaccines.find(vaccine => vaccine.id === id);
    return vaccine ? vaccine.name : 'Unknown Vaccine';
  };

  const getUpcomingVaccinations = () => {
    const today = startOfToday();
    return vaccinationRecords
      .filter(record => record.nextScheduledDate && isAfter(new Date(record.nextScheduledDate), today))
      .sort((a, b) => new Date(a.nextScheduledDate!).getTime() - new Date(b.nextScheduledDate!).getTime());
  };

  // Add report generation handler
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Vaccination</h1>
        <div className="flex space-x-2">
          <ReportButton 
            onExcelExport={() => handleGenerateReport('excel')} 
            onPdfExport={() => handleGenerateReport('pdf')} 
          />
          
          <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Vaccination
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Vaccination</DialogTitle>
                <DialogDescription>
                  Record a new vaccination for a batch.
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
                      {batches.length > 0 ? (
                        batches.map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No batches available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vaccine" className="text-right">
                    Vaccine
                  </Label>
                  <Select onValueChange={handleVaccineChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaccines.length > 0 ? (
                        vaccines.map(vaccine => (
                          <SelectItem key={vaccine.id} value={vaccine.id}>
                            {vaccine.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No vaccines available
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
                    value={recordForm.date}
                    onChange={handleDateChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nextScheduledDate" className="text-right">
                    Next Due
                  </Label>
                  <Input
                    id="nextScheduledDate"
                    name="nextScheduledDate"
                    type="date"
                    value={recordForm.nextScheduledDate}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={recordForm.notes}
                    onChange={handleRecordFormChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecord}>Save Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="records">Vaccination Records</TabsTrigger>
          <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
        </TabsList>
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Records</CardTitle>
              <CardDescription>All recorded vaccinations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Next Due Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccinationRecords.length > 0 ? (
                    vaccinationRecords
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{getBatchName(record.batchId)}</TableCell>
                          <TableCell>{getVaccineName(record.vaccineId)}</TableCell>
                          <TableCell>
                            {record.nextScheduledDate ? format(new Date(record.nextScheduledDate), 'MMM dd, yyyy') : '-'}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{record.notes || '-'}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No vaccination records added yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Vaccinations</CardTitle>
              <CardDescription>Vaccinations scheduled for the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Previous Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getUpcomingVaccinations().length > 0 ? (
                    getUpcomingVaccinations().map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {record.nextScheduledDate ? format(new Date(record.nextScheduledDate), 'MMM dd, yyyy') : '-'}
                        </TableCell>
                        <TableCell>{getBatchName(record.batchId)}</TableCell>
                        <TableCell>{getVaccineName(record.vaccineId)}</TableCell>
                        <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No upcoming vaccinations scheduled.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
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
                    Create a new vaccine record.
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
                      value={vaccineForm.name}
                      onChange={handleVaccineFormChange}
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
                      value={vaccineForm.description}
                      onChange={handleVaccineFormChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="intervalDays" className="text-right">
                      Interval (Days)
                    </Label>
                    <Input
                      id="intervalDays"
                      name="intervalDays"
                      type="number"
                      min="1"
                      value={vaccineForm.intervalDays}
                      onChange={handleIntervalDaysChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsVaccineDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddVaccine}>Save Vaccine</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vaccines</CardTitle>
              <CardDescription>Manage vaccine records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Interval (Days)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccines.length > 0 ? (
                    vaccines.map((vaccine) => (
                      <TableRow key={vaccine.id}>
                        <TableCell className="font-medium">{vaccine.name}</TableCell>
                        <TableCell>{vaccine.description || '-'}</TableCell>
                        <TableCell>{vaccine.intervalDays || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No vaccines added yet.
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

export default VaccinationPage;

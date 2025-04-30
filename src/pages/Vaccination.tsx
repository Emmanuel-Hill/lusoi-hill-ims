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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { formatDistanceToNow } from 'date-fns';

const Vaccination = () => {
  const { batches, vaccines, vaccinationRecords, addVaccine, addVaccinationRecord } = useAppContext();

  const [isVaccineDialogOpen, setIsVaccineDialogOpen] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);

  const [vaccineForm, setVaccineForm] = useState({
    name: '',
    description: '',
    intervalDays: 0,
  });

  const [recordForm, setRecordForm] = useState({
    batchId: '',
    vaccineId: '',
    date: new Date().toISOString().split('T')[0],
    nextScheduledDate: '',
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
      id: crypto.randomUUID(), // Add id
      name: vaccineForm.name,
      description: vaccineForm.description,
      intervalDays: vaccineForm.intervalDays,
    });

    setVaccineForm({
      name: '',
      description: '',
      intervalDays: 0,
    });

    setIsVaccineDialogOpen(false);
    toast.success('Vaccine added successfully');
  };

  const handleAddRecord = () => {
    if (!recordForm.batchId || !recordForm.vaccineId) {
      toast.error('Please select a batch and vaccine');
      return;
    }

    addVaccinationRecord({
      id: crypto.randomUUID(), // Add id
      batchId: recordForm.batchId,
      vaccineId: recordForm.vaccineId,
      date: recordForm.date,
      nextScheduledDate: recordForm.nextScheduledDate,
      notes: recordForm.notes,
    });

    setRecordForm({
      batchId: '',
      vaccineId: '',
      date: new Date().toISOString().split('T')[0],
      nextScheduledDate: '',
      notes: '',
    });

    setIsRecordDialogOpen(false);
    toast.success('Vaccination record added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vaccination Management</h1>
        <div className="flex gap-2">
          <Dialog open={isVaccineDialogOpen} onOpenChange={setIsVaccineDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vaccine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Vaccine</DialogTitle>
                <DialogDescription>
                  Enter details for the new vaccine
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
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsVaccineDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVaccine}>
                  Add Vaccine
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Vaccination Record</DialogTitle>
                <DialogDescription>
                  Record a new vaccination for a batch
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batchId" className="text-right">Batch</Label>
                  <Select onValueChange={(value) => setRecordForm({ ...recordForm, batchId: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a batch" />
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
                      <SelectValue placeholder="Select a vaccine" />
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
                  <Label htmlFor="nextScheduledDate" className="text-right">Next Scheduled Date</Label>
                  <Input
                    id="nextScheduledDate"
                    name="nextScheduledDate"
                    type="date"
                    value={recordForm.nextScheduledDate}
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
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecord}>
                  Add Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vaccination Records</CardTitle>
          <CardDescription>Manage vaccination records for your batches</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Vaccine</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Next Scheduled Date</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vaccinationRecords.length > 0 ? (
                vaccinationRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {batches.find(batch => batch.id === record.batchId)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {vaccines.find(vaccine => vaccine.id === record.vaccineId)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.nextScheduledDate || '-'}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(record.date), {
                        addSuffix: true,
                      })}
                    </TableCell>
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
    </div>
  );
};

export default Vaccination;

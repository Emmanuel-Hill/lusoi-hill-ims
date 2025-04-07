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
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, parseISO } from 'date-fns';

const Vaccination = () => {
  const { vaccines, addVaccine, batches, vaccinationRecords, addVaccinationRecord } = useAppContext();
  
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
    notes: '',
    nextScheduledDate: ''
  });
  
  const handleVaccineChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVaccineForm({
      ...vaccineForm,
      [name]: name === 'intervalDays' ? Number(value) : value,
    });
  };
  
  const handleRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecordForm({
      ...recordForm,
      [name]: value,
    });
  };
  
  const handleVaccineSubmit = () => {
    if (!vaccineForm.name) {
      toast.error('Please provide a vaccine name');
      return;
    }
    
    addVaccine(vaccineForm);
    setVaccineForm({
      name: '',
      description: '',
      intervalDays: 0,
    });
    setIsVaccineDialogOpen(false);
    toast.success('Vaccine added successfully');
  };
  
  const handleRecordSubmit = () => {
    if (!recordForm.batchId || !recordForm.vaccineId || !recordForm.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const selectedVaccine = vaccines.find(vaccine => vaccine.id === recordForm.vaccineId);
    let nextDate = '';
    
    if (selectedVaccine && selectedVaccine.intervalDays) {
      nextDate = format(
        addDays(parseISO(recordForm.date), selectedVaccine.intervalDays),
        'yyyy-MM-dd'
      );
    }
    
    addVaccinationRecord({
      ...recordForm,
      nextScheduledDate: nextDate
    });
    
    setRecordForm({
      batchId: '',
      vaccineId: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      nextScheduledDate: ''
    });
    
    setIsRecordDialogOpen(false);
    toast.success('Vaccination record added successfully');
  };
  
  const getBatchName = (id: string) => {
    const batch = batches.find(b => b.id === id);
    return batch ? batch.name : 'Unknown';
  };
  
  const getVaccineName = (id: string) => {
    const vaccine = vaccines.find(v => v.id === id);
    return vaccine ? vaccine.name : 'Unknown';
  };
  
  const calculateNextScheduledDate = () => {
    const selectedVaccine = vaccines.find(vaccine => vaccine.id === recordForm.vaccineId);
    if (selectedVaccine && selectedVaccine.intervalDays && recordForm.date) {
      const nextDate = format(
        addDays(parseISO(recordForm.date), selectedVaccine.intervalDays),
        'yyyy-MM-dd'
      );
      setRecordForm({
        ...recordForm,
        nextScheduledDate: nextDate
      });
    }
  };
  
  const handleVaccineSelection = (value: string) => {
    setRecordForm({
      ...recordForm,
      vaccineId: value,
    }, () => {
      if (recordForm.date) {
        calculateNextScheduledDate();
      }
    });
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecordForm({
      ...recordForm,
      date: e.target.value,
    });
    
    if (recordForm.vaccineId) {
      calculateNextScheduledDate();
    }
  };
  
  // Calculate upcoming vaccinations (next 30 days)
  const upcomingVaccinations = vaccinationRecords
    .filter(record => record.nextScheduledDate)
    .filter(record => {
      const nextDate = parseISO(record.nextScheduledDate!);
      const today = new Date();
      const thirtyDaysFromNow = addDays(today, 30);
      return nextDate >= today && nextDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => {
      return parseISO(a.nextScheduledDate!).getTime() - parseISO(b.nextScheduledDate!).getTime();
    });
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Vaccination Management</h1>
      
      <Tabs defaultValue="vaccines" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
          <TabsTrigger value="records">Vaccination Records</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Vaccinations</TabsTrigger>
        </TabsList>
        
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
                    Create a new vaccine type for your vaccination program.
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
                      onChange={handleVaccineChange}
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
                      onChange={handleVaccineChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="intervalDays" className="text-right">
                      Interval (days)
                    </Label>
                    <Input
                      id="intervalDays"
                      name="intervalDays"
                      type="number"
                      min="0"
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
                  <Button onClick={handleVaccineSubmit}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Vaccines</CardTitle>
              <CardDescription>Manage your vaccination program</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaccine Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Interval (days)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccines.length > 0 ? (
                    vaccines.map((vaccine) => (
                      <TableRow key={vaccine.id}>
                        <TableCell className="font-medium">{vaccine.name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{vaccine.description || '-'}</TableCell>
                        <TableCell>{vaccine.intervalDays} days</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No vaccines added yet. Start by adding a vaccine.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vaccination Records Tab */}
        <TabsContent value="records" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vaccination Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Vaccination Record</DialogTitle>
                  <DialogDescription>
                    Record a vaccination event.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="batchId" className="text-right">
                      Batch
                    </Label>
                    <Select 
                      onValueChange={(value) => setRecordForm({...recordForm, batchId: value})}
                    >
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
                    <Label htmlFor="vaccineId" className="text-right">
                      Vaccine
                    </Label>
                    <Select 
                      onValueChange={handleVaccineSelection}
                    >
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
                  {recordForm.vaccineId && recordForm.date && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nextScheduledDate" className="text-right">
                        Next Date
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="nextScheduledDate"
                          name="nextScheduledDate"
                          type="date"
                          value={recordForm.nextScheduledDate}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Auto-calculated based on vaccine interval
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
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
                  <Button onClick={handleRecordSubmit}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Records</CardTitle>
              <CardDescription>History of vaccination events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Next Scheduled Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccinationRecords.length > 0 ? (
                    vaccinationRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{getBatchName(record.batchId)}</TableCell>
                        <TableCell>{getVaccineName(record.vaccineId)}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.nextScheduledDate || '-'}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No vaccination records added yet. Start by recording a vaccination.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Upcoming Vaccinations Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Vaccinations (Next 30 Days)</CardTitle>
              <CardDescription>Scheduled vaccinations for your flocks</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingVaccinations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingVaccinations.map(record => (
                    <div key={record.id} className="flex items-start p-4 border rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{getVaccineName(record.vaccineId)}</h4>
                            <p className="text-sm text-muted-foreground">Batch: {getBatchName(record.batchId)}</p>
                          </div>
                          <Badge>{record.nextScheduledDate}</Badge>
                        </div>
                        {record.notes && (
                          <p className="text-sm mt-2 text-muted-foreground">{record.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Upcoming Vaccinations</h3>
                  <p className="text-muted-foreground mt-1">There are no scheduled vaccinations for the next 30 days.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vaccination;

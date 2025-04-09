
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ReportButton from '@/components/ReportButton';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@/utils/formatUtils';

// Type for the calendar events
interface Event {
  date: Date;
  type: 'egg-collection' | 'feed' | 'vaccination' | 'sale';
  title: string;
  detail: string;
}

// Type for the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const CalendarPage = () => {
  const { eggCollections, feedConsumption, vaccinationRecords, sales, batches, feedTypes, vaccines } = useAppContext();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Generate calendar events
  const generateEvents = (): Event[] => {
    const events: Event[] = [];

    // Add egg collections to events
    eggCollections.forEach(collection => {
      events.push({
        date: new Date(collection.date),
        type: 'egg-collection',
        title: 'Egg Collection',
        detail: `Collected ${collection.wholeCount + collection.brokenCount} eggs`
      });
    });

    // Add feed consumption to events
    feedConsumption.forEach(feed => {
      const feedType = feedTypes.find(f => f.id === feed.feedTypeId);
      events.push({
        date: new Date(feed.date),
        type: 'feed',
        title: 'Feed',
        detail: `${feed.quantityKg}kg of ${feedType?.name || 'feed'}`
      });
    });

    // Add vaccinations to events
    vaccinationRecords.forEach(record => {
      const vaccine = vaccines.find(v => v.id === record.vaccineId);
      events.push({
        date: new Date(record.date),
        type: 'vaccination',
        title: 'Vaccination',
        detail: `${vaccine?.name || 'Vaccine'} administered`
      });
    });

    // Add sales to events
    sales.forEach(sale => {
      events.push({
        date: new Date(sale.date),
        type: 'sale',
        title: 'Sale',
        detail: `$${sale.totalAmount.toFixed(2)} sale`
      });
    });

    return events;
  };

  const events = generateEvents();

  // Filter events by the selected day and type
  const filteredEvents = events.filter(event => {
    const sameDay = isSameDay(event.date, date);
    return sameDay && (eventFilter === 'all' || event.type === eventFilter);
  });

  // Get events for a specific day (for the calendar display)
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  // Calendar day render function
  const renderDay = (day: Date) => {
    const dayEvents = getEventsForDay(day);
    const hasEggCollection = dayEvents.some(event => event.type === 'egg-collection');
    const hasFeed = dayEvents.some(event => event.type === 'feed');
    const hasVaccination = dayEvents.some(event => event.type === 'vaccination');
    const hasSale = dayEvents.some(event => event.type === 'sale');

    return (
      <div className="relative w-full h-full">
        <time dateTime={format(day, 'yyyy-MM-dd')} className="text-sm">
          {format(day, 'd')}
        </time>
        <div className="flex flex-wrap gap-0.5 mt-1">
          {hasEggCollection && <div className="w-2 h-2 rounded-full bg-green-500" />}
          {hasFeed && <div className="w-2 h-2 rounded-full bg-orange-500" />}
          {hasVaccination && <div className="w-2 h-2 rounded-full bg-blue-500" />}
          {hasSale && <div className="w-2 h-2 rounded-full bg-purple-500" />}
        </div>
      </div>
    );
  };

  // Generate monthly report data
  const generateMonthlyReportData = () => {
    // Get all days in the current month
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Prepare report data
    return monthDays.map(day => {
      const dayEvents = getEventsForDay(day);
      
      const eggCollectionEvents = dayEvents.filter(event => event.type === 'egg-collection');
      const feedEvents = dayEvents.filter(event => event.type === 'feed');
      const vaccinationEvents = dayEvents.filter(event => event.type === 'vaccination');
      const saleEvents = dayEvents.filter(event => event.type === 'sale');
      
      return {
        date: format(day, 'yyyy-MM-dd'),
        eggCollections: eggCollectionEvents.length,
        eggDetails: eggCollectionEvents.map(e => e.detail).join('; '),
        feedEvents: feedEvents.length,
        feedDetails: feedEvents.map(e => e.detail).join('; '),
        vaccinationEvents: vaccinationEvents.length,
        vaccinationDetails: vaccinationEvents.map(e => e.detail).join('; '),
        salesEvents: saleEvents.length,
        salesDetails: saleEvents.map(e => e.detail).join('; '),
      };
    }).filter(day => 
      day.eggCollections > 0 || 
      day.feedEvents > 0 || 
      day.vaccinationEvents > 0 || 
      day.salesEvents > 0
    );
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      const data = generateMonthlyReportData();
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Calendar');
      
      // Generate file name with current month
      const fileName = `calendar_report_${format(date, 'yyyy-MM')}.xlsx`;
      
      XLSX.writeFile(workbook, fileName);
      toast.success('Calendar report exported to Excel successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export calendar report');
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const data = generateMonthlyReportData();
      
      // Initialize PDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(`Calendar Report - ${format(date, 'MMMM yyyy')}`, 14, 22);
      
      // Add generation date
      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 30);
      
      // Define columns for the table
      const columns = [
        { header: 'Date', dataKey: 'date' },
        { header: 'Egg Collections', dataKey: 'eggDetails' },
        { header: 'Feed Events', dataKey: 'feedDetails' },
        { header: 'Vaccinations', dataKey: 'vaccinationDetails' },
        { header: 'Sales', dataKey: 'salesDetails' }
      ];
      
      // Create table rows
      const rows = data.map(day => [
        format(new Date(day.date), 'MMM dd, yyyy'),
        day.eggDetails || '-',
        day.feedDetails || '-',
        day.vaccinationDetails || '-',
        day.salesDetails || '-'
      ]);
      
      // Add the table to PDF
      doc.autoTable({
        head: [columns.map(col => col.header)],
        body: rows,
        startY: 40,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [60, 108, 64] } // Lusoi green color
      });
      
      // Save the PDF
      const fileName = `calendar_report_${format(date, 'yyyy-MM')}.pdf`;
      doc.save(fileName);
      
      toast.success('Calendar report exported to PDF successfully');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export calendar report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <div className="flex gap-2">
          <ReportButton
            onExcelExport={exportToExcel}
            onPdfExport={exportToPDF}
          />
          <Select
            value={view}
            onValueChange={(value: 'month' | 'list') => setView(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={eventFilter}
            onValueChange={setEventFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="egg-collection">Egg Collections</SelectItem>
              <SelectItem value="feed">Feed</SelectItem>
              <SelectItem value="vaccination">Vaccinations</SelectItem>
              <SelectItem value="sale">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {view === 'month' ? (
        <Card>
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              components={{
                Day: ({ date: dayDate }) => renderDay(dayDate),
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Events - {format(date, 'MMMM yyyy')}</CardTitle>
            <CardDescription>
              All farm activities for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Badge className="bg-green-500">Egg Collection</Badge>
              <Badge className="bg-orange-500">Feed</Badge>
              <Badge className="bg-blue-500">Vaccination</Badge>
              <Badge className="bg-purple-500">Sale</Badge>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(event.date, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge className={
                          event.type === 'egg-collection' ? 'bg-green-500' : 
                          event.type === 'feed' ? 'bg-orange-500' : 
                          event.type === 'vaccination' ? 'bg-blue-500' : 
                          'bg-purple-500'
                        }>
                          {event.title}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.detail}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      No events for this day
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;

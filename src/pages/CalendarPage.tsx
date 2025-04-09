import React, { useState, useEffect } from 'react';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
} from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Circle,
  Egg,
  Package,
  Syringe,
} from 'lucide-react';
import ReportButton from '@/components/ReportButton';

type CalendarEvent = {
  id: string;
  date: Date;
  title: string;
  type: 'egg' | 'feed' | 'vaccination' | 'sale';
  description?: string;
};

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

const CalendarPage = () => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayOfMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  const {
    eggCollections,
    feedConsumption,
    vaccinationRecords,
    sales,
    batches
  } = useAppContext();
  
  useEffect(() => {
    // Create calendar events from different data sources
    const events: CalendarEvent[] = [];
    
    // Egg collection events
    eggCollections.forEach(collection => {
      const date = parseISO(collection.date);
      const batch = batches.find(b => b.id === collection.batchId);
      events.push({
        id: collection.id,
        date,
        title: 'Egg Collection',
        description: `${collection.wholeCount + collection.brokenCount} eggs collected from ${batch?.name || 'Unknown batch'}`,
        type: 'egg'
      });
    });
    
    // Feed consumption events
    feedConsumption.forEach(feed => {
      const date = parseISO(feed.date);
      const batch = batches.find(b => b.id === feed.batchId);
      events.push({
        id: feed.id,
        date,
        title: 'Feed Distribution',
        description: `${feed.quantityKg}kg of feed given to ${batch?.name || 'Unknown batch'} (${feed.timeOfDay})`,
        type: 'feed'
      });
    });
    
    // Vaccination events
    vaccinationRecords.forEach(record => {
      const date = parseISO(record.date);
      const batch = batches.find(b => b.id === record.batchId);
      events.push({
        id: record.id,
        date,
        title: 'Vaccination',
        description: `Vaccinated ${batch?.name || 'Unknown batch'}`,
        type: 'vaccination'
      });
    });
    
    // Sales events
    sales.forEach(sale => {
      const date = parseISO(sale.date);
      events.push({
        id: sale.id,
        date,
        title: 'Sale',
        description: `$${sale.totalAmount.toFixed(2)} sale`,
        type: 'sale'
      });
    });
    
    setCalendarEvents(events);
  }, [eggCollections, feedConsumption, vaccinationRecords, sales, batches]);
  
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayOfMonth)),
    end: endOfWeek(endOfMonth(firstDayOfMonth))
  });
  
  const previousMonth = () => {
    const firstDayOfPreviousMonth = add(firstDayOfMonth, { months: -1 });
    setCurrentMonth(format(firstDayOfPreviousMonth, 'MMM-yyyy'));
  };
  
  const nextMonth = () => {
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrentMonth(format(firstDayOfNextMonth, 'MMM-yyyy'));
  };
  
  const eventsForSelectedDay = calendarEvents.filter(event => 
    isEqual(event.date, selectedDay)
  );
  
  // Add calendar report generation handler
  const handleGenerateReport = (format: 'excel' | 'pdf') => {
    try {
      // Create a report specifically for calendar events in the current month
      const firstDay = startOfMonth(firstDayOfMonth);
      const lastDay = endOfMonth(firstDayOfMonth);
      
      // Filter events for current month
      const monthEvents = calendarEvents.filter(event => {
        const eventDate = event.date;
        return eventDate >= firstDay && eventDate <= lastDay;
      });
      
      // Get events by type
      const eggEvents = monthEvents.filter(event => event.type === 'egg').length;
      const feedEvents = monthEvents.filter(event => event.type === 'feed').length;
      const vaccinationEvents = monthEvents.filter(event => event.type === 'vaccination').length;
      const saleEvents = monthEvents.filter(event => event.type === 'sale').length;
      
      // Create summary report data
      const reportData = [
        {
          month: format(firstDayOfMonth, 'MMMM yyyy'),
          totalEvents: monthEvents.length,
          eggCollections: eggEvents,
          feedDistributions: feedEvents,
          vaccinations: vaccinationEvents,
          sales: saleEvents
        }
      ];
      
      // Use XLSX to export to Excel
      if (format === 'excel') {
        const XLSX = require('xlsx');
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Calendar Summary');
        
        // Add event details sheet
        const eventsData = monthEvents.map(event => ({
          date: format(event.date, 'yyyy-MM-dd'),
          title: event.title,
          type: event.type,
          description: event.description || ''
        }));
        const eventsWorksheet = XLSX.utils.json_to_sheet(eventsData);
        XLSX.utils.book_append_sheet(workbook, eventsWorksheet, 'Events');
        
        // Generate filename and save
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        XLSX.writeFile(workbook, `calendar_report_${currentDate}.xlsx`);
      } else {
        // Use jsPDF for PDF export
        const jsPDF = require('jspdf');
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Calendar Report', 14, 20);
        doc.setFontSize(12);
        doc.text(`Month: ${format(firstDayOfMonth, 'MMMM yyyy')}`, 14, 30);
        doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 37);
        
        // Add summary table
        doc.setFontSize(14);
        doc.text('Monthly Summary', 14, 50);
        
        doc.setFontSize(10);
        doc.text('Total Events:', 20, 60);
        doc.text(String(monthEvents.length), 80, 60);
        doc.text('Egg Collections:', 20, 67);
        doc.text(String(eggEvents), 80, 67);
        doc.text('Feed Distributions:', 20, 74);
        doc.text(String(feedEvents), 80, 74);
        doc.text('Vaccinations:', 20, 81);
        doc.text(String(vaccinationEvents), 80, 81);
        doc.text('Sales:', 20, 88);
        doc.text(String(saleEvents), 80, 88);
        
        // Events list
        doc.setFontSize(14);
        doc.text('Events List', 14, 100);
        
        let yPos = 110;
        
        // Column headers
        doc.setFontSize(10);
        doc.text('Date', 20, yPos);
        doc.text('Type', 60, yPos);
        doc.text('Title', 100, yPos);
        yPos += 7;
        
        // Add events (limited to avoid overflow)
        const eventsToShow = monthEvents.slice(0, 20);
        eventsToShow.forEach(event => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
            // Add column headers on new page
            doc.text('Date', 20, yPos);
            doc.text('Type', 60, yPos);
            doc.text('Title', 100, yPos);
            yPos += 7;
          }
          
          doc.text(format(event.date, 'MMM dd, yyyy'), 20, yPos);
          doc.text(event.type, 60, yPos);
          doc.text(event.title, 100, yPos);
          yPos += 7;
        });
        
        // If there are more events than we showed, add a note
        if (monthEvents.length > eventsToShow.length) {
          yPos += 7;
          doc.text(`* ${monthEvents.length - eventsToShow.length} more events not shown`, 20, yPos);
        }
        
        // Save PDF
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        doc.save(`calendar_report_${currentDate}.pdf`);
      }
      
      toast.success(`Calendar report generated successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <ReportButton 
          onExcelExport={() => handleGenerateReport('excel')} 
          onPdfExport={() => handleGenerateReport('pdf')} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="md:col-span-3">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle>{format(firstDayOfMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Farm activity planner and scheduler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px mt-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              
              {days.map((day, dayIdx) => {
                const eventsOnDay = calendarEvents.filter(event => 
                  isEqual(event.date, day)
                );
                
                const eventTypes = new Set(eventsOnDay.map(event => event.type));
                
                return (
                  <div
                    key={day.toString()}
                    className={classNames(
                      'min-h-[6rem] border border-border',
                      !isSameMonth(day, firstDayOfMonth) && 'bg-muted/30 text-muted-foreground',
                      isSameMonth(day, firstDayOfMonth) && 'bg-card',
                      'p-2'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm',
                        isEqual(day, selectedDay) && 'bg-primary text-primary-foreground',
                        isToday(day) && !isEqual(day, selectedDay) && 'border border-primary text-primary',
                        'hover:bg-muted'
                      )}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>
                        {format(day, 'd')}
                      </time>
                    </button>
                    
                    <div className="h-1"></div> {/* Spacing */}
                    
                    <div className="space-y-1">
                      {eventTypes.has('egg') && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Egg className="h-3 w-3" />
                          <span>
                            {eventsOnDay.filter(e => e.type === 'egg').length} collections
                          </span>
                        </div>
                      )}
                      
                      {eventTypes.has('feed') && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <Package className="h-3 w-3" />
                          <span>
                            {eventsOnDay.filter(e => e.type === 'feed').length} feeds
                          </span>
                        </div>
                      )}
                      
                      {eventTypes.has('vaccination') && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Syringe className="h-3 w-3" />
                          <span>
                            {eventsOnDay.filter(e => e.type === 'vaccination').length} vaccinations
                          </span>
                        </div>
                      )}
                      
                      {eventTypes.has('sale') && (
                        <div className="flex items-center gap-1 text-xs text-purple-600">
                          <Circle className="h-3 w-3" />
                          <span>
                            {eventsOnDay.filter(e => e.type === 'sale').length} sales
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-sm">Egg Collection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                <span className="text-sm">Feed Distribution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm">Vaccination</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm">Sale</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Selected day events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{format(selectedDay, 'MMMM d, yyyy')}</span>
            </CardTitle>
            <CardDescription>
              {isToday(selectedDay) ? "Today's events" : "Events for selected day"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDay.length > 0 ? (
              <div className="space-y-4">
                {eventsForSelectedDay.map(event => (
                  <div key={event.id} className="border rounded-md p-3 bg-card">
                    <div className="flex items-center">
                      {event.type === 'egg' && <Egg className="h-4 w-4 text-green-600 mr-2" />}
                      {event.type === 'feed' && <Package className="h-4 w-4 text-amber-600 mr-2" />}
                      {event.type === 'vaccination' && <Syringe className="h-4 w-4 text-blue-600 mr-2" />}
                      {event.type === 'sale' && <Circle className="h-4 w-4 text-purple-600 mr-2" />}
                      <h4 className="font-medium">{event.title}</h4>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-center">
                <div className="text-muted-foreground">
                  <p>No events scheduled for this day</p>
                  <p className="text-sm mt-1">
                    Activities will appear here when scheduled
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;

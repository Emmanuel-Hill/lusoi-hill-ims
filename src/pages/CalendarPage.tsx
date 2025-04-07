
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, parseISO, addDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarIcon, Egg, Utensils, Syringe, Truck } from "lucide-react";

// Helper function to categorize events
interface CalendarEvent {
  id: string;
  date: Date;
  type: 'egg-collection' | 'feed' | 'vaccination' | 'delivery';
  title: string;
  details: string;
  relatedId: string;
}

const CalendarPage = () => {
  const { 
    eggCollections, 
    feedConsumption, 
    vaccinationRecords, 
    orders,
    batches,
    feedTypes
  } = useAppContext();
  
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  
  // Generate calendar events from various data sources
  const getEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    // Egg collections
    eggCollections.forEach(collection => {
      const batch = batches.find(b => b.id === collection.batchId);
      events.push({
        id: `egg-${collection.id}`,
        date: parseISO(collection.date),
        type: 'egg-collection',
        title: `Egg Collection: ${batch?.name || 'Unknown Batch'}`,
        details: `Whole: ${collection.wholeCount}, Broken: ${collection.brokenCount}`,
        relatedId: collection.id
      });
    });
    
    // Feed consumption events
    feedConsumption.forEach(consumption => {
      const batch = batches.find(b => b.id === consumption.batchId);
      const feed = feedTypes.find(f => f.id === consumption.feedTypeId);
      events.push({
        id: `feed-${consumption.id}`,
        date: parseISO(consumption.date),
        type: 'feed',
        title: `Feed: ${feed?.name || 'Unknown Feed'}`,
        details: `${consumption.quantityKg}kg for ${batch?.name || 'Unknown Batch'} (${consumption.timeOfDay})`,
        relatedId: consumption.id
      });
    });
    
    // Vaccination events (past and upcoming)
    vaccinationRecords.forEach(record => {
      const batch = batches.find(b => b.id === record.batchId);
      // Past vaccination
      events.push({
        id: `vac-${record.id}`,
        date: parseISO(record.date),
        type: 'vaccination',
        title: `Vaccination: ${batch?.name || 'Unknown Batch'}`,
        details: record.notes || 'No details provided',
        relatedId: record.id
      });
      
      // Future vaccination if scheduled
      if (record.nextScheduledDate) {
        events.push({
          id: `vac-next-${record.id}`,
          date: parseISO(record.nextScheduledDate),
          type: 'vaccination',
          title: `Scheduled Vaccination: ${batch?.name || 'Unknown Batch'}`,
          details: `Follow-up vaccination`,
          relatedId: record.id
        });
      }
    });
    
    // Delivery events (orders)
    orders.forEach(order => {
      events.push({
        id: `order-${order.id}`,
        date: parseISO(order.deliveryDate),
        type: 'delivery',
        title: `Delivery: ${order.deliveryLocation}`,
        details: `Contact: ${order.contactPerson} (${order.contactNumber || 'No number'})`,
        relatedId: order.id
      });
    });
    
    return events;
  };
  
  const events = getEvents();
  
  // Filter events for selected day
  const selectedDayEvents = events.filter(event => 
    isSameDay(event.date, selectedDay)
  );
  
  // Get events for the next 7 days
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    return events
      .filter(event => {
        return event.date >= today && event.date <= nextWeek;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  const upcomingEvents = getUpcomingEvents();
  
  // Function to render event indicator dots on calendar
  const getDayClassNames = (day: Date) => {
    const eventTypes = events
      .filter(event => isSameDay(event.date, day))
      .map(event => event.type);
    
    // Return class names for styling
    let classes = '';
    
    if (eventTypes.includes('egg-collection')) {
      classes += 'bg-green-500 ';
    }
    
    if (eventTypes.includes('feed')) {
      classes += 'bg-amber-500 ';
    }
    
    if (eventTypes.includes('vaccination')) {
      classes += 'bg-red-500 ';
    }
    
    if (eventTypes.includes('delivery')) {
      classes += 'bg-blue-500 ';
    }
    
    return classes;
  };
  
  // Function to get icon for event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'egg-collection':
        return <Egg className="h-4 w-4" />;
      case 'feed':
        return <Utensils className="h-4 w-4" />;
      case 'vaccination':
        return <Syringe className="h-4 w-4" />;
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };
  
  // Function to get color for event type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'egg-collection':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'feed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'vaccination':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Farm Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>View and manage farm activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  setDate(newDate);
                  setSelectedDay(newDate);
                }
              }}
              className="rounded-md border shadow"
              components={{
                DayContent: ({ date, outsideCurrentMonth }) => {
                  if (outsideCurrentMonth) return <span>{date.getDate()}</span>;
                  
                  const dayEvents = events.filter(event => isSameDay(event.date, date));
                  
                  if (dayEvents.length === 0) {
                    return <span>{date.getDate()}</span>;
                  }
                  
                  const eventTypes = [...new Set(dayEvents.map(e => e.type))];
                  
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{date.getDate()}</span>
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                        {eventTypes.map((type, i) => (
                          <div 
                            key={`${date.toISOString()}-${type}`}
                            className={`h-1.5 w-1.5 rounded-full ${
                              type === 'egg-collection' ? 'bg-green-500' :
                              type === 'feed' ? 'bg-amber-500' :
                              type === 'vaccination' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
        
        {/* Event details section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Events for {format(selectedDay, 'MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                Activities scheduled for this day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayEvents.map((event) => (
                    <div 
                      key={event.id}
                      className={`p-3 rounded-md border ${getEventColor(event.type)}`}
                    >
                      <div className="flex items-center space-x-2">
                        {getEventIcon(event.type)}
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <p className="text-sm mt-1">{event.details}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No events scheduled for this day.
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-start p-2 hover:bg-muted/50 rounded-md transition-colors"
                    >
                      <div className={`p-2 rounded-full mr-2 ${
                        event.type === 'egg-collection' ? 'bg-green-100' :
                        event.type === 'feed' ? 'bg-amber-100' :
                        event.type === 'vaccination' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No upcoming events in the next 7 days.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Event Legend</CardTitle>
          <CardDescription>Types of events in the calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Egg Collection</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm">Feed</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Vaccination</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Delivery</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;

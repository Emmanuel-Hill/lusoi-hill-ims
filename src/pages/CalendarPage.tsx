
import React, { useState } from 'react';
import { isSameDay } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import { CalendarEvent } from '@/components/calendar/types';
import CalendarToolbar from '@/components/calendar/CalendarToolbar';
import CalendarMonthView from '@/components/calendar/CalendarMonthView';
import CalendarListView from '@/components/calendar/CalendarListView';
import { generateEvents } from '@/components/calendar/CalendarEventGenerator';
import { exportToExcel, exportToPDF } from '@/components/calendar/calendarUtils';

const CalendarPage = () => {
  const { eggCollections, feedConsumption, vaccinationRecords, sales, feedTypes, vaccines } = useAppContext();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Generate all calendar events
  const allEvents: CalendarEvent[] = generateEvents(
    eggCollections,
    feedConsumption,
    vaccinationRecords,
    sales,
    feedTypes,
    vaccines
  );

  // Filter events by the selected day and type
  const filteredEvents = allEvents.filter(event => {
    const sameDay = isSameDay(event.date, date);
    return sameDay && (eventFilter === 'all' || event.type === eventFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <CalendarToolbar 
          view={view}
          onViewChange={(newView) => setView(newView)}
          eventFilter={eventFilter}
          onEventFilterChange={setEventFilter}
          onExcelExport={() => exportToExcel(date, allEvents)}
          onPdfExport={() => exportToPDF(date, allEvents)}
        />
      </div>

      {view === 'month' ? (
        <CalendarMonthView 
          date={date} 
          onDateChange={setDate} 
          events={allEvents} 
        />
      ) : (
        <CalendarListView 
          date={date} 
          events={filteredEvents} 
        />
      )}
    </div>
  );
};

export default CalendarPage;


import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import CalendarDayView from './CalendarDayView';
import { CalendarEvent } from './types';

interface CalendarMonthViewProps {
  date: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
}

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({ 
  date, 
  onDateChange, 
  events 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && onDateChange(newDate)}
          className="rounded-md border"
          components={{
            Day: ({ date: dayDate }) => (
              <CalendarDayView day={dayDate} events={events} />
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarMonthView;

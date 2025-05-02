
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { format } from 'date-fns';
import CalendarLegend from './CalendarLegend';
import CalendarEventsList from './CalendarEventsList';
import { CalendarEvent } from './types';

interface CalendarListViewProps {
  date: Date;
  events: CalendarEvent[];
}

const CalendarListView: React.FC<CalendarListViewProps> = ({ date, events }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Events - {format(date, 'MMMM yyyy')}</CardTitle>
        <CardDescription>
          All farm activities for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CalendarLegend />
        <CalendarEventsList events={events} />
      </CardContent>
    </Card>
  );
};

export default CalendarListView;

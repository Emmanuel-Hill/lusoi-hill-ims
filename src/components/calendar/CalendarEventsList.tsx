
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from './types';

interface CalendarEventsListProps {
  events: CalendarEvent[];
}

const CalendarEventsList: React.FC<CalendarEventsListProps> = ({ events }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length > 0 ? (
          events.map((event, index) => (
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
  );
};

export default CalendarEventsList;

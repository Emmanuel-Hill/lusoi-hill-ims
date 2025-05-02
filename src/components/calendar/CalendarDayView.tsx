
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { CalendarEvent } from './types';

interface CalendarDayViewProps {
  day: Date;
  events: CalendarEvent[];
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({ day, events }) => {
  // Get events for the specific day
  const dayEvents = events.filter(event => isSameDay(event.date, day));
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

export default CalendarDayView;

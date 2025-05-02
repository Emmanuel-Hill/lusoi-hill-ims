
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReportButton from '@/components/ReportButton';

interface CalendarToolbarProps {
  view: 'month' | 'list';
  onViewChange: (view: 'month' | 'list') => void;
  eventFilter: string;
  onEventFilterChange: (filter: string) => void;
  onExcelExport: () => void;
  onPdfExport: () => void;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  view,
  onViewChange,
  eventFilter,
  onEventFilterChange,
  onExcelExport,
  onPdfExport
}) => {
  return (
    <div className="flex gap-2">
      <ReportButton
        onExcelExport={onExcelExport}
        onPdfExport={onPdfExport}
      />
      
      <Select
        value={view}
        onValueChange={(value: string) => onViewChange(value as 'month' | 'list')}
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
        onValueChange={onEventFilterChange}
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
  );
};

export default CalendarToolbar;

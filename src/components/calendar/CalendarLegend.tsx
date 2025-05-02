
import React from 'react';
import { Badge } from '@/components/ui/badge';

const CalendarLegend: React.FC = () => {
  return (
    <div className="flex space-x-2 mb-4">
      <Badge className="bg-green-500">Egg Collection</Badge>
      <Badge className="bg-orange-500">Feed</Badge>
      <Badge className="bg-blue-500">Vaccination</Badge>
      <Badge className="bg-purple-500">Sale</Badge>
    </div>
  );
};

export default CalendarLegend;

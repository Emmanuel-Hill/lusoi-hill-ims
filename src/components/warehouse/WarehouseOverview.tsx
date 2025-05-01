
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, ArrowDown, ArrowUp } from 'lucide-react';

const WarehouseOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-gray-600" />
            </div>
            Total Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0</div>
          <p className="text-xs text-muted-foreground mt-1">
            items in stock
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowDown className="h-4 w-4 text-gray-600" />
            </div>
            Received
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0</div>
          <p className="text-xs text-muted-foreground mt-1">
            items this month
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowUp className="h-4 w-4 text-gray-600" />
            </div>
            Dispatched
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">0</div>
          <p className="text-xs text-muted-foreground mt-1">
            items this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseOverview;


import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, ArrowDown, ArrowUp } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const WarehouseOverview: React.FC = () => {
  const { warehouse } = useAppContext();
  
  // Calculate totals from warehouse data
  const totalItems = warehouse?.inventory?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const receivedItems = warehouse?.receiving?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const dispatchedItems = warehouse?.dispatch?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-lusoi-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-lusoi-500" />
            </div>
            Total Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{totalItems}</div>
          <p className="text-xs text-gray-500 mt-1">
            items in stock
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-lusoi-100 flex items-center justify-center">
              <ArrowDown className="h-4 w-4 text-lusoi-500" />
            </div>
            Received
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{receivedItems}</div>
          <p className="text-xs text-gray-500 mt-1">
            items this month
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm bg-white border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-lusoi-100 flex items-center justify-center">
              <ArrowUp className="h-4 w-4 text-lusoi-500" />
            </div>
            Dispatched
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{dispatchedItems}</div>
          <p className="text-xs text-gray-500 mt-1">
            items this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseOverview;

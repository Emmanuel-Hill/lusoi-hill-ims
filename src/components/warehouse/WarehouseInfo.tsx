
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WarehouseInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Warehouse Management</CardTitle>
        <CardDescription>
          Understanding the warehouse workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-green-500">1</Badge>
              <h3 className="font-medium">Receiving</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Record all items coming into the warehouse from various sources, including farm production, 
              purchased supplies, and returned items.
            </p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-500">2</Badge>
              <h3 className="font-medium">Storage & Inventory</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage inventory levels, track item locations, monitor expiration dates, and ensure proper 
              storage conditions for all warehouse items.
            </p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-orange-500">3</Badge>
              <h3 className="font-medium">Dispatch</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Record all outgoing items, whether for sales, internal farm use, or transfers to other 
              facilities, maintaining an accurate chain of custody.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseInfo;

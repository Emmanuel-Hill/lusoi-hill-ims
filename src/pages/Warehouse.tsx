
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import ReportButton from '@/components/ReportButton';
import WarehouseOverview from '@/components/warehouse/WarehouseOverview';
import InventoryTable from '@/components/warehouse/InventoryTable';
import ReceivingTable from '@/components/warehouse/ReceivingTable';
import DispatchTable from '@/components/warehouse/DispatchTable';
import WarehouseInfo from '@/components/warehouse/WarehouseInfo';

const Warehouse = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Warehouse Management</h1>
        <div className="flex gap-2">
          <ReportButton
            onExcelExport={() => toast.info('Excel report functionality will be available soon')}
            onPdfExport={() => toast.info('PDF report functionality will be available soon')}
          />
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="receiving">Receiving</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
        </TabsList>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>
                Manage your warehouse inventory items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WarehouseOverview />
              <InventoryTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Receiving Tab */}
        <TabsContent value="receiving" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receiving Log</CardTitle>
              <CardDescription>
                Track all items received into the warehouse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Received Items
                </Button>
              </div>
              <ReceivingTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Dispatch Tab */}
        <TabsContent value="dispatch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dispatch Log</CardTitle>
              <CardDescription>
                Track all items dispatched from the warehouse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Dispatched Items
                </Button>
              </div>
              <DispatchTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <WarehouseInfo />
    </div>
  );
};

export default Warehouse;

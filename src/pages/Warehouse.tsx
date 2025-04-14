
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currencyUtils';
import {
  Package,
  Plus,
  ArrowDown,
  ArrowUp,
  Package2,
  Truck,
  ClipboardList,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import ReportButton from '@/components/ReportButton';

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      Total Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">
                      items in stock
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ArrowDown className="h-5 w-5 text-green-600" />
                      Received
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">
                      items this month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ArrowUp className="h-5 w-5 text-orange-600" />
                      Dispatched
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">
                      items this month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Value</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Package2 className="h-12 w-12 text-muted-foreground/40 mb-3" />
                        <h3 className="font-medium text-lg mb-1">No items in warehouse</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start by adding inventory items to your warehouse
                        </p>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add First Item
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Received By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Truck className="h-12 w-12 text-muted-foreground/40 mb-3" />
                        <h3 className="font-medium text-lg mb-1">No receiving records</h3>
                        <p className="text-sm text-muted-foreground">
                          Record items received into the warehouse
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Dispatched By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-3" />
                        <h3 className="font-medium text-lg mb-1">No dispatch records</h3>
                        <p className="text-sm text-muted-foreground">
                          Record items dispatched from the warehouse
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
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
    </div>
  );
};

export default Warehouse;

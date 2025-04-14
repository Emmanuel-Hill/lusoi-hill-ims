
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const InventoryTable: React.FC = () => {
  return (
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
  );
};

export default InventoryTable;


import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Truck } from 'lucide-react';

const ReceivingTable: React.FC = () => {
  return (
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
  );
};

export default ReceivingTable;

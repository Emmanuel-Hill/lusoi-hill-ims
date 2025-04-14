
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClipboardList } from 'lucide-react';

const DispatchTable: React.FC = () => {
  return (
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
  );
};

export default DispatchTable;

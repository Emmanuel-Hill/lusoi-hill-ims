
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
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ReceivingRecord {
  id: string;
  date: string;
  reference: string;
  items: number;
  source: string;
  receivedBy: string;
}

interface ReceivingTableProps {
  records?: ReceivingRecord[];
  onAddRecord?: () => void;
  onViewRecord?: (id: string) => void;
}

const ReceivingTable: React.FC<ReceivingTableProps> = ({ 
  records = [],
  onAddRecord,
  onViewRecord 
}) => {
  const isEmpty = records.length === 0;

  return (
    <div>
      {!isEmpty && (
        <div className="flex justify-end mb-4">
          <Button onClick={onAddRecord}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Record Received Items
          </Button>
        </div>
      )}
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
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                <div className="flex flex-col items-center justify-center">
                  <Truck className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <h3 className="font-medium text-lg mb-1">No receiving records</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Record items received into the warehouse
                  </p>
                  <Button onClick={onAddRecord}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Record Received Items
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.reference}</TableCell>
                <TableCell>{record.items}</TableCell>
                <TableCell>{record.source}</TableCell>
                <TableCell>{record.receivedBy}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewRecord?.(record.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReceivingTable;

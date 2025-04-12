
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info, Edit } from 'lucide-react';
import { Batch } from '@/types';

interface BatchTableProps {
  batches: Batch[];
  onEdit: (batch: Batch) => void;
  onViewDetails: (batch: Batch) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({ batches, onEdit, onViewDetails }) => {
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Laying':
        return 'bg-green-100 text-green-800';
      case 'Not Laying':
        return 'bg-yellow-100 text-yellow-800';
      case 'Retired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Bird Count</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batch) => (
          <TableRow key={batch.id}>
            <TableCell className="font-medium">{batch.name}</TableCell>
            <TableCell>{batch.birdCount}</TableCell>
            <TableCell>
              <Badge className={getBadgeColor(batch.batchStatus)}>
                {batch.batchStatus}
              </Badge>
            </TableCell>
            <TableCell>{batch.createdAt}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(batch)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(batch)}>
                <Info className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BatchTable;


import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from 'date-fns';
import { FeedConsumption, FeedType, Batch } from '@/types';

interface FeedConsumptionListProps {
  feedConsumption: FeedConsumption[];
  feedTypes: FeedType[];
  batches: Batch[];
}

const FeedConsumptionList = ({ feedConsumption, feedTypes, batches }: FeedConsumptionListProps) => {
  const getFeedName = (feedTypeId: string) => {
    const feedType = feedTypes.find(f => f.id === feedTypeId);
    return feedType ? feedType.name : 'Unknown Feed';
  };

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Feed Type</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Quantity (kg)</TableHead>
          <TableHead>Time of Day</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedConsumption.length > 0 ? (
          feedConsumption.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.date}</TableCell>
              <TableCell>{getFeedName(record.feedTypeId)}</TableCell>
              <TableCell>{getBatchName(record.batchId)}</TableCell>
              <TableCell>{record.quantityKg} kg</TableCell>
              <TableCell>{record.timeOfDay}</TableCell>
              <TableCell>{record.notes || '-'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              No feed consumption records yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default FeedConsumptionList;

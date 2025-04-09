
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { FeedInventory, FeedType } from '@/types';

interface FeedInventoryListProps {
  feedInventory: FeedInventory[];
  feedTypes: FeedType[];
}

const FeedInventoryList = ({ feedInventory, feedTypes }: FeedInventoryListProps) => {
  const getFeedName = (feedTypeId: string) => {
    const feedType = feedTypes.find(f => f.id === feedTypeId);
    return feedType ? feedType.name : 'Unknown Feed';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Feed Type</TableHead>
          <TableHead>Quantity (kg)</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedInventory.length > 0 ? (
          feedInventory.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.date}</TableCell>
              <TableCell>{getFeedName(record.feedTypeId)}</TableCell>
              <TableCell>{record.quantityKg} kg</TableCell>
              <TableCell>
                <Badge variant={record.isProduced ? "default" : "secondary"}>
                  {record.isProduced ? 'Farm-produced' : 'Purchased'}
                </Badge>
              </TableCell>
              <TableCell>{record.notes || '-'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
              No feed inventory records yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default FeedInventoryList;

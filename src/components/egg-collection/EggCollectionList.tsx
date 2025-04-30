
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Batch, EggCollection } from '@/types';
import { format } from 'date-fns';

interface EggCollectionListProps {
  eggCollections: EggCollection[];
  batches: Batch[];
}

const EggCollectionList = ({ eggCollections, batches }: EggCollectionListProps) => {
  const getBatchName = (batchId: string) => {
    const batch = batches.find(batch => batch.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Good Eggs</TableHead>
          <TableHead>Broken Eggs</TableHead>
          <TableHead>Small</TableHead>
          <TableHead>Medium</TableHead>
          <TableHead>Large</TableHead>
          <TableHead>XL</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {eggCollections.length > 0 ? (
          eggCollections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell>{collection.date}</TableCell>
              <TableCell>{getBatchName(collection.batchId)}</TableCell>
              <TableCell>{collection.goodEggs}</TableCell>
              <TableCell>{collection.brokenEggs}</TableCell>
              <TableCell>{collection.smallEggs}</TableCell>
              <TableCell>{collection.mediumEggs}</TableCell>
              <TableCell>{collection.largeEggs}</TableCell>
              <TableCell>{collection.xlEggs}</TableCell>
              <TableCell>{collection.notes || '-'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
              No egg collections recorded yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EggCollectionList;

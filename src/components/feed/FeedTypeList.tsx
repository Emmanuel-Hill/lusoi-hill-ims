
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FeedType } from '@/types';
import { Edit, Trash2 } from 'lucide-react';

interface FeedTypeListProps {
  feedTypes: FeedType[];
  onEdit: (feedType: FeedType) => void;
  onDelete: (id: string) => void;
}

const FeedTypeList = ({ feedTypes, onEdit, onDelete }: FeedTypeListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Bird Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedTypes.length > 0 ? (
          feedTypes.map((feedType) => (
            <TableRow key={feedType.id}>
              <TableCell className="font-medium">{feedType.name}</TableCell>
              <TableCell>{feedType.description || '-'}</TableCell>
              <TableCell>{feedType.birdType}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(feedType)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(feedType.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
              No feed types added yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default FeedTypeList;

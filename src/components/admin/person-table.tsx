'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Person } from '@/types/family';

interface PersonTableProps {
  people: Person[];
  onView: (person: Person) => void;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
}

export function PersonTable({
  people,
  onView,
  onEdit,
  onDelete,
}: PersonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Short Name</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {people.map((person) => (
          <TableRow key={`person-${person.id}`}>
            <TableCell className="font-medium">{person.shortName}</TableCell>
            <TableCell>{person.fullName}</TableCell>
            <TableCell>{person.age}</TableCell>
            <TableCell>{person.gender}</TableCell>
            <TableCell>
              <Badge
                variant={person.status === 'alive' ? 'default' : 'destructive'}
              >
                {person.status}
              </Badge>
            </TableCell>
            <TableCell>{person.phone}</TableCell>
            <TableCell>{person.address}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => onView(person)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-600 hover:text-purple-700"
                  onClick={() => onEdit(person)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDelete(person)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

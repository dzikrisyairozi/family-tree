'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Person, Relationship } from '@/types/family';

import { PersonDetail } from '../admin/person-detail';

interface PersonDetailsDialogProps {
  selectedPerson: Person | null;
  onClose: () => void;
  relationships: Relationship[];
  people: Person[];
}

export function PersonDetailsDialog({
  selectedPerson,
  onClose,
  relationships,
  people,
}: PersonDetailsDialogProps) {
  const getPersonName = (id: number) => {
    const person = people.find((p) => p.id === id);
    return person ? person.fullName : 'Unknown';
  };

  return (
    <Dialog open={!!selectedPerson} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Person Details</DialogTitle>
        </DialogHeader>
        {selectedPerson && (
          <PersonDetail
            person={selectedPerson}
            getPersonName={getPersonName}
            relationships={relationships}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

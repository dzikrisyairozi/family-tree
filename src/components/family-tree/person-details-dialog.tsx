'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Person } from '@/types/family';

import { PersonDetail } from '../admin/person-detail';

interface PersonDetailsDialogProps {
  selectedPerson: Person | null;
  onClose: () => void;
  getPersonName: (id: number) => string;
}

export function PersonDetailsDialog({
  selectedPerson,
  onClose,
  getPersonName,
}: PersonDetailsDialogProps) {
  return (
    <Dialog open={!!selectedPerson} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Person Details</DialogTitle>
        </DialogHeader>
        {selectedPerson && (
          <PersonDetail person={selectedPerson} getPersonName={getPersonName} />
        )}
      </DialogContent>
    </Dialog>
  );
}

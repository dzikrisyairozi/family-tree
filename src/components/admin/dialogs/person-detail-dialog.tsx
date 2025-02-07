'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Person } from '@/types/family';

import { PersonDetail } from '../person-detail';

interface PersonDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPerson: Person | null;
  getPersonName: (id: number) => string;
}

export function PersonDetailDialog({
  isOpen,
  onOpenChange,
  selectedPerson,
  getPersonName,
}: PersonDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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

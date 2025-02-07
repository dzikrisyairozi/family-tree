'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Person, PersonFormData } from '@/types/family';

import { PersonForm } from '../person-form';

interface PersonEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PersonFormData;
  selectedPerson: Person | null;
  people: Person[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onChange: (data: PersonFormData) => void;
}

export function PersonEditDialog({
  isOpen,
  onOpenChange,
  formData,
  selectedPerson,
  people,
  isSubmitting,
  onSubmit,
  onChange,
}: PersonEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
        </DialogHeader>
        <PersonForm
          formData={formData}
          people={people.filter((p) => p.id !== selectedPerson?.id)}
          onChange={onChange}
          idPrefix="edit-"
          isSubmitting={isSubmitting}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

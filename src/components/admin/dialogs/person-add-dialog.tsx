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

interface PersonAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PersonFormData;
  people: Person[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onChange: (data: PersonFormData) => void;
}

export function PersonAddDialog({
  isOpen,
  onOpenChange,
  formData,
  people,
  isSubmitting,
  onSubmit,
  onChange,
}: PersonAddDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Person</DialogTitle>
        </DialogHeader>
        <PersonForm
          formData={formData}
          people={people}
          onChange={onChange}
          idPrefix="add-"
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
                Adding...
              </>
            ) : (
              'Add Person'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

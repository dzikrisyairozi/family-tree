'use client';

import { useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Person } from '@/types/family';
import { transformFamilyData } from '@/utils/transform-data';

interface UseDeletePersonProps {
  onSuccess?: () => void;
  setPeople: (people: Person[]) => void;
}

export function useDeletePerson({
  onSuccess,
  setPeople,
}: UseDeletePersonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePerson = async (personId: number) => {
    try {
      setIsDeleting(true);
      setError(null);

      // Delete the person (relationships will be cascade deleted due to DB constraints)
      const { error: deleteError } = await supabase
        .from('persons')
        .delete()
        .eq('id', personId);

      if (deleteError) throw deleteError;

      // Refresh people list with transformed data
      const transformedPeople = await transformFamilyData();
      setPeople(transformedPeople);

      onSuccess?.();
      return { success: true, error: null };
    } catch (err) {
      console.error('Error deleting person:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete person';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deletePerson,
    isDeleting,
    error,
  };
}

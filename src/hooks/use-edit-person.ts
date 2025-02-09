'use client';

import { useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Person, PersonFormData } from '@/types/family';
import { transformFamilyData } from '@/utils/transform-data';

interface UseEditPersonProps {
  onSuccess?: () => void;
  setPeople: (people: Person[]) => void;
}

export function useEditPerson({ onSuccess, setPeople }: UseEditPersonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editPerson = async (personId: number, formData: PersonFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.shortName || !formData.fullName || !formData.gender) {
        throw new Error('Required fields are missing');
      }

      // Update person record
      const { error: updateError } = await supabase
        .from('persons')
        .update({
          short_name: formData.shortName,
          full_name: formData.fullName,
          age: parseInt(formData.age) || 0,
          gender: formData.gender as 'Male' | 'Female',
          status: formData.status as 'alive' | 'deceased',
          phone: formData.phone || '',
          address: formData.address || '',
        })
        .eq('id', personId);

      if (updateError) throw updateError;

      // Delete all existing relationships for this person
      const { error: deleteRelationshipsError } = await supabase
        .from('relationships')
        .delete()
        .or(`from_person_id.eq.${personId},to_person_id.eq.${personId}`);

      if (deleteRelationshipsError) throw deleteRelationshipsError;

      // Create new relationships array for batch insert
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const relationships: any[] = [];

      // Add parent relationships
      if (formData.parents?.length) {
        formData.parents.forEach((parent) => {
          if (parent.id) {
            relationships.push({
              from_person_id: parseInt(parent.id),
              to_person_id: personId,
              relationship_type: 'parent-child',
              status: parent.type,
            });
          }
        });
      }

      // Add spouse relationships
      if (formData.spouses?.length) {
        formData.spouses.forEach((spouse) => {
          if (spouse.id) {
            relationships.push({
              from_person_id: personId,
              to_person_id: parseInt(spouse.id),
              relationship_type: 'spouse',
              status: spouse.status,
            });
          }
        });
      }

      // Add children relationships
      if (formData.children?.length) {
        formData.children.forEach((child) => {
          if (child.id) {
            relationships.push({
              from_person_id: personId,
              to_person_id: parseInt(child.id),
              relationship_type: 'parent-child',
              status: child.type,
            });
          }
        });
      }

      // Insert all new relationships in a single batch
      if (relationships.length > 0) {
        const { error: relationshipsError } = await supabase
          .from('relationships')
          .insert(relationships);

        if (relationshipsError) throw relationshipsError;
      }

      // Refresh people list with transformed data
      const transformedPeople = await transformFamilyData();
      setPeople(transformedPeople);

      onSuccess?.();
      return { success: true, error: null };
    } catch (err) {
      console.error('Error editing person:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to edit person';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editPerson,
    isSubmitting,
    error,
  };
}

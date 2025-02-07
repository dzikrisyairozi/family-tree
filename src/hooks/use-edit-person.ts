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

      // Delete existing relationships
      const { error: deleteParentsError } = await supabase
        .from('parent_child_relationships')
        .delete()
        .eq('child_id', personId);

      const { error: deleteChildrenError } = await supabase
        .from('parent_child_relationships')
        .delete()
        .eq('parent_id', personId);

      const { error: deleteSpousesError } = await supabase
        .from('spouse_relationships')
        .delete()
        .or(`person1_id.eq.${personId},person2_id.eq.${personId}`);

      if (deleteParentsError) throw deleteParentsError;
      if (deleteChildrenError) throw deleteChildrenError;
      if (deleteSpousesError) throw deleteSpousesError;

      // Insert new parent relationships
      if (formData.parents && formData.parents.length > 0) {
        const validParents = formData.parents.filter((parent) => parent.id);
        if (validParents.length > 0) {
          const { error: parentsError } = await supabase
            .from('parent_child_relationships')
            .insert(
              validParents.map((parent) => ({
                parent_id: parseInt(parent.id),
                child_id: personId,
                relationship_type: parent.type,
              }))
            );

          if (parentsError) throw parentsError;
        }
      }

      // Insert new spouse relationships
      if (formData.spouses && formData.spouses.length > 0) {
        const validSpouses = formData.spouses.filter((spouse) => spouse.id);
        if (validSpouses.length > 0) {
          const { error: spousesError } = await supabase
            .from('spouse_relationships')
            .insert(
              validSpouses.map((spouse) => ({
                person1_id: personId,
                person2_id: parseInt(spouse.id),
                status: spouse.status,
              }))
            );

          if (spousesError) throw spousesError;
        }
      }

      // Insert new children relationships
      if (formData.children && formData.children.length > 0) {
        const validChildren = formData.children.filter((child) => child.id);
        if (validChildren.length > 0) {
          const { error: childrenError } = await supabase
            .from('parent_child_relationships')
            .insert(
              validChildren.map((child) => ({
                parent_id: personId,
                child_id: parseInt(child.id),
                relationship_type: child.type,
              }))
            );

          if (childrenError) throw childrenError;
        }
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

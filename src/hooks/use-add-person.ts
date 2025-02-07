'use client';

import { useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Person, PersonFormData } from '@/types/family';
import { transformFamilyData } from '@/utils/transform-data';

interface UseAddPersonProps {
  onSuccess?: () => void;
  setPeople: (people: Person[]) => void;
}

export function useAddPerson({ onSuccess, setPeople }: UseAddPersonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPerson = async (formData: PersonFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.shortName || !formData.fullName || !formData.gender) {
        throw new Error('Required fields are missing');
      }

      // Insert person record
      const { data: newPerson, error: personError } = await supabase
        .from('persons')
        .insert({
          short_name: formData.shortName,
          full_name: formData.fullName,
          age: parseInt(formData.age) || 0,
          gender: formData.gender as 'Male' | 'Female',
          status: formData.status as 'alive' | 'deceased',
          phone: formData.phone || '',
          address: formData.address || '',
        })
        .select()
        .single();

      if (personError) throw personError;
      if (!newPerson) throw new Error('Failed to create person');

      // Handle parent relationships
      if (formData.parents && formData.parents.length > 0) {
        const validParents = formData.parents.filter((parent) => parent.id);
        if (validParents.length > 0) {
          const { error: parentsError } = await supabase
            .from('parent_child_relationships')
            .insert(
              validParents.map((parent) => ({
                parent_id: parseInt(parent.id),
                child_id: newPerson.id,
                relationship_type: parent.type,
              }))
            );

          if (parentsError) throw parentsError;
        }
      }

      // Handle spouse relationships
      if (formData.spouses && formData.spouses.length > 0) {
        const validSpouses = formData.spouses.filter((spouse) => spouse.id);
        if (validSpouses.length > 0) {
          const { error: spousesError } = await supabase
            .from('spouse_relationships')
            .insert(
              validSpouses.map((spouse) => ({
                person1_id: newPerson.id,
                person2_id: parseInt(spouse.id),
                status: spouse.status,
              }))
            );

          if (spousesError) throw spousesError;
        }
      }

      // Handle children relationships
      if (formData.children && formData.children.length > 0) {
        const validChildren = formData.children.filter((child) => child.id);
        if (validChildren.length > 0) {
          const { error: childrenError } = await supabase
            .from('parent_child_relationships')
            .insert(
              validChildren.map((child) => ({
                parent_id: newPerson.id,
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

      // Call success callback
      onSuccess?.();

      return { success: true, error: null };
    } catch (err) {
      console.error('Error adding person:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add person';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addPerson,
    isSubmitting,
    error,
  };
}

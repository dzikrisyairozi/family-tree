'use client';

import { useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Person, PersonFormData } from '@/types/family';

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
          gender: formData.gender,
          status: formData.status || 'alive',
          phone: formData.phone || '',
          address: formData.address || '',
        })
        .select()
        .single();

      if (personError) throw personError;
      if (!newPerson) throw new Error('Failed to create person');

      // Create relationships array for batch insert
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const relationships: any[] = [];

      // Add parent relationships
      if (formData.parents?.length) {
        formData.parents.forEach((parent) => {
          if (parent.id) {
            relationships.push({
              from_person_id: parseInt(parent.id),
              to_person_id: newPerson.id,
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
              from_person_id: newPerson.id,
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
              from_person_id: newPerson.id,
              to_person_id: parseInt(child.id),
              relationship_type: 'parent-child',
              status: child.type,
            });
          }
        });
      }

      // Insert all relationships in a single batch
      if (relationships.length > 0) {
        const { error: relationshipsError } = await supabase
          .from('relationships')
          .insert(relationships);

        if (relationshipsError) throw relationshipsError;
      }

      // Fetch updated data
      const { data: persons } = await supabase.from('persons').select('*');
      const { data: allRelationships } = await supabase
        .from('relationships')
        .select('*');

      // Transform and update state
      const transformedPeople = persons?.map((person) => ({
        id: person.id,
        shortName: person.short_name,
        fullName: person.full_name,
        age: person.age,
        gender: person.gender,
        status: person.status,
        phone: person.phone,
        address: person.address,
        parents:
          allRelationships
            ?.filter(
              (rel) =>
                rel.relationship_type === 'parent-child' &&
                rel.to_person_id === person.id
            )
            .map((rel) => ({
              id: rel.from_person_id,
              type: rel.status as 'biological' | 'adoptive',
            })) || [],
        children:
          allRelationships
            ?.filter(
              (rel) =>
                rel.relationship_type === 'parent-child' &&
                rel.from_person_id === person.id
            )
            .map((rel) => ({
              id: rel.to_person_id,
              type: rel.status as 'biological' | 'adoptive',
            })) || [],
        spouses:
          allRelationships
            ?.filter(
              (rel) =>
                rel.relationship_type === 'spouse' &&
                (rel.from_person_id === person.id ||
                  rel.to_person_id === person.id)
            )
            .map((rel) => ({
              id:
                rel.from_person_id === person.id
                  ? rel.to_person_id
                  : rel.from_person_id,
              status: rel.status as 'current' | 'deceased' | 'divorced',
            })) || [],
      }));

      if (transformedPeople) {
        setPeople(transformedPeople);
      }

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

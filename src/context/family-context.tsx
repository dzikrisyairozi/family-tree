'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { FamilyMember, Person } from '@/types/family';
import { buildFamilyTree } from '@/utils/family-tree';

interface FamilyContextType {
  people: Person[];
  setPeople: (people: Person[]) => void;
  familyTree: FamilyMember | null;
  loading: boolean;
  error: string | null;
}

const FamilyContext = createContext<FamilyContextType>({
  people: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPeople: () => {},
  familyTree: null,
  loading: false,
  error: null,
});

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [familyTree, setFamilyTree] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFamilyData() {
      try {
        setLoading(true);

        // Fetch persons
        const { data: persons, error: personsError } = await supabase
          .from('persons')
          .select('*');

        if (personsError) throw personsError;

        // Fetch relationships
        const { data: parentChildRels, error: parentChildError } =
          await supabase.from('parent_child_relationships').select('*');

        const { data: spouseRels, error: spouseError } = await supabase
          .from('spouse_relationships')
          .select('*');

        if (parentChildError) throw parentChildError;
        if (spouseError) throw spouseError;

        // Transform data to match Person interface
        const transformedPeople = persons.map((person) => ({
          ...person,
          parents: parentChildRels
            .filter((rel) => rel.child_id === person.id)
            .map((rel) => ({
              id: rel.parent_id,
              type: rel.relationship_type,
            })),
          children: parentChildRels
            .filter((rel) => rel.parent_id === person.id)
            .map((rel) => ({
              id: rel.child_id,
              type: rel.relationship_type,
            })),
          spouses: spouseRels
            .filter(
              (rel) =>
                rel.person1_id === person.id || rel.person2_id === person.id
            )
            .map((rel) => ({
              id:
                rel.person1_id === person.id ? rel.person2_id : rel.person1_id,
              status: rel.status,
            })),
        }));

        setPeople(transformedPeople);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchFamilyData();
  }, []);

  // Build family tree when people data changes
  useEffect(() => {
    const root = people.find((p) => p.parents.length === 0);
    if (root) {
      setFamilyTree(buildFamilyTree(people, root.id));
    }
  }, [people]);

  return (
    <FamilyContext.Provider
      value={{ people, setPeople, familyTree, loading, error }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export const useFamily = () => useContext(FamilyContext);

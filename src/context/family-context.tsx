'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import type { FamilyMember, Person } from '@/types/family';
import { buildFamilyTree } from '@/utils/family-tree';
import { transformFamilyData } from '@/utils/transform-data';

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

  // Fetch initial data
  useEffect(() => {
    async function fetchFamilyData() {
      try {
        setLoading(true);
        const transformedPeople = await transformFamilyData();
        setPeople(transformedPeople);
        setError(null);
      } catch (err) {
        console.error('Error fetching family data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchFamilyData();
  }, []);

  // Build family tree when people data changes
  useEffect(() => {
    if (people && people.length > 0) {
      const root = people.find((p) => p.parents && p.parents.length === 0);
      if (root) {
        const tree = buildFamilyTree(people, root.id);
        setFamilyTree(tree);
      } else {
        setFamilyTree(null);
      }
    } else {
      setFamilyTree(null);
    }
  }, [people]);

  const value = {
    people,
    setPeople,
    familyTree,
    loading,
    error,
  };

  return (
    <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
  );
}

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

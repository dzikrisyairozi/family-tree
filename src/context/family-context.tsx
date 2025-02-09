'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import type { Person, Relationship } from '@/types/family';

interface FamilyContextType {
  people: Person[];
  relationships: Relationship[];
  loading: boolean;
  rootPerson: Person | null;
  setPeople: (people: Person[]) => void;
  setRelationships: (relationships: Relationship[]) => void;
  setRootPerson: (person: Person | null) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [rootPerson, setRootPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [peopleRes, relationshipsRes] = await Promise.all([
          fetch('/api/persons'),
          fetch('/api/relationships'),
        ]);

        if (!peopleRes.ok || !relationshipsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const peopleData = await peopleRes.json();
        const relationshipsData = await relationshipsRes.json();

        setPeople(peopleData);
        setRelationships(relationshipsData);

        // Find root person (person with no parents)
        const rootPerson = peopleData.find((person: Person) => {
          return !relationshipsData.some(
            (rel: Relationship) =>
              rel.relationship_type === 'parent-child' &&
              rel.to_person_id === person.id
          );
        });

        if (rootPerson) {
          setRootPerson(rootPerson);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching family data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <FamilyContext.Provider
      value={{
        people,
        relationships,
        loading,
        rootPerson,
        setPeople,
        setRelationships,
        setRootPerson,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}

'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { initialFamilyData } from '@/constant/family-data';
import type { FamilyMember, Person } from '@/types/family';
import { buildFamilyTree } from '@/utils/family-tree';

interface FamilyContextType {
  people: Person[];
  setPeople: (people: Person[]) => void;
  familyTree: FamilyMember | null;
}

const FamilyContext = createContext<FamilyContextType>({
  people: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPeople: () => {},
  familyTree: null,
});

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>(initialFamilyData);
  const [familyTree, setFamilyTree] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const root = people.find((p) => p.parents.length === 0);
    if (root) {
      setFamilyTree(buildFamilyTree(people, root.id));
    }
  }, [people]);

  return (
    <FamilyContext.Provider value={{ people, setPeople, familyTree }}>
      {children}
    </FamilyContext.Provider>
  );
}

export const useFamily = () => useContext(FamilyContext);

import type { FamilyMember, Person } from '@/types/family';

export const buildFamilyTree = (
  people: Person[],
  rootId: number
): FamilyMember | null => {
  const person = people.find((p) => p.id === rootId);
  if (!person) return null;

  const children = people
    .filter((p) => p.parents.some((parent) => parent.id === rootId))
    .map((child) => {
      const childTree = buildFamilyTree(people, child.id);
      if (!childTree) return null;

      const relationship = person.children.find((c) => c.id === child.id);
      if (!relationship) return null;

      return {
        id: child.id,
        type: relationship.type,
        member: childTree,
      };
    })
    .filter(
      (
        child
      ): child is {
        id: number;
        type: 'biological' | 'adoptive';
        member: FamilyMember;
      } => child !== null
    );

  return {
    ...person,
    children: children,
  };
};

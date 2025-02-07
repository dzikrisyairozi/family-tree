import type { FamilyMember, Person } from '@/types/family';
import type {
  ConnectorNodeDatum,
  PersonNodeDatum,
  TreeNodeDatum,
} from '@/types/tree';

function createPersonNode(person: Person): PersonNodeDatum {
  return {
    name: person.shortName,
    gender: person.gender,
    age: person.age,
    status: person.status,
    id: person.id,
    isSpouseConnector: false,
    attributes: {
      phone: person.phone,
      address: person.address,
    },
  };
}

function createConnectorNode(
  children: TreeNodeDatum[],
  name = ''
): ConnectorNodeDatum {
  return {
    name,
    isSpouseConnector: true,
    children,
  };
}

export function transformTreeData(
  member: FamilyMember,
  people: Person[]
): PersonNodeDatum {
  const spouses = member.spouses || [];
  const children = member.children || [];

  // Create main node data
  const mainNode = createPersonNode(member);

  // Create spouse nodes
  const spouseNodes: PersonNodeDatum[] = spouses
    .map((spouse): PersonNodeDatum | null => {
      const spousePerson = people.find((p) => p.id === spouse.id);
      if (!spousePerson) return null;
      return createPersonNode(spousePerson);
    })
    .filter((node): node is PersonNodeDatum => node !== null);

  // Create child nodes
  const childNodes: PersonNodeDatum[] = children
    .map((child): PersonNodeDatum | null => {
      const childMember = child.member;
      if (!childMember) return null;
      return transformTreeData(childMember, people);
    })
    .filter((node): node is PersonNodeDatum => node !== null);

  // Handle spouse and child connections
  if (spouseNodes.length > 0) {
    const spouseConnections: TreeNodeDatum[] = spouseNodes.map((spouse) =>
      createConnectorNode([spouse])
    );

    if (childNodes.length > 0) {
      spouseConnections.push(createConnectorNode(childNodes));
    }

    mainNode.children = spouseConnections;
  } else if (childNodes.length > 0) {
    mainNode.children = childNodes;
  }

  return mainNode;
}

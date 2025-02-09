import type { Person, Relationship } from '@/types/family';
import type { CustomTreeNodeDatum, NodeAttributes } from '@/types/tree';

function createPersonNode(person: Person): CustomTreeNodeDatum {
  const attributes: NodeAttributes = {
    gender: person.gender,
    age: person.age,
    status: person.status,
    id: person.id,
    isSpouseConnector: false,
    phone: person.phone,
    address: person.address,
  };

  return {
    name: person.shortName,
    attributes,
    __rd3t: {
      depth: 0,
      id: person.id.toString(),
      collapsed: false,
    },
  };
}

function createConnectorNode(
  children: CustomTreeNodeDatum[],
  name = ''
): CustomTreeNodeDatum {
  const attributes: NodeAttributes = {
    gender: '',
    age: 0,
    status: 'alive',
    id: 0,
    isSpouseConnector: true,
    phone: '',
    address: '',
  };

  return {
    name,
    attributes,
    children,
    __rd3t: {
      depth: 0,
      id: `connector-${Math.random()}`,
      collapsed: false,
    },
  };
}

function getSpouses(personId: number, relationships: Relationship[]): number[] {
  return relationships
    .filter(
      (rel) =>
        rel.relationship_type === 'spouse' &&
        (rel.from_person_id === personId || rel.to_person_id === personId)
    )
    .map((rel) =>
      rel.from_person_id === personId ? rel.to_person_id : rel.from_person_id
    );
}

function getChildren(
  personId: number,
  relationships: Relationship[]
): number[] {
  return relationships
    .filter(
      (rel) =>
        rel.relationship_type === 'parent-child' &&
        rel.from_person_id === personId
    )
    .map((rel) => rel.to_person_id);
}

export function transformTreeData(
  rootPerson: Person,
  people: Person[],
  relationships: Relationship[]
): CustomTreeNodeDatum {
  const mainNode = createPersonNode(rootPerson);

  // Get spouses
  const spouseIds = getSpouses(rootPerson.id, relationships);
  const spouseNodes: CustomTreeNodeDatum[] = spouseIds
    .map((id) => {
      const spouse = people.find((p) => p.id === id);
      return spouse ? createPersonNode(spouse) : null;
    })
    .filter((node): node is CustomTreeNodeDatum => node !== null);

  // Get children
  const childIds = getChildren(rootPerson.id, relationships);
  const childNodes: CustomTreeNodeDatum[] = childIds
    .map((id) => {
      const child = people.find((p) => p.id === id);
      return child ? transformTreeData(child, people, relationships) : null;
    })
    .filter((node): node is CustomTreeNodeDatum => node !== null);

  // Handle connections
  if (spouseNodes.length > 0) {
    const spouseConnections: CustomTreeNodeDatum[] = spouseNodes.map((spouse) =>
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

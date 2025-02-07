'use client';

import { useCallback, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';

import { transformTreeData } from '@/components/family-tree/transform-tree-data';
import { useFamily } from '@/context/family-context';
import type { Person } from '@/types/family';
import type {
  TreeDimensions,
  TreeNodeDatum,
  TreeTranslate,
} from '@/types/tree';

import { CustomNode } from './custom-node';
import { PersonDetailsDialog } from './person-details-dialog';

export default function FamilyTree() {
  const { familyTree, people, loading } = useFamily();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dimensions, setDimensions] = useState<TreeDimensions>({
    width: 1200,
    height: 800,
  });
  const [translate, setTranslate] = useState<TreeTranslate>({
    x: 600,
    y: 100,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight - 140,
      };
      setDimensions(newDimensions);
      setTranslate({
        x: window.innerWidth / 2,
        y: 100,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getPersonName = useCallback(
    (id: number) => people.find((p) => p.id === id)?.fullName || 'Unknown',
    [people]
  );

  const handleNodeClick = useCallback(
    (nodeDatum: TreeNodeDatum) => {
      if (nodeDatum.isSpouseConnector || !nodeDatum.id) return;
      const person = people.find((p) => p.id === nodeDatum.id);
      if (person) {
        setSelectedPerson(person);
      }
    },
    [people]
  );

  if (!familyTree) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">No family data available</p>
      </div>
    );
  }

  const treeData = transformTreeData(familyTree, people);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading family tree...</p>
      </div>
    );
  }

  if (!familyTree) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">No family data available</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ width: '100%', height: dimensions.height }}>
        <Tree
          data={treeData}
          orientation="horizontal"
          pathFunc="step"
          translate={translate}
          nodeSize={{ x: 150, y: 250 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          onNodeClick={handleNodeClick}
          renderCustomNodeElement={(rd3tProps: any) => (
            <CustomNode
              nodeDatum={rd3tProps.nodeDatum}
              onNodeClick={handleNodeClick}
            />
          )}
          pathClassFunc={() => 'stroke-slate-400 stroke-2'}
          zoom={0.8}
        />
      </div>

      <PersonDetailsDialog
        selectedPerson={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        getPersonName={getPersonName}
      />
    </>
  );
}

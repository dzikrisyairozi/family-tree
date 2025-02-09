'use client';

import { useCallback, useEffect, useState } from 'react';
import Tree, { CustomNodeElementProps, RawNodeDatum } from 'react-d3-tree';

import { transformTreeData } from '@/components/family-tree/transform-tree-data';
import { useFamily } from '@/context/family-context';
import type { Person } from '@/types/family';
import type {
  CustomTreeNodeDatum,
  TreeDimensions,
  TreeTranslate,
} from '@/types/tree';

import { CustomNode } from './custom-node';
import { PersonDetailsDialog } from './person-details-dialog';

export default function FamilyTree() {
  const { rootPerson, people, relationships, loading } = useFamily();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dimensions, setDimensions] = useState<TreeDimensions>({
    width: 1200,
    height: 800,
  });
  const [translate, setTranslate] = useState<TreeTranslate>({
    x: 600,
    y: 50,
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

  const handleNodeClick = useCallback(
    (nodeData: CustomTreeNodeDatum) => {
      if (nodeData.attributes.isSpouseConnector || !nodeData.attributes.id)
        return;

      const person = people.find((p) => p.id === nodeData.attributes.id);
      if (person) {
        setSelectedPerson(person);
      }
    },
    [people]
  );

  const renderCustomNode = useCallback(
    (rd3tProps: CustomNodeElementProps) => {
      const nodeData = rd3tProps.nodeDatum as unknown as CustomTreeNodeDatum;
      return (
        <CustomNode
          nodeDatum={{ ...nodeData.attributes, name: nodeData.name }}
          onNodeClick={() => handleNodeClick(nodeData)}
        />
      );
    },
    [handleNodeClick]
  );

  if (loading || !rootPerson) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">
          {loading ? 'Loading family tree...' : 'No family data available'}
        </p>
      </div>
    );
  }

  const treeData = transformTreeData(rootPerson, people, relationships);

  return (
    <>
      <div style={{ width: '100%', height: dimensions.height }}>
        <Tree
          data={treeData as unknown as RawNodeDatum}
          orientation="vertical"
          pathFunc="step"
          translate={translate}
          nodeSize={{ x: 250, y: 150 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          renderCustomNodeElement={renderCustomNode}
          pathClassFunc={() => 'stroke-slate-400 stroke-2'}
          zoom={0.8}
          scaleExtent={{ min: 0.3, max: 1.5 }}
        />
      </div>

      <PersonDetailsDialog
        selectedPerson={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        relationships={relationships}
        people={people}
      />
    </>
  );
}

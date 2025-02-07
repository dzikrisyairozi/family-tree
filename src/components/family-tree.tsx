'use client';

import { motion } from 'framer-motion';
import { User2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';

import { PersonDetail } from '@/components/admin/person-detail';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFamily } from '@/context/family-context';
import type { FamilyMember, Person } from '@/types/family';

interface TreeNodeDatum {
  name: string;
  gender?: string;
  age?: number;
  status?: 'alive' | 'deceased';
  id?: number;
  isSpouseConnector?: boolean;
  attributes?: {
    phone: string;
    address: string;
  };
  children?: TreeNodeDatum[];
}

interface CustomNodeProps {
  nodeDatum: TreeNodeDatum;
  onNodeClick: (node: TreeNodeDatum) => void;
}

const CustomNode = ({ nodeDatum, onNodeClick }: CustomNodeProps) => {
  if (nodeDatum.isSpouseConnector) {
    return (
      <g>
        <circle r="2" fill="#94a3b8" />
      </g>
    );
  }

  return (
    <g onClick={() => onNodeClick(nodeDatum)}>
      <foreignObject
        x="-100"
        y="-60"
        width="200"
        height="120"
        style={{ overflow: 'visible' }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="group relative cursor-pointer rounded-xl border border-gray-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
        >
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl transition-all duration-300 group-hover:blur-2xl" />
          <div className="flex h-full flex-col items-center justify-center">
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
              {nodeDatum.name}
            </h3>
            <div className="mb-2 text-2xl text-gray-600">
              <User2
                className={
                  nodeDatum.gender === 'Male'
                    ? 'text-blue-500'
                    : 'text-pink-500'
                }
              />
            </div>
            {nodeDatum.status && (
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    nodeDatum.status === 'alive' ? 'default' : 'destructive'
                  }
                >
                  {nodeDatum.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {nodeDatum.age} y/o
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </foreignObject>
    </g>
  );
};

const transformData = (
  member: FamilyMember,
  people: Person[]
): TreeNodeDatum => {
  const spouses = member.spouses || [];
  const children = member.children || [];

  // Create spouse nodes and connectors
  const spouseNodes: TreeNodeDatum[] = spouses
    .map((spouse): TreeNodeDatum | null => {
      const spousePerson = people.find((p) => p.id === spouse.id);
      if (!spousePerson) return null;

      return {
        name: spousePerson.shortName,
        gender: spousePerson.gender,
        age: spousePerson.age,
        status: spousePerson.status,
        id: spousePerson.id,
        attributes: {
          phone: spousePerson.phone,
          address: spousePerson.address,
        },
      };
    })
    .filter((node): node is NonNullable<TreeNodeDatum> => node !== null);

  // Create child nodes
  const childNodes: TreeNodeDatum[] = children
    .map((child): TreeNodeDatum | null => {
      const childMember = child.member;
      if (!childMember) return null;

      return transformData(childMember, people);
    })
    .filter((node): node is NonNullable<TreeNodeDatum> => node !== null);

  // If there are spouses, create a structure that connects them
  if (spouseNodes.length > 0) {
    return {
      name: member.shortName,
      gender: member.gender,
      age: member.age,
      status: member.status,
      id: member.id,
      attributes: {
        phone: member.phone,
        address: member.address,
      },
      children: [
        {
          name: '',
          isSpouseConnector: true,
          children: [
            ...spouseNodes,
            ...(childNodes.length > 0
              ? [
                  {
                    name: '',
                    isSpouseConnector: true,
                    children: childNodes,
                  },
                ]
              : []),
          ],
        },
      ],
    };
  }

  // If no spouses, connect children directly
  return {
    name: member.shortName,
    gender: member.gender,
    age: member.age,
    status: member.status,
    id: member.id,
    attributes: {
      phone: member.phone,
      address: member.address,
    },
    children: childNodes,
  };
};

const FamilyTree = () => {
  const { familyTree, people } = useFamily();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [translate, setTranslate] = useState({ x: 600, y: 100 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 140, // Account for header
      });
      setTranslate({
        x: window.innerWidth / 2,
        y: 100,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPersonName = (id: number) => {
    return people.find((p) => p.id === id)?.fullName || 'Unknown';
  };

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

  const treeData = transformData(familyTree, people);

  return (
    <>
      <div style={{ width: '100%', height: dimensions.height }}>
        <Tree
          data={treeData}
          orientation="vertical"
          pathFunc="step"
          translate={translate}
          nodeSize={{ x: 250, y: 150 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          onNodeClick={handleNodeClick}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      <Dialog
        open={!!selectedPerson}
        onOpenChange={() => setSelectedPerson(null)}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Person Details</DialogTitle>
          </DialogHeader>
          {selectedPerson && (
            <PersonDetail
              person={selectedPerson}
              getPersonName={getPersonName}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FamilyTree;

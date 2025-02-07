'use client';

import { motion } from 'framer-motion';
import { User2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { CustomNodeProps } from '@/types/tree';

export function CustomNode({ nodeDatum, onNodeClick }: CustomNodeProps) {
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
}

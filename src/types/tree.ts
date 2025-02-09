export interface NodeAttributes
  extends Record<string, string | number | boolean> {
  gender: 'Male' | 'Female' | '';
  age: number;
  status: 'alive' | 'deceased';
  id: number;
  isSpouseConnector: boolean;
  phone: string;
  address: string;
}

export interface CustomTreeNodeDatum {
  name: string;
  attributes: NodeAttributes;
  children?: CustomTreeNodeDatum[];
  __rd3t: {
    depth: number;
    id: string;
    collapsed: boolean;
  };
}

export interface CustomNodeProps {
  nodeDatum: NodeAttributes;
  onNodeClick: () => void;
}

export interface TreeDimensions {
  width: number;
  height: number;
}

export interface TreeTranslate {
  x: number;
  y: number;
}

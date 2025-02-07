export interface BaseTreeNodeDatum {
  name: string;
  children?: TreeNodeDatum[];
}

export interface PersonNodeDatum extends BaseTreeNodeDatum {
  gender: string;
  age: number;
  status: 'alive' | 'deceased';
  id: number;
  isSpouseConnector?: false;
  attributes: {
    phone: string;
    address: string;
  };
}

export interface ConnectorNodeDatum extends BaseTreeNodeDatum {
  isSpouseConnector: true;
  children: TreeNodeDatum[];
}

export type TreeNodeDatum = PersonNodeDatum | ConnectorNodeDatum;

export interface CustomNodeProps {
  nodeDatum: TreeNodeDatum;
  onNodeClick: (node: TreeNodeDatum) => void;
}

export interface TreeDimensions {
  width: number;
  height: number;
}

export interface TreeTranslate {
  x: number;
  y: number;
}

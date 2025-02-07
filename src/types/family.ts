export interface Person {
  id: number;
  shortName: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female';
  status: 'alive' | 'deceased';
  phone: string;
  address: string;
  parents: {
    id: number;
    type: 'biological' | 'adoptive';
  }[];
  spouses: {
    id: number;
    status: 'current' | 'deceased' | 'divorced';
  }[];
  children: {
    id: number;
    type: 'biological' | 'adoptive';
  }[];
}

export interface PersonFormData {
  shortName: string;
  fullName: string;
  age: string;
  gender: string;
  status: string;
  phone: string;
  address: string;
  parents: { id: string; type: 'biological' | 'adoptive' }[];
  spouses: { id: string; status: 'current' | 'deceased' | 'divorced' }[];
  children: { id: string; type: 'biological' | 'adoptive' }[];
}

export interface FamilyMember extends Person {
  children: {
    id: number;
    type: 'biological' | 'adoptive';
    member: FamilyMember;
  }[];
}

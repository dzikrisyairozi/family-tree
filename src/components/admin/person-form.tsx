'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Person, PersonFormData } from '@/types/family';

interface PersonFormProps {
  formData: PersonFormData;
  people: Person[];
  onChange: (data: PersonFormData) => void;
  idPrefix: string;
  isSubmitting?: boolean;
}

export function PersonForm({
  formData,
  people,
  onChange,
  idPrefix,
  isSubmitting = false,
}: PersonFormProps) {
  return (
    <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4 pr-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}shortName`} className="text-right">
          Short Name
        </Label>
        <Input
          id={`${idPrefix}shortName`}
          value={formData.shortName}
          onChange={(e) => onChange({ ...formData, shortName: e.target.value })}
          className="col-span-3"
          placeholder="e.g., Dzikri"
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}fullName`} className="text-right">
          Full Name
        </Label>
        <Input
          id={`${idPrefix}fullName`}
          value={formData.fullName}
          onChange={(e) => onChange({ ...formData, fullName: e.target.value })}
          className="col-span-3"
          placeholder="e.g., Dzikri Syairozi"
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}age`} className="text-right">
          Age
        </Label>
        <Input
          id={`${idPrefix}age`}
          type="number"
          value={formData.age}
          onChange={(e) => onChange({ ...formData, age: e.target.value })}
          className="col-span-3"
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}gender`} className="text-right">
          Gender
        </Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => onChange({ ...formData, gender: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}status`} className="text-right">
          Status
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => onChange({ ...formData, status: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alive">Alive</SelectItem>
            <SelectItem value="deceased">Deceased</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}phone`} className="text-right">
          Phone
        </Label>
        <Input
          id={`${idPrefix}phone`}
          value={formData.phone}
          onChange={(e) => onChange({ ...formData, phone: e.target.value })}
          className="col-span-3"
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}address`} className="text-right">
          Address
        </Label>
        <Input
          id={`${idPrefix}address`}
          value={formData.address}
          onChange={(e) => onChange({ ...formData, address: e.target.value })}
          className="col-span-3"
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Parents</Label>
        <div className="col-span-3 space-y-2">
          {formData.parents.map((parent, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={parent.id}
                onValueChange={(value) => {
                  const newParents = [...formData.parents];
                  newParents[index].id = value;
                  onChange({ ...formData, parents: newParents });
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <RadioGroup
                value={parent.type}
                onValueChange={(value: 'biological' | 'adoptive') => {
                  const newParents = [...formData.parents];
                  newParents[index].type = value;
                  onChange({ ...formData, parents: newParents });
                }}
                className="flex"
                disabled={isSubmitting}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="biological"
                    id={`biological-${index}`}
                  />
                  <Label htmlFor={`biological-${index}`}>Biological</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adoptive" id={`adoptive-${index}`} />
                  <Label htmlFor={`adoptive-${index}`}>Adoptive</Label>
                </div>
              </RadioGroup>
              <Button
                disabled={isSubmitting}
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newParents = formData.parents.filter(
                    (_, i) => i !== index
                  );
                  onChange({ ...formData, parents: newParents });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            disabled={isSubmitting}
            variant="outline"
            onClick={() => {
              onChange({
                ...formData,
                parents: [...formData.parents, { id: '', type: 'biological' }],
              });
            }}
          >
            Add Parent
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Spouses</Label>
        <div className="col-span-3 space-y-2">
          {formData.spouses.map((spouse, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={spouse.id}
                onValueChange={(value) => {
                  const newSpouses = [...formData.spouses];
                  newSpouses[index].id = value;
                  onChange({ ...formData, spouses: newSpouses });
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select spouse" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={spouse.status}
                onValueChange={(value: 'current' | 'deceased' | 'divorced') => {
                  const newSpouses = [...formData.spouses];
                  newSpouses[index].status = value;
                  onChange({ ...formData, spouses: newSpouses });
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
              <Button
                disabled={isSubmitting}
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newSpouses = formData.spouses.filter(
                    (_, i) => i !== index
                  );
                  onChange({ ...formData, spouses: newSpouses });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            disabled={isSubmitting}
            variant="outline"
            onClick={() => {
              onChange({
                ...formData,
                spouses: [...formData.spouses, { id: '', status: 'current' }],
              });
            }}
          >
            Add Spouse
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Children</Label>
        <div className="col-span-3 space-y-2">
          {formData.children.map((child, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={child.id}
                onValueChange={(value) => {
                  const newChildren = [...formData.children];
                  newChildren[index].id = value;
                  onChange({ ...formData, children: newChildren });
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <RadioGroup
                value={child.type}
                onValueChange={(value: 'biological' | 'adoptive') => {
                  const newChildren = [...formData.children];
                  newChildren[index].type = value;
                  onChange({ ...formData, children: newChildren });
                }}
                className="flex"
                disabled={isSubmitting}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="biological"
                    id={`child-biological-${index}`}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={`child-biological-${index}`}>
                    Biological
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="adoptive"
                    id={`child-adoptive-${index}`}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={`child-adoptive-${index}`}>Adoptive</Label>
                </div>
              </RadioGroup>
              <Button
                disabled={isSubmitting}
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newChildren = formData.children.filter(
                    (_, i) => i !== index
                  );
                  onChange({ ...formData, children: newChildren });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            disabled={isSubmitting}
            variant="outline"
            onClick={() => {
              onChange({
                ...formData,
                children: [
                  ...formData.children,
                  { id: '', type: 'biological' },
                ],
              });
            }}
          >
            Add Child
          </Button>
        </div>
      </div>
    </div>
  );
}

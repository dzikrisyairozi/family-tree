'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { Person, Relationship } from '@/types/family';

interface PersonDetailProps {
  person: Person;
  getPersonName: (id: number) => string;
  relationships: Relationship[];
}

export function PersonDetail({
  person,
  getPersonName,
  relationships,
}: PersonDetailProps) {
  if (!person) return null;

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Short Name</Label>
        <div className="col-span-3">{person.shortName}</div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Full Name</Label>
        <div className="col-span-3">{person.fullName}</div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Age</Label>
        <div className="col-span-3">{person.age}</div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Gender</Label>
        <div className="col-span-3">{person.gender}</div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Status</Label>
        <div className="col-span-3">
          <Badge
            variant={person.status === 'alive' ? 'default' : 'destructive'}
          >
            {person.status}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Phone</Label>
        <div className="col-span-3">{person.phone}</div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Address</Label>
        <div className="col-span-3">{person.address}</div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Parents</Label>
        <div className="col-span-3">
          {person.parents && person.parents.length > 0 ? (
            person.parents.map((p) => (
              <div key={p.id}>
                {getPersonName(p.id)} ({p.type})
              </div>
            ))
          ) : (
            <div className="text-gray-500">None</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Spouses</Label>
        <div className="col-span-3">
          {person.spouses && person.spouses.length > 0 ? (
            person.spouses.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <span>{getPersonName(s.id)}</span>
                <Badge
                  variant={
                    s.status === 'current'
                      ? 'default'
                      : s.status === 'deceased'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {s.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-gray-500">None</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Children</Label>
        <div className="col-span-3">
          {person.children && person.children.length > 0 ? (
            person.children.map((c) => (
              <div key={c.id}>
                {getPersonName(c.id)} ({c.type})
              </div>
            ))
          ) : (
            <div className="text-gray-500">None</div>
          )}
        </div>
      </div>
    </div>
  );
}

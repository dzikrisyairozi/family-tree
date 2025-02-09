import { supabase } from '@/lib/supabase';

export async function transformFamilyData() {
  const { data: persons, error: personsError } = await supabase
    .from('persons')
    .select('*');

  if (personsError) throw personsError;

  const { data: relationships, error: relationshipsError } = await supabase
    .from('relationships')
    .select('*');

  if (relationshipsError) throw relationshipsError;

  return persons.map((person) => ({
    id: person.id,
    shortName: person.short_name,
    fullName: person.full_name,
    age: person.age,
    gender: person.gender,
    status: person.status,
    phone: person.phone,
    address: person.address,
    parents: relationships
      .filter(
        (rel) =>
          rel.relationship_type === 'parent-child' &&
          rel.to_person_id === person.id
      )
      .map((rel) => ({
        id: rel.from_person_id,
        type: rel.status as 'biological' | 'adoptive',
      })),
    children: relationships
      .filter(
        (rel) =>
          rel.relationship_type === 'parent-child' &&
          rel.from_person_id === person.id
      )
      .map((rel) => ({
        id: rel.to_person_id,
        type: rel.status as 'biological' | 'adoptive',
      })),
    spouses: relationships
      .filter(
        (rel) =>
          rel.relationship_type === 'spouse' &&
          (rel.from_person_id === person.id || rel.to_person_id === person.id)
      )
      .map((rel) => ({
        id:
          rel.from_person_id === person.id
            ? rel.to_person_id
            : rel.from_person_id,
        status: rel.status as 'current' | 'deceased' | 'divorced',
      })),
  }));
}

import { supabase } from '@/lib/supabase';

export async function transformFamilyData() {
  const { data: persons, error: personsError } = await supabase
    .from('persons')
    .select('*');

  if (personsError) throw personsError;

  const { data: parentChildRels, error: parentChildError } = await supabase
    .from('parent_child_relationships')
    .select('*');

  const { data: spouseRels, error: spouseError } = await supabase
    .from('spouse_relationships')
    .select('*');

  if (parentChildError) throw parentChildError;
  if (spouseError) throw spouseError;

  return persons.map((person) => ({
    ...person,
    id: person.id,
    shortName: person.short_name,
    fullName: person.full_name,
    age: person.age,
    gender: person.gender,
    status: person.status,
    phone: person.phone,
    address: person.address,
    parents: parentChildRels
      .filter((rel) => rel.child_id === person.id)
      .map((rel) => ({
        id: rel.parent_id,
        type: rel.relationship_type,
      })),
    children: parentChildRels
      .filter((rel) => rel.parent_id === person.id)
      .map((rel) => ({
        id: rel.child_id,
        type: rel.relationship_type,
      })),
    spouses: spouseRels
      .filter(
        (rel) => rel.person1_id === person.id || rel.person2_id === person.id
      )
      .map((rel) => ({
        id: rel.person1_id === person.id ? rel.person2_id : rel.person1_id,
        status: rel.status,
      })),
  }));
}

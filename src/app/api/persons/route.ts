import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: persons, error } = await supabase
      .from('persons')
      .select('*')
      .order('id');

    if (error) {
      throw error;
    }

    const transformedPersons = persons.map((person) => ({
      id: person.id,
      shortName: person.short_name,
      fullName: person.full_name,
      age: person.age,
      gender: person.gender,
      status: person.status,
      phone: person.phone,
      address: person.address,
    }));

    return NextResponse.json(transformedPersons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch persons' },
      { status: 500 }
    );
  }
}

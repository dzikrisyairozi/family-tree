'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { PersonAddDialog } from '@/components/admin/dialogs/person-add-dialog';
import { PersonDeleteDialog } from '@/components/admin/dialogs/person-delete-dialog';
import { PersonDetailDialog } from '@/components/admin/dialogs/person-detail-dialog';
import { PersonEditDialog } from '@/components/admin/dialogs/person-edit-dialog';
import { PersonTable } from '@/components/admin/person-table';
import { Button } from '@/components/ui/button';
import { useFamily } from '@/context/family-context';
import { useAddPerson } from '@/hooks/use-add-person';
import { useDeletePerson } from '@/hooks/use-delete-person';
import { useEditPerson } from '@/hooks/use-edit-person';
import { useToast } from '@/hooks/use-toast';
import type { Person, PersonFormData } from '@/types/family';

const emptyFormData: PersonFormData = {
  shortName: '',
  fullName: '',
  age: '',
  gender: '',
  status: 'alive',
  phone: '',
  address: '',
  parents: [],
  spouses: [],
  children: [],
};

export default function AdminPage() {
  const { people, setPeople, relationships } = useFamily();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<PersonFormData>(emptyFormData);
  const { toast } = useToast();

  const { addPerson, isSubmitting } = useAddPerson({
    onSuccess: () => {
      setIsAddOpen(false);
      setFormData(emptyFormData);
    },
    setPeople,
  });

  const { editPerson, isSubmitting: isEditing } = useEditPerson({
    onSuccess: () => {
      setIsEditOpen(false);
      setSelectedPerson(null);
      setFormData(emptyFormData);
      toast({
        title: 'Success',
        description: 'Person updated successfully',
      });
    },
    setPeople,
  });

  const { deletePerson, isDeleting } = useDeletePerson({
    onSuccess: () => {
      setIsDeleteOpen(false);
      setSelectedPerson(null);
      toast({
        title: 'Success',
        description: 'Person deleted successfully',
      });
    },
    setPeople,
  });

  const handleAdd = () => {
    addPerson(formData);
  };

  const handleEdit = async () => {
    if (!selectedPerson) return;

    const { success, error } = await editPerson(selectedPerson.id, formData);

    if (!success) {
      toast({
        title: 'Error',
        description: error || 'Failed to update person',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPerson) return;
    const { success, error } = await deletePerson(selectedPerson.id);

    if (!success) {
      toast({
        title: 'Error',
        description: error || 'Failed to delete person',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData(emptyFormData);
  };

  const openEdit = (person: Person) => {
    setSelectedPerson(person);
    setFormData({
      shortName: person.shortName,
      fullName: person.fullName,
      age: person.age.toString(),
      gender: person.gender,
      status: person.status,
      phone: person.phone,
      address: person.address,
      parents: person.parents.map((p) => ({
        id: p.id.toString(),
        type: p.type,
      })),
      spouses: person.spouses.map((s) => ({
        id: s.id.toString(),
        status: s.status,
      })),
      children: person.children.map((c) => ({
        id: c.id.toString(),
        type: c.type,
      })),
    });
    setIsEditOpen(true);
  };

  const getPersonName = (id: number) => {
    return people.find((p) => p.id === id)?.shortName || 'Unknown';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.a
              href="/"
              className="text-gray-500 transition-colors hover:text-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="h-6 w-6" />
            </motion.a>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Family Members
            </h1>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-white shadow-sm transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-md"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Person
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 shadow-xl backdrop-blur-sm"
        >
          <PersonTable
            people={people}
            onView={(person) => {
              setSelectedPerson(person);
              setIsDetailOpen(true);
            }}
            onEdit={openEdit}
            onDelete={(person) => {
              setSelectedPerson(person);
              setIsDeleteOpen(true);
            }}
          />
        </motion.div>

        <PersonDetailDialog
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          selectedPerson={selectedPerson}
          getPersonName={getPersonName}
          relationships={relationships}
        />

        <PersonEditDialog
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          formData={formData}
          selectedPerson={selectedPerson}
          people={people}
          isSubmitting={isEditing}
          onSubmit={handleEdit}
          onChange={setFormData}
        />

        <PersonDeleteDialog
          isOpen={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          selectedPerson={selectedPerson}
          isDeleting={isDeleting}
          onDelete={handleDelete}
        />

        <PersonAddDialog
          isOpen={isAddOpen}
          onOpenChange={setIsAddOpen}
          formData={formData}
          people={people}
          isSubmitting={isSubmitting}
          onSubmit={handleAdd}
          onChange={setFormData}
        />
      </div>
    </main>
  );
}

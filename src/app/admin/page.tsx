'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { PersonDetail } from '@/components/admin/person-detail';
import { PersonForm } from '@/components/admin/person-form';
import { PersonTable } from '@/components/admin/person-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFamily } from '@/context/family-context';
import { useAddPerson } from '@/hooks/use-add-person';
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
  const { people, setPeople } = useFamily();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<PersonFormData>(emptyFormData);

  const { addPerson, isSubmitting } = useAddPerson({
    onSuccess: () => {
      setIsAddOpen(false);
      setFormData(emptyFormData);
    },
    setPeople,
  });

  const handleAdd = () => {
    addPerson(formData);
  };

  const handleEdit = () => {
    if (!selectedPerson) return;
    const updatedPeople = people.map((p) =>
      p.id === selectedPerson.id
        ? {
            ...p,
            shortName: formData.shortName,
            fullName: formData.fullName,
            age: parseInt(formData.age) || 0,
            gender: formData.gender as 'Male' | 'Female',
            status: formData.status as 'alive' | 'deceased',
            phone: formData.phone,
            address: formData.address,
            parents: formData.parents.map((parent) => ({
              id: parseInt(parent.id),
              type: parent.type,
            })),
            spouses: formData.spouses.map((spouse) => ({
              id: parseInt(spouse.id),
              status: spouse.status,
            })),
            children: formData.children.map((child) => ({
              id: parseInt(child.id),
              type: child.type,
            })),
          }
        : p
    );
    setPeople(updatedPeople);
    setIsEditOpen(false);
    setSelectedPerson(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedPerson) return;
    setPeople(people.filter((p) => p.id !== selectedPerson.id));
    setIsDeleteOpen(false);
    setSelectedPerson(null);
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

        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Person Details</DialogTitle>
            </DialogHeader>
            {selectedPerson && (
              <PersonDetail
                person={selectedPerson}
                getPersonName={getPersonName}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Person</DialogTitle>
            </DialogHeader>
            <PersonForm
              formData={formData}
              people={people.filter((p) => p.id !== selectedPerson?.id)}
              onChange={setFormData}
              idPrefix="edit-"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{' '}
                {selectedPerson?.shortName}&apos;s record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
            </DialogHeader>
            <PersonForm
              formData={formData}
              people={people}
              onChange={setFormData}
              idPrefix="add-"
              isSubmitting={isSubmitting}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Person'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

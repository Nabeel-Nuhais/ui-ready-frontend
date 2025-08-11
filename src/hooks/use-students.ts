import { useEffect, useMemo, useState } from "react";

export type Student = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  batchId?: string | null;
};

const STORAGE_KEY = "students";

function readStorage(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Student[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(students: Student[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const existing = readStorage();
    setStudents(existing);
  }, []);

  const getById = useMemo(
    () => (id?: string | null) => students.find((s) => s.id === id),
    [students]
  );

  const create = (data: Omit<Student, "id">) => {
    const newStudent: Student = { id: crypto.randomUUID?.() || String(Date.now()), ...data };
    const next = [newStudent, ...students];
    setStudents(next);
    writeStorage(next);
    return newStudent;
  };

  const update = (updated: Student) => {
    const next = students.map((s) => (s.id === updated.id ? updated : s));
    setStudents(next);
    writeStorage(next);
  };

  const remove = (id: string) => {
    const next = students.filter((s) => s.id !== id);
    setStudents(next);
    writeStorage(next);
  };

  const assignBatch = (studentId: string, batchId: string) => {
    const next = students.map((s) => (s.id === studentId ? { ...s, batchId } : s));
    setStudents(next);
    writeStorage(next);
  };

  const unassignBatch = (studentId: string) => {
    const next = students.map((s) => (s.id === studentId ? { ...s, batchId: null } : s));
    setStudents(next);
    writeStorage(next);
  };

  const unassignByBatch = (batchId: string) => {
    const next = students.map((s) => (s.batchId === batchId ? { ...s, batchId: null } : s));
    setStudents(next);
    writeStorage(next);
  };

  return { students, create, update, remove, getById, assignBatch, unassignBatch, unassignByBatch };
}

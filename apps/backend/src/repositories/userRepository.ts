import type { Parent, Student } from "@myedspace/shared";
export const parents: Parent[] = [];

export const ParentRepo = {
  getAll: () => [...parents],
  getByEmail: (email: string) => parents.find((p) => p.email === email),
  add: (parent: Parent) => {
    parents.push(parent);
  },
};

export const students: Student[] = [];

export const StudentRepo = {
  getAll: () => [...students],
  getByEmail: (email: string) => students.find((s) => s.email === email),
  add: (student: Student) => {
    students.push(student);
  },
};

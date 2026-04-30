import { randomUUID } from "node:crypto";

export type Course = {
  id: string;
  subject: string;
  year_range: string;
  price: number;
};

export const courses: Course[] = [
  {
    id: randomUUID(),
    subject: "Maths",
    year_range: "Year 5 → 13",
    price: 199,
  },
  {
    id: randomUUID(),
    subject: "English",
    year_range: "Year 5 → 13",
    price: 199,
  },
  {
    id: randomUUID(),
    subject: "Science",
    year_range: "Year 5 → 11",
    price: 199,
  },
];

export const CourseRepo = {
  getAll: () => courses,
  getById: (id: string) => courses.find((c) => c.id === id),
  add: (course: Course) => {
    courses.push(course);
  },
};

export type Enrolment = {
  id: string;
  student_id: string;
  course_id: string;
};

export const enrolments: Enrolment[] = [];

export const EnrolmentRepo = {
  getAll: () => enrolments,
  add: (enrolment: Enrolment) => {
    enrolments.push(enrolment);
  },
};

import { randomUUID } from "node:crypto";
import type { Course, Enrolment } from "@myedspace/shared";

// In-memory course data
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

export const enrolments: Enrolment[] = [];

export const EnrolmentRepo = {
  getAll: () => enrolments,
  add: (enrolment: Enrolment) => {
    enrolments.push(enrolment);
  },
};

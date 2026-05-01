import { randomUUID } from "node:crypto";
import { CourseRepo } from "./courseRepository.js";
import type { Lesson, StudentLesson } from "@myedspace/shared";

// Dynamically assign course IDs from CourseRepo
// In production, lessons would be stored in a database with proper relations,
// but for this demo we keep it simple with in-memory data
const [maths, english, science] = CourseRepo.getAll();

export const lessons: Lesson[] = [
  // Maths lessons
  {
    id: randomUUID(),
    course_id: maths?.id || "",
    title: "Algebra Basics",
    content: "Introduction to algebraic concepts.",
  },
  {
    id: randomUUID(),
    course_id: maths?.id || "",
    title: "Geometry Essentials",
    content: "Understanding shapes and spaces.",
  },
  // English lessons
  {
    id: randomUUID(),
    course_id: english?.id || "",
    title: "Essay Writing",
    content: "How to write a compelling essay.",
  },
  // Science lessons
  {
    id: randomUUID(),
    course_id: science?.id || "",
    title: "The Scientific Method",
    content: "Steps in scientific investigation.",
  },
];

export const LessonRepo = {
  getAll: () => [...lessons],
  getByCourseId: (course_id: string) =>
    lessons.filter((l) => l.course_id === course_id),
  getById: (id: string) => lessons.find((l) => l.id === id),
  add: (lesson: Lesson) => lessons.push(lesson),
};

// StudentLessonRepo: tracks which students have accessed which lessons
export const studentLessons: StudentLesson[] = [];

export const StudentLessonRepo = {
  getAll: () => [...studentLessons],
  getByStudentId: (student_id: string) =>
    studentLessons.filter((sl) => sl.student_id === student_id),
  getByLessonId: (lesson_id: string) =>
    studentLessons.filter((sl) => sl.lesson_id === lesson_id),
  add: (studentLesson: StudentLesson) => studentLessons.push(studentLesson),
  exists: (student_id: string, lesson_id: string) =>
    studentLessons.some(
      (sl) => sl.student_id === student_id && sl.lesson_id === lesson_id,
    ),
};

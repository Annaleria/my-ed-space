// Handles LMS access: enrolments, lessons (simplified)
import { EnrolmentRepo, CourseRepo } from "../repositories/courseRepository.js";

export const LmsService = {
  getStudentEnrolments: (student_id: string) => {
    return EnrolmentRepo.getAll().filter((e) => e.student_id === student_id);
  },
  getCourses: () => CourseRepo.getAll(),
};

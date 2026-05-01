// Handles student onboarding via invitation
import { randomUUID } from "node:crypto";
import { hashPassword } from "../utils/hashPassword.js";
import { StudentRepo } from "../repositories/userRepository.js";
import type { Student } from "@myedspace/shared";
import { PurchaseRepo } from "../repositories/purchaseRepository.js";
import { EnrolmentRepo } from "../repositories/courseRepository.js";

export const OnboardingService = {
  onboardStudent: (
    invite_token: string,
    name: string,
    email: string,
    password: string,
  ) => {
    const purchase = PurchaseRepo.getAll().find(
      (p) => p.invite_token === invite_token,
    );
    if (!purchase) return null;
    // Always validate that the invite is for the provided email
    if (email !== purchase.student_email) {
      throw new Error("Email does not match invite");
    }
    // Check if student already exists by email
    const existingStudent = StudentRepo.getByEmail(email);
    if (existingStudent) {
      // Auto-enrol the student in the purchased course if not already enrolled
      // DEMO: This allows anyone with the invite token and matching email to enrol in the course.
      // In production, stricter validation and error handling would be required to prevent abuse.
      const alreadyEnrolled = EnrolmentRepo.getAll().some(
        (e) =>
          e.student_id === existingStudent.id &&
          e.course_id === purchase.course_id,
      );
      if (!alreadyEnrolled) {
        EnrolmentRepo.add({
          id: randomUUID(),
          student_id: existingStudent.id,
          course_id: purchase.course_id,
        });
      }
      return existingStudent;
    }
    // Hash the password before saving (see utils/hashPassword for security warning)
    const hashedPassword = hashPassword(password);
    const newStudent: Student = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
    };
    StudentRepo.add(newStudent);
    // Auto-enrol the student in the purchased course
    EnrolmentRepo.add({
      id: randomUUID(),
      student_id: newStudent.id,
      course_id: purchase.course_id,
    });
    return newStudent;
  },
};

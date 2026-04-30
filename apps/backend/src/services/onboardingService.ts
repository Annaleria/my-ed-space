// Handles student onboarding via invitation
import { randomUUID, createHash } from "node:crypto";
import { Student, StudentRepo } from "../repositories/userRepository.js";
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
    // Hash the password before saving
    const hashedPassword = createHash("sha256").update(password).digest("hex");
    const newStudent: Student = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
    };
    if (newStudent.email === purchase.student_email) {
      StudentRepo.add(newStudent);
      // Auto-enrol the student in the purchased course
      EnrolmentRepo.add({
        id: randomUUID(),
        student_id: newStudent.id,
        course_id: purchase.course_id,
      });
      return newStudent;
    } else {
      // In a real app, we'd handle this more gracefully (e.g. allow them to update the email)
      throw new Error("Email does not match invite");
    }
  },
};

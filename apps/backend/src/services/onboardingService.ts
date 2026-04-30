// Handles student onboarding via invitation
import { randomUUID, createHash } from "node:crypto";
import { Student, StudentRepo } from "../repositories/userRepository.js";
import { PurchaseRepo } from "../repositories/purchaseRepository.js";

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
    StudentRepo.add(newStudent);
    if (newStudent.email === purchase.student_email) {
      // Create enrolment here if we want to auto-enrol on purchase
      // - for simplicity, we'll just rely on the frontend to call the enrolment API after onboarding
      return newStudent;
    } else {
      // In a real app, we'd handle this more gracefully (e.g. allow them to update the email)
      throw new Error("Email does not match invite");
    }
  },
};

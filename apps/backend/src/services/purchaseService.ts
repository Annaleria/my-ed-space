import { randomBytes, randomUUID } from "node:crypto";
import { PurchaseRepo } from "../repositories/purchaseRepository.js";
import { CourseRepo } from "../repositories/courseRepository.js";
import { ParentRepo } from "../repositories/userRepository.js";
import type { Purchase } from "@myedspace/shared";

// In a real application, this would be moved an environment variable or configuration file
// (e.g., process.env.FRONTEND_URL or a config module) to support different deployment environments
const BASE_ONBOARD_URL = "http://localhost:3000/onboard";

export const PurchaseService = {
  /**
   * Creates a purchase, generates invite token, creates parent if needed, returns onboarding URL
   * @param purchase { parent_email, course_id, student_email }
   */
  createPurchase: (
    purchase: Omit<Purchase, "id" | "invite_token" | "parent_id"> & {
      parent_email: string;
    },
  ) => {
    // 1. Validate course exists
    const course = CourseRepo.getById(purchase.course_id);
    if (!course) {
      throw new Error("Invalid course_id");
    }

    // 2. Find or create parent by email
    let parent = ParentRepo.getByEmail(purchase.parent_email);
    if (!parent) {
      parent = { id: randomUUID(), email: purchase.parent_email };
      ParentRepo.add(parent);
    }

    // 3. Create purchase with parent_id
    const invite_token = encodeURIComponent(
      randomBytes(16).toString("base64url"),
    );
    const newPurchase: Purchase = {
      id: randomUUID(),
      parent_id: parent.id,
      course_id: purchase.course_id,
      student_email: purchase.student_email,
      invite_token,
    };
    PurchaseRepo.add(newPurchase);

    // 4. Return onboarding URL
    const onboardingUrl = `${BASE_ONBOARD_URL}?invite=${invite_token}`;
    return { ...newPurchase, onboardingUrl };
  },
  getAll: () => PurchaseRepo.getAll(),
};

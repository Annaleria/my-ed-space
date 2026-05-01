import { Router } from "express";
import { PurchaseService } from "../services/purchaseService.js";

const router = Router();

router.get("/", (_req, res) => res.json(PurchaseService.getAll()));
router.post("/", (req, res) => {
  const { parent_email, course_id, student_email } = req.body;
  if (!parent_email) {
    return res.status(400).json({ error: "Missing parent email" });
  }
  if (!course_id) {
    return res.status(400).json({ error: "Missing course ID" });
  }
  if (!student_email) {
    return res.status(400).json({ error: "Missing student email" });
  }

  try {
    const purchase = PurchaseService.createPurchase({
      parent_email,
      course_id,
      student_email,
    });
    return res.status(201).json(purchase);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

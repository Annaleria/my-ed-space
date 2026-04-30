import { Router } from "express";
import { PurchaseService } from "../services/purchaseService.js";

const router = Router();

router.get("/", (_req, res) => res.json(PurchaseService.getAll()));
router.post("/", (req, res) => {
  const { parent_email, course_id, student_email } = req.body;
  if (!parent_email || !course_id || !student_email) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const purchase = PurchaseService.createPurchase({
    parent_email,
    course_id,
    student_email,
  });
  res.status(201).json(purchase);
});

export default router;

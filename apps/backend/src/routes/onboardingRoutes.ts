import { Router } from "express";
import { OnboardingService } from "../services/onboardingService.js";

const router = Router();

router.post("/", (req, res) => {
  const { invite_token, name, email, password } = req.body;
  if (!invite_token || !name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const student = OnboardingService.onboardStudent(
    invite_token,
    name,
    email,
    password,
  );
  if (!student) return res.status(400).json({ error: "Invalid invite token" });
  const { password: _password, ...safeStudent } = student;
  res.status(201).json(safeStudent);
});

export default router;

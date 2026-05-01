import { Router } from "express";
import { OnboardingService } from "../services/onboardingService.js";

const router = Router();

router.post("/", (req, res) => {
  const { invite_token, name, email, password } = req.body;
  if (!invite_token || !name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const student = OnboardingService.onboardStudent(
      invite_token,
      name,
      email,
      password,
    );
    if (!student)
      return res.status(400).json({ error: "Invalid invite token" });
    const { password: _password, ...safeStudent } = student;
    return res.status(201).json(safeStudent);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

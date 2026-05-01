import { Router } from "express";
import { StudentRepo } from "../repositories/userRepository.js";
import { hashPassword } from "../utils/hashPassword.js";

const router = Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const student = StudentRepo.getByEmail(email);
  // Hash the incoming password before comparison (see utils/hashPassword for security warning)
  const hashedPassword = hashPassword(password);
  if (!student || student.password !== hashedPassword) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  // For demo: return student identity details (no JWT/session)
  res.json({
    student_id: student.id,
    name: student.name,
    email: student.email,
  });
});

export default router;

import { Router } from "express";
import { SessionService } from "../services/sessionService.js";

const router = Router();

router.get("/", (_req, res) => res.json(SessionService.getAll()));
router.post("/", (req, res) => {
  const { student_id } = req.body;
  if (!student_id) return res.status(400).json({ error: "Missing student_id" });
  try {
    const session = SessionService.createSession(student_id);
    return res.status(201).json(session);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

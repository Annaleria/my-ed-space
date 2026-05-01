import { Router } from "express";
import { LmsService } from "../services/lmsService.js";

const router = Router();

router.get("/enrolments/student/:student_id", (req, res) => {
  try {
    const student_id = String(req.params.student_id);
    return res.json(LmsService.getStudentEnrolments(student_id));
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

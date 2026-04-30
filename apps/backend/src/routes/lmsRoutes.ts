import { Router } from "express";
import { LmsService } from "../services/lmsService.js";

const router = Router();

router.get("/enrolments/student/:student_id", (req, res) => {
  const student_id = String(req.params.student_id);
  res.json(LmsService.getStudentEnrolments(student_id));
});

export default router;

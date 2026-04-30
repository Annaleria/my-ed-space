import express from "express";

import {
  CourseRepo,
  EnrolmentRepo,
  Enrolment,
} from "./repositories/courseRepository.js";
import { ParentRepo, StudentRepo } from "./repositories/userRepository.js";

import purchaseRoutes from "./routes/purchaseRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import lmsRoutes from "./routes/lmsRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { randomUUID } from "node:crypto";

const app = express();
const port = 3000;

app.use(express.json());

// Core flow routes
app.use("/api/purchases", purchaseRoutes);
app.use("/api/onboard", onboardingRoutes);
app.use("/api/lms", lmsRoutes);
app.use("/api/sessions", sessionRoutes);

// Courses
app.get("/api/courses", (req, res) => res.json(CourseRepo.getAll()));
app.get("/api/courses/:id", (req, res) => {
  const course = CourseRepo.getById(String(req.params.id));
  if (!course) return res.status(404).json({ error: "Not found" });
  res.json(course);
});

// Parents
app.get("/api/parents", (req, res) => res.json(ParentRepo.getAll()));

// Students
app.get("/api/students", (req, res) => res.json(StudentRepo.getAll()));

// Enrolments
app.get("/api/enrolments", (req, res) => res.json(EnrolmentRepo.getAll()));
app.post("/api/enrolments", (req, res) => {
  const { student_id, course_id } = req.body ?? {};

  if (
    typeof student_id !== "string" ||
    student_id.trim() === "" ||
    typeof course_id !== "string" ||
    course_id.trim() === ""
  ) {
    return res.status(400).json({
      error: "student_id and course_id are required non-empty strings",
    });
  }

  const enrolment: Enrolment = {
    id: randomUUID(),
    student_id,
    course_id,
  };
  EnrolmentRepo.add(enrolment);
  res.status(201).json(enrolment);
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

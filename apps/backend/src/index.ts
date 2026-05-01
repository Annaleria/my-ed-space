import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { CourseRepo } from "./repositories/courseRepository.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import lmsRoutes from "./routes/lmsRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);

// Core flow routes
app.use("/api/purchases", purchaseRoutes);
app.use("/api/onboard", onboardingRoutes);
app.use("/api/lms", lmsRoutes);
app.use("/api/lessons", lessonRoutes);

// Courses
app.get("/api/courses", (req, res) => res.json(CourseRepo.getAll()));
app.get("/api/courses/:id", (req, res) => {
  const course = CourseRepo.getById(String(req.params.id));
  if (!course) return res.status(404).json({ error: "Not found" });
  res.json(course);
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

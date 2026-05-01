import { Router } from "express";
import {
  LessonRepo,
  StudentLessonRepo,
} from "../repositories/lessonRepository.js";
import { EnrolmentRepo } from "../repositories/courseRepository.js";
import { randomUUID } from "node:crypto";

const router = Router();

// List lessons for a course
//
// SECURITY NOTE (Demo Only):
// Passing student_id as a query parameter allows any client to view lessons for any course by manipulating the student_id value.
// In a real production system, student_id would be validated against the authenticated session, not just a query parameter.
// Here, we explicitly check that the student_id is enrolled in the course using EnrolmentRepo, but this is not secure for production.
// See AGENTS.md for more on demo security.
router.get("/course/:course_id", (req, res) => {
  const { course_id } = req.params;
  const student_id =
    typeof req.query.student_id === "string" ? req.query.student_id : undefined;

  if (!student_id) {
    return res.status(400).json({ error: "Missing student_id" });
  }

  // Authorisation: student must be enrolled in the course (via EnrolmentRepo)
  // Explicitly validate student_id against enrolled students for the course
  const isEnrolled = EnrolmentRepo.getAll().some(
    (enrol) => enrol.student_id === student_id && enrol.course_id === course_id,
  );

  if (!isEnrolled) {
    // Not enrolled in this course
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const courseLessons = LessonRepo.getByCourseId(course_id);
    if (!courseLessons || courseLessons.length === 0) {
      // No lessons were found for this course
      return res
        .status(404)
        .json({ error: "No lessons found for this course" });
    }

    // Return all lessons for the course
    return res.json(courseLessons);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// List lessons a student has accessed
//
// SECURITY NOTE (Demo Only):
// This endpoint allows any client to query lesson access records for any student by providing a student_id in the URL.
// In a real production system, this would expose private student data and is NOT secure.
//
// For a demo/minimal product, you could mitigate this by requiring the client to send the logged-in student's ID
// in a custom header (e.g., X-Student-Id), and check that it matches req.params.student_id. This is not secure,
// but prevents casual scraping. See AGENTS.md for minimal auth notes.
//
// In production, you would implement:
//   - Real authentication (sessions, JWT, OAuth, etc.)
//   - Authorisation checks to ensure the requesting user is allowed to view this student's data
//   - Secure session management and CSRF protection
//   - Proper error handling and logging
//
router.get("/student/:student_id", (req, res) => {
  const { student_id } = req.params;
  // DEMO: No real auth. In production, check that the requester is authorised to view this student's data.
  try {
    const studentLessons = StudentLessonRepo.getByStudentId(student_id);
    return res.json(studentLessons);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Enrol (access) a lesson for a student
router.post("/access", (req, res) => {
  const { student_id, lesson_id } = req.body;
  if (!student_id || !lesson_id) {
    return res.status(400).json({ error: "Missing student_id or lesson_id" });
  }

  // Validate that the lesson exists
  try {
    const lesson = LessonRepo.getById(lesson_id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    // Authorisation: student must be enrolled in the course containing the lesson
    const isEnrolled = EnrolmentRepo.getAll().some(
      (enrol) =>
        enrol.student_id === student_id && enrol.course_id === lesson.course_id,
    );
    if (!isEnrolled) {
      return res
        .status(403)
        .json({ error: "Forbidden: not enrolled in course for this lesson" });
    }
    if (StudentLessonRepo.exists(student_id, lesson_id)) {
      return res.status(200).json({ message: "Already accessed" });
    }
    StudentLessonRepo.add({
      id: randomUUID(),
      student_id,
      lesson_id,
    });
    return res.status(201).json({ message: "Lesson accessed" });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

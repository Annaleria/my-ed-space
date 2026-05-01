import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Course } from "@myedspace/shared";

// In a real app, student_id would come from auth/session
// in production localStorage is not a secure place to store sensitive info, but for this demo we keep it simple
function getStudentId() {
  return localStorage.getItem("student_id") || "";
}

export default function LmsDashboard() {
  const navigate = useNavigate();
  const [enrolments, setEnrolments] = useState<{ course_id: string }[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [studentId] = useState(getStudentId());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) {
      return;
    }
    let isMounted = true;
    const encodedStudentId = encodeURIComponent(studentId);
    Promise.allSettled([
      fetch(`/api/lms/enrolments/student/${encodedStudentId}`).then((res) => {
        if (!res.ok)
          throw new Error(
            `Failed to load enrolments (${res.status} ${res.statusText})`,
          );
        return res.json();
      }),
      fetch("/api/courses").then((res) => {
        if (!res.ok)
          throw new Error(
            `Failed to load courses (${res.status} ${res.statusText})`,
          );
        return res.json();
      }),
    ])
      .then(([enrolmentsResult, coursesResult]) => {
        if (!isMounted) return;
        const errors: string[] = [];

        if (enrolmentsResult.status === "fulfilled") {
          setEnrolments(enrolmentsResult.value);
        } else {
          errors.push(
            enrolmentsResult.reason instanceof Error
              ? enrolmentsResult.reason.message
              : String(enrolmentsResult.reason),
          );
        }

        if (coursesResult.status === "fulfilled") {
          setCourses(coursesResult.value);
        } else {
          errors.push(
            coursesResult.reason instanceof Error
              ? coursesResult.reason.message
              : String(coursesResult.reason),
          );
        }

        setError(errors.join(" "));
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [studentId]);

  // Redirect to onboarding if not logged in
  // In a real app, we'd have a more robust auth flow with protected routes, but for this demo we keep it simple
  useEffect(() => {
    if (!studentId) {
      navigate("/onboard", { replace: true });
    }
  }, [studentId, navigate]);

  if (!studentId) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Student Dashboard</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <h2>Your Courses</h2>
      <ul>
        {enrolments.length === 0 && <li>No courses enrolled yet.</li>}
        {enrolments.map((enrolment) => {
          // In a real app, we'd likely use a Map for courses if we expect a large number to avoid O(n) lookups,
          // but for simplicity we use find here
          const course = courses.find((c) => c.id === enrolment.course_id);
          return (
            <li key={enrolment.course_id} style={{ marginBottom: 12 }}>
              {course ? (
                <>
                  <b>{course.subject}</b> <span>({course.year_range})</span>
                  <button
                    style={{ marginLeft: 12 }}
                    onClick={() => navigate(`/lms/course/${course.id}`)}
                  >
                    View Lessons
                  </button>
                </>
              ) : (
                <span>Unknown course ({enrolment.course_id})</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

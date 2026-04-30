import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Course } from "@myedspace/shared";

// In a real app, student_id would come from auth/session
// in production localStorage is not a secure place to store sensitive info, but for this demo we keep it simple
function getStudentId() {
  return localStorage.getItem("student_id") || "";
}

export default function LmsDashboard() {
  const [enrolments, setEnrolments] = useState<{ course_id: string }[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const studentId = getStudentId();

  useEffect(() => {
    if (!studentId) {
      navigate("/onboard");
      return;
    }
    const encodedStudentId = encodeURIComponent(studentId);
    // Error handling is kept simple for speed, but in a production app we'd want to
    // handle errors from each request separately to provide better feedback to the user
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
      .finally(() => setLoading(false));
  }, [studentId, navigate]);

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
          // In a real app, we'd likely have more course details in the enrolment data to avoid this lookup, but we keep it simple here for speed
          // Also would consider using a Map for courses if we expect a large number to avoid O(n) lookups, but for simplicity we use find here
          const course = courses.find((c) => c.id === enrolment.course_id);
          return (
            <li key={enrolment.course_id}>
              {course ? (
                <b>{course.subject}</b>
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

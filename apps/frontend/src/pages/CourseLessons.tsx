import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Lesson, StudentLesson } from "@myedspace/shared";

// In production, use a context provider for same-window state and the 'storage' event for cross-tab sync.
// For this demo, we simply read studentId from localStorage once on mount.
function getStudentId(): string {
  return localStorage.getItem("student_id") || "";
}

export default function CourseLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [accessed, setAccessed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // For a demo, we do not sync studentId between tabs or on same-window changes.
  // In production, use React context for in-app state and listen for 'storage' events for cross-tab sync.
  const [studentId] = useState(getStudentId());

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;
    Promise.all([
      // WARNING: Passing student_id as a query parameter is insecure and only for demo purposes.
      // In production, never trust client-supplied IDs—validate student identity on the backend using authenticated session data.
      fetch(
        `/api/lessons/course/${courseId}?student_id=${encodeURIComponent(studentId)}`,
      ).then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load lessons (${res.status})`);
        return res.json();
      }),
      fetch(`/api/lessons/student/${studentId}`).then(async (res) => {
        if (!res.ok)
          throw new Error(`Failed to load accessed lessons (${res.status})`);
        return res.json();
      }),
    ])
      .then(([lessonList, studentLessons]: [Lesson[], StudentLesson[]]) => {
        if (!isMounted) return;
        setLessons(lessonList);
        setAccessed(studentLessons.map((sl) => sl.lesson_id));
        setError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [courseId, studentId]);

  const handleAccess = async (lessonId: string) => {
    try {
      const res = await fetch("/api/lessons/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, lesson_id: lessonId }),
      });
      if (!res.ok) {
        throw new Error(`Failed to access lesson (${res.status})`);
      }
      setAccessed((prev) => [...prev, lessonId]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to access lesson");
      }
    }
  };

  if (loading) return <div>Loading lessons...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Lessons</h2>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id} style={{ marginBottom: 12 }}>
            <b>{lesson.title}</b>
            <div>{lesson.content}</div>
            {accessed.includes(lesson.id) ? (
              <span style={{ color: "green" }}>Accessed</span>
            ) : (
              <button onClick={() => handleAccess(lesson.id)}>
                Access Lesson
              </button>
            )}
          </li>
        ))}
      </ul>
      <button style={{ marginTop: 24 }} onClick={() => navigate("/lms")}>
        Return to Dashboard
      </button>
    </div>
  );
}

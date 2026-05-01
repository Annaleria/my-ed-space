import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Course } from "@myedspace/shared";

export default function Checkout() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loadingError, setLoadingError] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [error, setError] = useState("");
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    fetch(`/api/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load course");
        return res.json();
      })
      .then((data: Course) => {
        if (isActive) {
          setCourse(data);
          setLoadingError("");
        }
      })
      .catch((err) => {
        if (isActive) {
          setCourse(null);
          setLoadingError(err instanceof Error ? err.message : "Unknown error");
        }
      });
    return () => {
      isActive = false;
    };
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parent_email: parentEmail,
          course_id: courseId,
          student_email: studentEmail,
        }),
      });
      if (!res.ok) throw new Error("Purchase failed");
      const data: { invite_token: string } = await res.json();
      // Always follow the backend-driven post-purchase flow so enrolment
      // creation remains centralized outside the frontend.
      setInviteToken(data.invite_token);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  let content;
  if (inviteToken) {
    content = (
      <div>
        <h2>Purchase Complete!</h2>
        <p>Share this onboarding link with your student:</p>
        <code>{`${globalThis.location.origin}/onboard?invite=${inviteToken}`}</code>
        <p>
          Or use this invite token: <code>{inviteToken}</code>
        </p>
      </div>
    );
  } else {
    content = (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="parentEmail">Parent Email:</label>
          <input
            type="email"
            name="parentEmail"
            id="parentEmail"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="studentEmail">Student Email:</label>
          <input
            type="email"
            id="studentEmail"
            name="studentEmail"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Buy</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    );
  }

  if (loadingError)
    return <div style={{ color: "red" }}>Error: {loadingError}</div>;
  if (!course) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Checkout: {course.subject}</h1>
      {content}
    </div>
  );
}

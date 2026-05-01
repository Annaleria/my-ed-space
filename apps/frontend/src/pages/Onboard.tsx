import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Onboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const invite = params.get("invite");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if invite is missing
  // In a real app, you might want to show a specific error message instead of redirecting,
  // but for this demo we keep it simple and just go back to the homepage.
  // DEMO: Also be aware that the useEffect will execute on every render before the conditional return,
  // potentially causing multiple redirects or race conditions, but for this demo we assume the invite
  // parameter is either present on initial load or not at all.
  useEffect(() => {
    if (!invite) {
      navigate("/", { replace: true });
    }
  }, [invite, navigate]);
  // While redirecting, render nothing
  if (!invite) {
    return null;
  }

  // Password would be hashed, validated and stored on the backend in a real app,
  // but we keep it simple here for speed
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_token: invite, name, email, password }),
      });
      if (!res.ok) throw new Error("Onboarding failed");
      const data = await res.json();
      // Explicitly validate response fields before storing
      if (
        typeof data.id === "string" &&
        data.id.trim() !== "" &&
        typeof data.email === "string" &&
        data.email.trim() !== "" &&
        data.email.trim() === email.trim()
      ) {
        localStorage.setItem("student_id", data.id);
        localStorage.setItem("student_email", data.email);
        setSuccess(true);
        setTimeout(() => navigate("/lms"), 1500);
      } else {
        setError(
          "Invalid onboarding response: missing or mismatched student_id or email",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Onboarding</h1>
      {invite && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Complete Onboarding</button>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {success && (
            <div style={{ color: "green" }}>
              Onboarding successful! Redirecting...
            </div>
          )}
        </form>
      )}
    </div>
  );
}

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Onboard() {
  const params = new URLSearchParams(useLocation().search);
  const invite = params.get("invite");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password would be hashed and validated on the backend in a real app, but we keep it simple here for speed
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_token: invite, name, email, password }),
      });
      // Onboarding failure could be due to invalid token or other issues, so we check response status
      // Error messaging is kept generic for speed, but would be more specific in a production app
      // Such as, checks for invite token validity, valid email format, password strength, and other potential issues on the backend
      // returning appropriate status codes and messages
      if (!res.ok) throw new Error("Onboarding failed");
      setSuccess(true);
      setTimeout(() => navigate("/lms"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Onboarding</h1>
      {invite ? (
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
      ) : (
        <p>Missing invite token.</p>
      )}
    </div>
  );
}

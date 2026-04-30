import { useLocation } from "react-router-dom";

export default function Onboard() {
  const params = new URLSearchParams(useLocation().search);
  const invite = params.get("invite");

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Onboarding</h1>
      {invite ? (
        <div>
          <p>Welcome! Your invite token is:</p>
          <code>{invite}</code>
          <p>Share this onboarding link with your student:</p>
          <code>{`${globalThis.location.origin}/onboard?invite=${invite}`}</code>
          <p>Continue onboarding here...</p>
        </div>
      ) : (
        <p>Missing invite token.</p>
      )}
    </div>
  );
}

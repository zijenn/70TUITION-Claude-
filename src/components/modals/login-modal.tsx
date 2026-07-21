"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";

export function LoginModalContent() {
  const { closeModal, showToast } = useUI();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    await signIn("google");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Could not create your account.");
          return;
        }
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError(
          mode === "register" ? "Account created — please log in." : "Invalid email or password."
        );
        return;
      }
      closeModal();
      showToast(mode === "register" ? "Account created. You're logged in." : "Logged in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="modal-close" onClick={closeModal}>
        ×
      </button>
      <h3 className="serif">{mode === "login" ? "Log in to 70 Tuition" : "Create your account"}</h3>
      <p className="sub">You&apos;ll need an account to message or shortlist a match.</p>
      <button type="button" className="google-btn" onClick={handleGoogle}>
        Continue with Google
      </button>
      <div className="divider">OR</div>
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && <div className="form-error">{error}</div>}
        <button className="btn-primary" style={{ width: "100%", marginTop: 4 }} disabled={loading} type="submit">
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
      <p className="auth-switch">
        {mode === "login" ? (
          <>
            New here?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Log in
            </button>
          </>
        )}
      </p>
    </>
  );
}

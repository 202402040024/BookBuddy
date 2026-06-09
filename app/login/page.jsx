"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email:    email.trim().toLowerCase(),
      password: password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Incorrect email or password. Please try again.");
      return;
    }

    // Fetch the new session to know the role
    const res  = await fetch("/api/auth/session");
    const data = await res.json();
    const role = data?.user?.role;

    // Hard navigate — clears all state properly
    window.location.href = role === "admin" ? "/admin" : "/";
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>📚</div>
        <h1 style={s.title}>Welcome Back</h1>
        <p style={s.sub}>Sign in to your BookBuddy account</p>

        <form onSubmit={handleSubmit} method="post" style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={s.input}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={s.input}
            />
            <div style={{ textAlign: "right" }}>
              <Link href="/forgot-password" style={s.forgot}>Forgot password?</Link>
            </div>
          </div>

          {error && (
            <div style={s.errorBox}>⚠️ {error}</div>
          )}

          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={s.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={s.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page:  { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" },
  card:  {
    background: "white", borderRadius: "20px", padding: "44px 40px",
    width: "100%", maxWidth: "420px",
    border: "1px solid #e5e7eb", boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
    textAlign: "center",
  },
  icon:  { fontSize: "52px", marginBottom: "12px" },
  title: { fontSize: "28px", fontWeight: "800", margin: "0 0 6px", color: "#111827" },
  sub:   { color: "#6b7280", margin: "0 0 28px", fontSize: "15px" },
  form:  { display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontWeight: "600", fontSize: "14px", color: "#374151" },
  input: {
    padding: "12px 14px", border: "1.5px solid #d1d5db", borderRadius: "10px",
    fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box", color: "#111827",
  },
  forgot: { fontSize: "13px", color: "#4f46e5", textDecoration: "none" },
  errorBox: {
    background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
    borderRadius: "10px", padding: "12px 14px", fontSize: "14px", fontWeight: "600",
  },
  btn: {
    padding: "14px", background: "#4f46e5", color: "white", border: "none",
    borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer",
  },
  footer:{ marginTop: "24px", color: "#6b7280", fontSize: "14px" },
  link:  { color: "#4f46e5", fontWeight: "600", textDecoration: "none" },
};

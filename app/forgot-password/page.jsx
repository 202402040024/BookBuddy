"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd call an API to send a reset email.
    // For this demo, we just simulate success.
    setSubmitted(true);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🔑</div>
        <h1 style={styles.title}>Forgot Password</h1>

        {submitted ? (
          <div>
            <div style={styles.successBox}>
              <p style={{ margin: 0 }}>
                ✓ If an account with <strong>{email}</strong> exists, a password reset link has been sent.
              </p>
            </div>
            <Link href="/login" style={styles.backLink}>← Back to Login</Link>
          </div>
        ) : (
          <>
            <p style={styles.subtitle}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={styles.input}
                />
              </div>
              <button type="submit" style={styles.btn}>Send Reset Link</button>
            </form>
            <p style={styles.switchText}>
              <Link href="/login" style={styles.switchLink}>← Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  iconWrap: { fontSize: "48px", marginBottom: "16px" },
  title: { fontSize: "28px", fontWeight: "800", margin: "0 0 8px", color: "#111827" },
  subtitle: { color: "#6b7280", margin: "0 0 24px", lineHeight: "1.6" },
  form: { display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontWeight: "600", fontSize: "14px", color: "#374151" },
  input: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },
  btn: {
    padding: "14px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "16px",
    color: "#166534",
    marginBottom: "20px",
    textAlign: "left",
    lineHeight: "1.5",
  },
  backLink: {
    display: "inline-block",
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
  switchText: { marginTop: "20px" },
  switchLink: { color: "#4f46e5", fontWeight: "600", textDecoration: "none" },
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();

    if (res.ok) {
      router.push("/login?registered=true");
    } else {
      setError(data.message || "Registration failed.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>📚</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join BookBuddy and start your reading journey</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link href="/login" style={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  iconWrap: { fontSize: "48px", marginBottom: "16px" },
  title: { fontSize: "28px", fontWeight: "800", margin: "0 0 8px", color: "#111827" },
  subtitle: { color: "#6b7280", margin: "0 0 28px" },
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
  error: {
    background: "#fef2f2",
    color: "#ef4444",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "14px",
    border: "1px solid #fecaca",
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
    marginTop: "4px",
  },
  switchText: { marginTop: "24px", color: "#6b7280", fontSize: "14px" },
  switchLink: { color: "#4f46e5", fontWeight: "600", textDecoration: "none" },
};

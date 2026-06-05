"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>📚</div>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to your BookBuddy account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
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
              placeholder="••••••••"
              required
              style={styles.input}
            />
            <Link href="/forgot-password" style={styles.forgot}>Forgot password?</Link>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.switchText}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={styles.switchLink}>Create one</Link>
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
    transition: "border-color 0.2s",
  },
  forgot: { textAlign: "right", fontSize: "13px", color: "#4f46e5", textDecoration: "none" },
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

"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [savedBooks, setSavedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    setForm({
      name: session.user.name || "",
      bio: session.user.bio || "",
      avatar: session.user.avatar || "",
    });
    setSavedBooks(JSON.parse(localStorage.getItem("savedBooks") || "[]"));
  }, [session, router]);

  if (!session) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch(`/api/users/${session.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await update({ name: form.name, avatar: form.avatar });
      setMessage("Profile updated successfully!");
    } else {
      setMessage("Failed to update profile.");
    }
    setSaving(false);
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.avatarWrap}>
          {form.avatar ? (
            <img src={form.avatar} alt={form.name} style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarFallback}>
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 style={styles.sidebarName}>{session.user.name}</h2>
          <p style={styles.sidebarEmail}>{session.user.email}</p>
          {session.user.role === "admin" && (
            <span style={styles.adminBadge}>Admin</span>
          )}
        </div>
        <nav style={styles.sideNav}>
          {[
            { key: "profile", label: "👤 My Profile" },
            { key: "library", label: "📚 My Library" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                ...styles.navBtn,
                ...(activeTab === t.key ? styles.navBtnActive : {}),
              }}
            >
              {t.label}
            </button>
          ))}
          {session.user.role === "admin" && (
            <Link href="/admin" style={styles.navLink}>⚙️ Admin Panel</Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ ...styles.navBtn, color: "#ef4444", marginTop: "16px" }}
          >
            🚪 Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {activeTab === "profile" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Edit Profile</h2>
            <form onSubmit={handleSave} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Avatar URL</label>
                <input
                  value={form.avatar}
                  onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  style={styles.textarea}
                />
              </div>
              {message && (
                <p style={{ color: message.includes("success") ? "#16a34a" : "#ef4444", fontWeight: "600" }}>
                  {message}
                </p>
              )}
              <button type="submit" disabled={saving} style={styles.saveBtn}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "library" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>My Library ({savedBooks.length})</h2>
            {savedBooks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
                <p style={{ fontSize: "40px" }}>📭</p>
                <p>No books saved yet.</p>
                <Link href="/books" style={styles.browseBtn}>Browse Books</Link>
              </div>
            ) : (
              <div style={styles.bookList}>
                {savedBooks.map((book) => (
                  <div key={book._id} style={styles.bookItem}>
                    <div style={styles.bookCover}>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} style={styles.bookImg} />
                      ) : (
                        <span style={{ fontSize: "24px" }}>📚</span>
                      )}
                    </div>
                    <div style={styles.bookInfo}>
                      <p style={styles.bookTitle}>{book.title}</p>
                      <p style={styles.bookAuthor}>{book.author}</p>
                      <p style={styles.bookPrice}>₹{book.price}</p>
                    </div>
                    <Link href={`/books/${book._id}`} style={styles.viewBtn}>View</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "grid", gridTemplateColumns: "260px 1fr", gap: "28px", alignItems: "start" },
  sidebar: {
    background: "white",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e5e7eb",
  },
  avatarWrap: { textAlign: "center", marginBottom: "24px" },
  avatarImg: { width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px" },
  avatarFallback: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 auto 12px",
  },
  sidebarName: { fontSize: "18px", fontWeight: "700", margin: "0 0 4px", color: "#111827" },
  sidebarEmail: { fontSize: "13px", color: "#6b7280", margin: "0 0 8px" },
  adminBadge: {
    display: "inline-block",
    background: "#4f46e5",
    color: "white",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  sideNav: { display: "flex", flexDirection: "column", gap: "4px" },
  navBtn: {
    background: "none",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
    textAlign: "left",
  },
  navBtnActive: { background: "#e0e7ff", color: "#4f46e5" },
  navLink: {
    display: "block",
    padding: "10px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
  },
  main: {},
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid #e5e7eb",
  },
  cardTitle: { fontSize: "22px", fontWeight: "700", margin: "0 0 24px", color: "#111827" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontWeight: "600", fontSize: "14px", color: "#374151" },
  input: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  saveBtn: {
    padding: "12px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  browseBtn: {
    display: "inline-block",
    marginTop: "12px",
    padding: "10px 18px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
  },
  bookList: { display: "flex", flexDirection: "column", gap: "12px" },
  bookItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    background: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  bookCover: {
    width: "48px",
    height: "64px",
    borderRadius: "8px",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  bookImg: { width: "100%", height: "100%", objectFit: "cover" },
  bookInfo: { flex: 1 },
  bookTitle: { fontWeight: "700", margin: "0 0 2px", color: "#111827", fontSize: "15px" },
  bookAuthor: { color: "#6b7280", margin: "0 0 2px", fontSize: "13px" },
  bookPrice: { color: "#4f46e5", fontWeight: "700", margin: 0, fontSize: "14px" },
  viewBtn: {
    padding: "8px 14px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
};

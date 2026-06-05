"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [books, setBooks]           = useState([]);
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]           = useState({ show: false, msg: "", type: "success" });
  const [activeTab, setActiveTab]   = useState("books");

  /* ── helpers ─────────────────────────────── */
  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res  = await fetch("/api/books");
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("loadBooks error", e);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("loadUsers error", e);
    }
  };

  useEffect(() => {
    loadBooks();
    loadUsers();
    // toast after redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get("added"))   showToast("Book added successfully! 🎉");
    if (params.get("updated")) showToast("Book updated successfully! ✅");
    if (params.get("added") || params.get("updated")) {
      window.history.replaceState({}, "", "/admin");
    }
  }, []); // eslint-disable-line

  const handleDelete = async (id, title) => {
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b._id !== id));
        showToast(`"${title}" deleted.`);
      } else {
        showToast("Delete failed.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
    setDeleteConfirm(null);
  };

  /* ── derived data ─────────────────────────── */
  const genres   = [...new Set(books.map((b) => b.genre).filter(Boolean))];
  const filtered = books.filter((b) => {
    const q = search.toLowerCase();
    return (
      (b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)) &&
      (genreFilter ? b.genre === genreFilter : true)
    );
  });

  const stats = [
    { label: "Total Books",  value: books.length,                                         icon: "📚", bg: "#e0e7ff", fg: "#4f46e5" },
    { label: "Available",    value: books.filter((b) => b.status === "Available").length, icon: "✅", bg: "#dcfce7", fg: "#166534" },
    { label: "Featured",     value: books.filter((b) => b.featured).length,               icon: "⭐", bg: "#fef9c3", fg: "#92400e" },
    { label: "Bestsellers",  value: books.filter((b) => b.bestseller).length,             icon: "🔥", bg: "#fee2e2", fg: "#991b1b" },
    { label: "New Arrivals", value: books.filter((b) => b.newArrival).length,             icon: "🆕", bg: "#d1fae5", fg: "#065f46" },
    { label: "Users",        value: users.length,                                         icon: "👥", bg: "#e0f2fe", fg: "#0369a1" },
  ];

  /* ── render ───────────────────────────────── */
  return (
    <div style={s.wrap}>

      {/* ══ TOP HEADER ══ */}
      <div style={s.topHeader}>
        <div>
          <h1 style={s.title}>⚙️ Admin Panel</h1>
          <p style={s.sub}>Manage books, categories and users.</p>
        </div>
        <Link href="/" style={s.siteLink}>← Back to Site</Link>
      </div>

      {/* ══ ADD NEW BOOK — always visible banner ══ */}
      <div style={s.addBanner}>
        <div>
          <p style={s.addBannerTitle}>➕ Add a new book to your store</p>
          <p style={s.addBannerSub}>Fill in the title, author, genre, price and more.</p>
        </div>
        <Link href="/admin/add" style={s.addBannerBtn}>
          ➕ Add New Book
        </Link>
      </div>

      {/* ══ STATS ══ */}
      <div style={s.statsRow}>
        {stats.map((st) => (
          <div key={st.label} style={{ ...s.statCard, background: st.bg }}>
            <span style={s.statIcon}>{st.icon}</span>
            <div>
              <p style={{ ...s.statVal, color: st.fg }}>{st.value}</p>
              <p style={s.statLbl}>{st.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══ TOAST ══ */}
      {toast.show && (
        <div style={{ ...s.toast, ...(toast.type === "error" ? s.toastErr : s.toastOk) }}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* ══ TABS + inline add button ══ */}
      <div style={s.tabRow}>
        <div style={s.tabs}>
          {[
            { key: "books", label: `📖 Books (${books.length})` },
            { key: "users", label: `👥 Users (${users.length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{ ...s.tab, ...(activeTab === t.key ? s.tabOn : {}) }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "books" && (
          <Link href="/admin/add" style={s.addTabBtn}>
            ➕ Add New Book
          </Link>
        )}
      </div>

      {/* ══ BOOKS TAB ══ */}
      {activeTab === "books" && (
        <div style={s.card}>
          {/* search / filter row */}
          <div style={s.filterRow}>
            <div style={s.searchBox}>
              <span>🔍</span>
              <input
                placeholder="Search title or author…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={s.searchInput}
              />
              {search && (
                <button onClick={() => setSearch("")} style={s.xBtn}>✕</button>
              )}
            </div>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              style={s.select}
            >
              <option value="">All Genres</option>
              {genres.map((g) => <option key={g}>{g}</option>)}
            </select>
            <span style={s.count}>{filtered.length} / {books.length} books</span>
          </div>

          {/* table states */}
          {loading ? (
            <div style={s.center}>⏳ Loading books…</div>
          ) : filtered.length === 0 ? (
            <div style={s.center}>
              <p style={{ fontSize: "48px", margin: 0 }}>📭</p>
              <p style={{ fontWeight: "700", color: "#111827", margin: "8px 0 4px" }}>No books yet</p>
              <p style={{ color: "#6b7280", margin: "0 0 20px" }}>Add your first book using the button above.</p>
              <Link href="/admin/add" style={s.addTabBtn}>➕ Add New Book</Link>
            </div>
          ) : (
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["#","Cover","Title / Author","Genre","Price","Rating","Status","Tags","Actions"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((book, i) => (
                    <tr key={book._id} style={s.tr}>
                      <td style={{ ...s.td, color: "#9ca3af" }}>{i + 1}</td>
                      <td style={s.td}>
                        {book.coverImage
                          ? <img src={book.coverImage} alt="" style={s.thumb} />
                          : <div style={s.thumbFallback}>📚</div>}
                      </td>
                      <td style={s.td}>
                        <p style={s.bTitle}>{book.title}</p>
                        <p style={s.bAuthor}>{book.author}</p>
                      </td>
                      <td style={s.td}><span style={s.chip("#e0e7ff","#4f46e5")}>{book.genre}</span></td>
                      <td style={{ ...s.td, fontWeight: "700", color: "#4f46e5" }}>₹{book.price}</td>
                      <td style={{ ...s.td, color: "#92400e" }}>⭐ {book.rating}</td>
                      <td style={s.td}>
                        <span style={s.chip(
                          book.status === "Available" ? "#dcfce7" : book.status === "Out of Stock" ? "#fee2e2" : "#fef9c3",
                          book.status === "Available" ? "#166534" : book.status === "Out of Stock" ? "#991b1b" : "#92400e"
                        )}>{book.status}</span>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          {book.featured   && <span style={s.chip("#e0e7ff","#4f46e5")}>⭐ Featured</span>}
                          {book.bestseller && <span style={s.chip("#fef9c3","#92400e")}>🔥 Best</span>}
                          {book.newArrival && <span style={s.chip("#dcfce7","#166534")}>🆕 New</span>}
                        </div>
                      </td>
                      <td style={{ ...s.td, whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <Link href={`/admin/edit/${book._id}`} style={s.editBtn}>✏️ Edit</Link>
                          <button
                            onClick={() => setDeleteConfirm({ id: book._id, title: book.title })}
                            style={s.delBtn}
                          >🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ USERS TAB ══ */}
      {activeTab === "users" && (
        <div style={s.card}>
          {users.length === 0 ? (
            <div style={s.center}>
              <p style={{ fontSize: "40px", margin: 0 }}>👤</p>
              <p style={{ color: "#6b7280", margin: "8px 0 0" }}>No registered users yet.</p>
            </div>
          ) : (
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["#","Name","Email","Role","Joined"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} style={s.tr}>
                      <td style={{ ...s.td, color: "#9ca3af" }}>{i + 1}</td>
                      <td style={s.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={s.avatar}>{u.name?.charAt(0).toUpperCase()}</div>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ ...s.td, color: "#6b7280" }}>{u.email}</td>
                      <td style={s.td}>
                        <span style={s.chip(
                          u.role === "admin" ? "#e0e7ff" : "#f3f4f6",
                          u.role === "admin" ? "#4f46e5" : "#374151"
                        )}>{u.role}</span>
                      </td>
                      <td style={{ ...s.td, color: "#6b7280" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ DELETE MODAL ══ */}
      {deleteConfirm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <p style={{ fontSize: "48px", margin: "0 0 12px" }}>🗑️</p>
            <h2 style={{ margin: "0 0 10px", color: "#111827" }}>Delete Book?</h2>
            <p style={{ color: "#4b5563", margin: "0 0 28px", lineHeight: 1.6 }}>
              Permanently delete <strong>&quot;{deleteConfirm.title}&quot;</strong>?<br />
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={s.cancelBtn}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.title)} style={s.redBtn}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── styles ─────────────────────────────── */
const s = {
  wrap: { maxWidth: "1200px" },

  /* header */
  topHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" },
  title:     { fontSize: "28px", fontWeight: "800", margin: "0 0 4px", color: "#111827" },
  sub:       { color: "#6b7280", margin: 0 },
  siteLink:  { textDecoration: "none", color: "#4f46e5", fontWeight: "600", fontSize: "14px", padding: "8px 16px", border: "1px solid #c7d2fe", borderRadius: "10px", background: "#eef2ff" },

  /* ── ADD BOOK BANNER ── */
  addBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    borderRadius: "16px",
    padding: "22px 28px",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  addBannerTitle: { margin: "0 0 4px", fontWeight: "800", fontSize: "18px", color: "white" },
  addBannerSub:   { margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "14px" },
  addBannerBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "13px 28px",
    background: "white",
    color: "#4f46e5",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "800",
    fontSize: "15px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    whiteSpace: "nowrap",
  },

  /* stats */
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "12px", marginBottom: "24px" },
  statCard: { display: "flex", alignItems: "center", gap: "12px", padding: "16px", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.05)" },
  statIcon: { fontSize: "24px" },
  statVal:  { fontSize: "24px", fontWeight: "800", margin: 0 },
  statLbl:  { margin: 0, fontSize: "12px", color: "#6b7280", fontWeight: "600" },

  /* toast */
  toast:    { padding: "13px 18px", borderRadius: "12px", marginBottom: "18px", fontWeight: "600", fontSize: "14px" },
  toastOk:  { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  toastErr: { background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" },

  /* tabs */
  tabRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" },
  tabs:   { display: "flex", gap: "8px" },
  tab: {
    padding: "10px 20px", borderRadius: "12px",
    border: "1px solid #e5e7eb", background: "white",
    cursor: "pointer", fontWeight: "600", fontSize: "14px", color: "#374151",
  },
  tabOn: { background: "#4f46e5", color: "white", border: "1px solid #4f46e5" },

  addTabBtn: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "10px 22px",
    background: "#4f46e5", color: "white",
    borderRadius: "12px", textDecoration: "none",
    fontWeight: "700", fontSize: "14px",
    boxShadow: "0 3px 10px rgba(79,70,229,0.3)",
  },

  /* card */
  card: { background: "white", borderRadius: "16px", padding: "22px", border: "1px solid #e5e7eb" },

  /* filter */
  filterRow:   { display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center" },
  searchBox:   { display: "flex", alignItems: "center", gap: "8px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "9px 12px", flex: 1, minWidth: "200px" },
  searchInput: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#111827" },
  xBtn:        { background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontWeight: "700", padding: 0 },
  select:      { padding: "9px 14px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", background: "#f9fafb", color: "#374151", cursor: "pointer" },
  count:       { fontSize: "13px", color: "#9ca3af", fontWeight: "600" },

  /* table */
  tableWrap: { overflowX: "auto" },
  table:     { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "11px 14px", background: "#f9fafb",
    borderBottom: "2px solid #e5e7eb", textAlign: "left",
    fontWeight: "700", fontSize: "11px", color: "#6b7280",
    textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "13px 14px", verticalAlign: "middle", fontSize: "14px", color: "#374151" },

  thumb:        { width: "40px", height: "54px", objectFit: "cover", borderRadius: "6px", display: "block" },
  thumbFallback:{ width: "40px", height: "54px", background: "#f3f4f6", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" },

  bTitle:  { fontWeight: "700", margin: "0 0 2px", color: "#111827", fontSize: "14px" },
  bAuthor: { margin: 0, fontSize: "12px", color: "#6b7280" },

  chip: (bg, fg) => ({ display: "inline-block", background: bg, color: fg, padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }),

  editBtn: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "7px 13px", background: "#e0e7ff", color: "#4f46e5",
    borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "12px",
  },
  delBtn: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "7px 13px", background: "#fee2e2", color: "#ef4444",
    border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
  },

  /* users */
  avatar: { width: "32px", height: "32px", borderRadius: "50%", background: "#4f46e5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", flexShrink: 0 },

  center: { textAlign: "center", padding: "60px 20px", color: "#6b7280" },

  /* modal */
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  modal:     { background: "white", borderRadius: "20px", padding: "40px", maxWidth: "400px", width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  cancelBtn: { padding: "12px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", color: "#374151" },
  redBtn:    { padding: "12px 24px", background: "#ef4444", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", color: "white" },
};

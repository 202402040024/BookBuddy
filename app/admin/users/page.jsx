"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const emptyForm = { name: "", email: "", password: "", role: "user" };

export default function ManageUsersPage() {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [showForm, setShowForm]         = useState(false);
  const [editUser, setEditUser]         = useState(null);   // user being edited
  const [form, setForm]                 = useState(emptyForm);
  const [formLoading, setFormLoading]   = useState(false);
  const [formError, setFormError]       = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]               = useState({ show: false, msg: "", type: "success" });

  /* ── helpers ── */
  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
  };

  const loadUsers = async () => {
    setLoading(true);
    const res  = await fetch("/api/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  /* ── form handlers ── */
  const openAdd = () => {
    setEditUser(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setFormError("");
    setShowForm(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    if (editUser) {
      /* ── UPDATE ── */
      const body = { name: form.name, role: form.role };
      if (form.password) body.password = form.password;

      const res  = await fetch(`/api/users/${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("User updated successfully!");
        setShowForm(false);
        loadUsers();
      } else {
        setFormError(data.message || "Update failed.");
      }
    } else {
      /* ── ADD NEW USER ── */
      if (!form.password) { setFormError("Password is required."); setFormLoading(false); return; }
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        // if admin role selected, update role after registration
        if (form.role === "admin") {
          const userRes  = await fetch("/api/users");
          const all      = await userRes.json();
          const newUser  = all.find((u) => u.email === form.email);
          if (newUser) {
            await fetch(`/api/users/${newUser._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: "admin" }),
            });
          }
        }
        showToast("User added successfully!");
        setShowForm(false);
        loadUsers();
      } else {
        setFormError(data.message || "Failed to add user.");
      }
    }
    setFormLoading(false);
  };

  const handleDelete = async (id, name) => {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast(`"${name}" removed.`);
    } else {
      showToast("Delete failed.", "error");
    }
    setDeleteConfirm(null);
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── render ── */
  return (
    <div>
      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.breadcrumb}>
            <Link href="/admin" style={s.breadLink}>Admin</Link>
            <span style={s.breadSep}>›</span>
            <span style={s.breadCurrent}>Manage Users</span>
          </div>
          <h1 style={s.title}>👥 Manage Users</h1>
          <p style={s.sub}>Add, update and remove user accounts.</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}>➕ Add New User</button>
      </div>

      {/* Toast */}
      {toast.show && (
        <div style={{ ...s.toast, ...(toast.type === "error" ? s.toastErr : s.toastOk) }}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div style={s.statsRow}>
        {[
          { label: "Total Users", value: users.length,                                   icon: "👥", bg: "#e0e7ff", fg: "#4f46e5" },
          { label: "Admins",      value: users.filter((u) => u.role === "admin").length,  icon: "🛡️", bg: "#fef9c3", fg: "#92400e" },
          { label: "Regular",     value: users.filter((u) => u.role === "user").length,   icon: "👤", bg: "#dcfce7", fg: "#166534" },
        ].map((st) => (
          <div key={st.label} style={{ ...s.statCard, background: st.bg }}>
            <span style={s.statIcon}>{st.icon}</span>
            <div>
              <p style={{ ...s.statVal, color: st.fg }}>{st.value}</p>
              <p style={s.statLbl}>{st.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div style={s.card}>
        <div style={s.filterRow}>
          <div style={s.searchBox}>
            <span>🔍</span>
            <input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}
            />
            {search && <button onClick={() => setSearch("")} style={s.xBtn}>✕</button>}
          </div>
          <span style={s.count}>{filtered.length} of {users.length} users</span>
        </div>

        {loading ? (
          <div style={s.center}>⏳ Loading users…</div>
        ) : filtered.length === 0 ? (
          <div style={s.center}>
            <p style={{ fontSize: "40px", margin: 0 }}>👤</p>
            <p style={{ fontWeight: "700", color: "#111827", margin: "8px 0 4px" }}>No users found</p>
            <p style={{ color: "#6b7280", margin: "0 0 20px" }}>Add your first user below.</p>
            <button onClick={openAdd} style={s.addBtn}>➕ Add New User</button>
          </div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["#", "User", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr key={user._id} style={s.tr}>
                    <td style={{ ...s.td, color: "#9ca3af" }}>{i + 1}</td>
                    <td style={s.td}>
                      <div style={s.userCell}>
                        <div style={s.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, color: "#6b7280" }}>{user.email}</td>
                    <td style={s.td}>
                      <span style={{
                        ...s.pill,
                        background: user.role === "admin" ? "#e0e7ff" : "#f3f4f6",
                        color:      user.role === "admin" ? "#4f46e5" : "#374151",
                      }}>
                        {user.role === "admin" ? "🛡️ Admin" : "👤 User"}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: "#6b7280" }}>
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td style={{ ...s.td, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => openEdit(user)} style={s.editBtn}>✏️ Edit</button>
                        <button
                          onClick={() => setDeleteConfirm({ id: user._id, name: user.name })}
                          style={s.delBtn}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit User Modal ── */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>
                {editUser ? "✏️ Edit User" : "➕ Add New User"}
              </h2>
              <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
            </div>

            {editUser && (
              <div style={s.editingBadge}>
                Editing: <strong>{editUser.name}</strong> ({editUser.email})
              </div>
            )}

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Full Name *</label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. John Doe" required style={s.input}
                />
              </div>

              {!editUser && (
                <div style={s.field}>
                  <label style={s.label}>Email *</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="user@example.com" required style={s.input}
                  />
                </div>
              )}

              <div style={s.field}>
                <label style={s.label}>
                  {editUser ? "New Password (leave blank to keep current)" : "Password *"}
                </label>
                <input
                  name="password" type="password" value={form.password} onChange={handleChange}
                  placeholder={editUser ? "Leave blank to keep current" : "Min 6 characters"}
                  style={s.input}
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>Role</label>
                <select name="role" value={form.role} onChange={handleChange} style={s.input}>
                  <option value="user">👤 User</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>

              {formError && (
                <div style={s.formError}>⚠️ {formError}</div>
              )}

              <div style={s.modalActions}>
                <button type="button" onClick={() => setShowForm(false)} style={s.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} style={s.submitBtn}>
                  {formLoading ? "Saving…" : editUser ? "💾 Update User" : "✅ Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, textAlign: "center" }}>
            <p style={{ fontSize: "48px", margin: "0 0 12px" }}>🗑️</p>
            <h2 style={{ margin: "0 0 10px", color: "#111827" }}>Remove User?</h2>
            <p style={{ color: "#4b5563", margin: "0 0 28px", lineHeight: 1.6 }}>
              Permanently remove <strong>&quot;{deleteConfirm.name}&quot;</strong>?<br />
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={s.cancelBtn}>Cancel</button>
              <button
                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)}
                style={s.redBtn}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── styles ── */
const s = {
  header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  breadcrumb:  { display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" },
  breadLink:   { color: "#4f46e5", textDecoration: "none", fontWeight: "600", fontSize: "14px" },
  breadSep:    { color: "#9ca3af" },
  breadCurrent:{ color: "#6b7280", fontSize: "14px" },
  title:       { fontSize: "28px", fontWeight: "800", margin: "0 0 4px", color: "#111827" },
  sub:         { color: "#6b7280", margin: 0, fontSize: "14px" },
  addBtn: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "11px 22px", background: "#4f46e5", color: "white",
    borderRadius: "12px", border: "none", cursor: "pointer",
    fontWeight: "700", fontSize: "14px", boxShadow: "0 3px 10px rgba(79,70,229,0.3)",
    textDecoration: "none",
  },
  toast:    { padding: "13px 18px", borderRadius: "12px", marginBottom: "20px", fontWeight: "600", fontSize: "14px" },
  toastOk:  { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  toastErr: { background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "14px", marginBottom: "24px" },
  statCard: { display: "flex", alignItems: "center", gap: "12px", padding: "16px 18px", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.05)" },
  statIcon: { fontSize: "26px" },
  statVal:  { fontSize: "26px", fontWeight: "800", margin: 0 },
  statLbl:  { margin: 0, fontSize: "12px", color: "#6b7280", fontWeight: "600" },
  card:     { background: "white", borderRadius: "16px", padding: "22px", border: "1px solid #e5e7eb" },
  filterRow:   { display: "flex", gap: "12px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center" },
  searchBox:   { display: "flex", alignItems: "center", gap: "8px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "9px 12px", flex: 1, minWidth: "220px" },
  searchInput: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#111827" },
  xBtn:        { background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontWeight: "700", padding: 0 },
  count:       { fontSize: "13px", color: "#9ca3af", fontWeight: "600" },
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
  userCell: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "#4f46e5", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "15px", flexShrink: 0,
  },
  pill: { display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" },
  editBtn: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "7px 13px", background: "#e0e7ff", color: "#4f46e5",
    borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "12px",
  },
  delBtn: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "7px 13px", background: "#fee2e2", color: "#ef4444",
    border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
  },
  center: { textAlign: "center", padding: "60px 20px", color: "#6b7280" },

  /* modal */
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(3px)" },
  modal:   { background: "white", borderRadius: "20px", padding: "32px", maxWidth: "460px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle:  { fontSize: "20px", fontWeight: "800", color: "#111827", margin: 0 },
  closeBtn:    { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#9ca3af", padding: "4px 8px" },
  editingBadge:{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", marginBottom: "20px" },
  form:        { display: "flex", flexDirection: "column", gap: "16px" },
  field:       { display: "flex", flexDirection: "column", gap: "6px" },
  label:       { fontWeight: "600", fontSize: "14px", color: "#374151" },
  input: {
    padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: "10px",
    fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box", color: "#111827",
  },
  formError:   { background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", fontWeight: "600" },
  modalActions:{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" },
  cancelBtn:   { padding: "11px 22px", background: "white", border: "1px solid #d1d5db", borderRadius: "12px", fontWeight: "600", fontSize: "14px", cursor: "pointer", color: "#374151" },
  submitBtn:   { padding: "11px 22px", background: "#4f46e5", color: "white", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
  redBtn:      { padding: "12px 24px", background: "#ef4444", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", color: "white" },
};

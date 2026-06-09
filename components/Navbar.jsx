"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";
  const isUser  = status === "authenticated" && !isAdmin;
  const isGuest = status === "unauthenticated";

  return (
    <nav style={s.nav}>
      {/* Brand */}
      <Link href="/" style={s.brand}>
        <span>📚</span>
        <span>BookBuddy</span>
      </Link>

      {/* ── Nav links ── */}
      <div style={s.links}>
        {/* Guest or regular user */}
        {(isGuest || isUser) && (
          <>
            <Link href="/books"   style={s.link}>Books</Link>
            <Link href="/library" style={s.link}>My Library</Link>
            <Link href="/about"   style={s.link}>About Us</Link>
          </>
        )}

        {/* Admin only */}
        {isAdmin && (
          <>
            <Link href="/about"       style={s.link}>About Us</Link>
            <Link href="/admin"       style={s.adminLink}>⚙️ Admin</Link>
            <Link href="/admin/users" style={s.adminLink}>👥 Users</Link>
          </>
        )}
      </div>

      {/* ── Auth area ── */}
      <div style={s.auth}>
        {session ? (
          <div style={s.userWrap}>
            <button onClick={() => setOpen(!open)} style={s.avatarBtn}>
              <div style={s.avatar}>{session.user.name?.charAt(0).toUpperCase()}</div>
              <span style={s.uname}>{session.user.name}</span>
              <span style={{ fontSize: "11px" }}>▾</span>
            </button>

            {open && (
              <div style={s.drop}>
                <div style={s.dropTop}>
                  <p style={s.dropName}>{session.user.name}</p>
                  <p style={s.dropEmail}>{session.user.email}</p>
                  <span style={{ ...s.rolePill, background: isAdmin ? "#4f46e5" : "#6b7280" }}>
                    {isAdmin ? "🛡️ Admin" : "👤 User"}
                  </span>
                </div>

                {isAdmin ? (
                  <>
                    <Link href="/admin"       style={s.dropItem} onClick={() => setOpen(false)}>⚙️ Admin Panel</Link>
                    <Link href="/admin/add"   style={s.dropItem} onClick={() => setOpen(false)}>➕ Add Book</Link>
                    <Link href="/admin/users" style={s.dropItem} onClick={() => setOpen(false)}>👥 Manage Users</Link>
                    <Link href="/about"       style={s.dropItem} onClick={() => setOpen(false)}>ℹ️ About Us</Link>
                  </>
                ) : (
                  <>
                    <Link href="/books"   style={s.dropItem} onClick={() => setOpen(false)}>📖 Books</Link>
                    <Link href="/library" style={s.dropItem} onClick={() => setOpen(false)}>📚 My Library</Link>
                    <Link href="/profile" style={s.dropItem} onClick={() => setOpen(false)}>👤 My Profile</Link>
                    <Link href="/about"   style={s.dropItem} onClick={() => setOpen(false)}>ℹ️ About Us</Link>
                  </>
                )}

                <button
                  onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                  style={s.signOutBtn}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={s.guestBtns}>
            <Link href="/login"    style={s.loginBtn}>Login</Link>
            <Link href="/register" style={s.regBtn}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "13px 28px", background: "white",
    borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)", gap: "16px",
  },
  brand: {
    display: "flex", alignItems: "center", gap: "8px",
    fontWeight: "800", fontSize: "20px", textDecoration: "none", color: "#111827",
  },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link: { textDecoration: "none", color: "#374151", fontWeight: "500", fontSize: "15px" },
  adminLink: {
    textDecoration: "none", color: "#4f46e5", fontWeight: "700", fontSize: "14px",
    padding: "6px 14px", background: "#eef2ff", borderRadius: "8px", border: "1px solid #c7d2fe",
  },
  auth: { display: "flex", alignItems: "center" },
  guestBtns: { display: "flex", gap: "10px" },
  loginBtn: {
    textDecoration: "none", color: "#374151", fontWeight: "600",
    padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px",
  },
  regBtn: {
    textDecoration: "none", color: "white", background: "#4f46e5",
    fontWeight: "600", padding: "8px 16px", borderRadius: "8px", fontSize: "14px",
  },
  userWrap:  { position: "relative" },
  avatarBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "none", border: "1px solid #e5e7eb", borderRadius: "30px",
    padding: "5px 12px 5px 5px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#111827",
  },
  avatar: {
    width: "30px", height: "30px", borderRadius: "50%",
    background: "#4f46e5", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "13px",
  },
  uname: { maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  drop: {
    position: "absolute", top: "calc(100% + 8px)", right: 0,
    background: "white", border: "1px solid #e5e7eb", borderRadius: "14px",
    boxShadow: "0 8px 28px rgba(0,0,0,0.13)", minWidth: "200px",
    overflow: "hidden", zIndex: 999,
  },
  dropTop: {
    padding: "14px 16px 10px", background: "#f9fafb", borderBottom: "1px solid #f0f0f0",
  },
  dropName:   { fontWeight: "700", color: "#111827", margin: "0 0 2px", fontSize: "14px" },
  dropEmail:  { color: "#9ca3af", margin: "0 0 6px", fontSize: "12px" },
  rolePill: {
    display: "inline-block", color: "white",
    padding: "2px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "700",
  },
  dropItem: {
    display: "block", padding: "11px 16px",
    textDecoration: "none", color: "#374151",
    fontWeight: "500", fontSize: "14px", borderBottom: "1px solid #f3f4f6",
  },
  signOutBtn: {
    display: "block", width: "100%", padding: "11px 16px",
    background: "none", border: "none", textAlign: "left",
    color: "#ef4444", fontWeight: "600", fontSize: "14px", cursor: "pointer",
  },
};

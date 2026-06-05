"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.brand}>
        <span style={styles.logo}>📚</span>
        <span>BookBuddy</span>
      </Link>

      {/* Desktop links */}
      <div style={styles.links}>
        <Link href="/books" style={styles.link}>Books</Link>
        <Link href="/library" style={styles.link}>My Library</Link>
        <Link href="/about" style={styles.link}>About Us</Link>
        <Link href="/admin" style={styles.adminLink}>⚙️ Admin</Link>
      </div>

      {/* Auth area */}
      <div style={styles.authArea}>
        {session ? (
          <div style={styles.userMenu}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={styles.avatarBtn}
              aria-label="User menu"
            >
              {session.user.avatar ? (
                <img src={session.user.avatar} alt={session.user.name} style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarFallback}>
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span style={styles.userName}>{session.user.name}</span>
              <span>▾</span>
            </button>

            {menuOpen && (
              <div style={styles.dropdown}>
                <Link href="/profile" style={styles.dropItem} onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  style={styles.dropBtn}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.authLinks}>
            <Link href="/login" style={styles.loginBtn}>Login</Link>
            <Link href="/register" style={styles.registerBtn}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    borderBottom: "1px solid #e5e7eb",
    background: "white",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: "16px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "800",
    fontSize: "22px",
    textDecoration: "none",
    color: "#111827",
  },
  logo: { fontSize: "24px" },
  links: { display: "flex", gap: "24px", alignItems: "center" },
  link: { textDecoration: "none", color: "#374151", fontWeight: "500", fontSize: "15px" },
  adminLink: {
    textDecoration: "none",
    color: "#4f46e5",
    fontWeight: "700",
    fontSize: "15px",
    padding: "6px 14px",
    background: "#eef2ff",
    borderRadius: "8px",
    border: "1px solid #c7d2fe",
  },
  authArea: { display: "flex", alignItems: "center", gap: "12px" },
  authLinks: { display: "flex", gap: "10px", alignItems: "center" },
  loginBtn: {
    textDecoration: "none",
    color: "#374151",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  registerBtn: {
    textDecoration: "none",
    color: "white",
    background: "#4f46e5",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "8px",
  },
  userMenu: { position: "relative" },
  avatarBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "30px",
    padding: "6px 14px 6px 6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
  avatarImg: { width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" },
  avatarFallback: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
  },
  userName: { maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    minWidth: "160px",
    overflow: "hidden",
    zIndex: 200,
  },
  dropItem: {
    display: "block",
    padding: "12px 16px",
    textDecoration: "none",
    color: "#374151",
    fontWeight: "500",
    fontSize: "14px",
    borderBottom: "1px solid #f3f4f6",
  },
  dropBtn: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    background: "none",
    border: "none",
    textAlign: "left",
    color: "#ef4444",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
  },
};

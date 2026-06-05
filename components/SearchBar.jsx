"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/books?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={styles.wrapper}>
      <div style={styles.inner}>
        <span style={styles.icon}>🔍</span>
        <input
          type="text"
          placeholder="Search by title, author, or genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
          aria-label="Search books"
        />
        <button type="submit" style={styles.btn}>Search</button>
      </div>
    </form>
  );
}

const styles = {
  wrapper: { marginBottom: "40px" },
  inner: {
    display: "flex",
    alignItems: "center",
    background: "white",
    border: "2px solid #e5e7eb",
    borderRadius: "16px",
    padding: "6px 8px 6px 16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    gap: "8px",
  },
  icon: { fontSize: "18px" },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    padding: "10px 4px",
    background: "transparent",
    color: "#111827",
  },
  btn: {
    padding: "10px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
  },
};

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { calculateTotal } from "@/lib/calculateTotal";

export default function LibraryPage() {
  const [savedBooks, setSavedBooks] = useState([]);

  useEffect(() => {
    setSavedBooks(JSON.parse(localStorage.getItem("savedBooks") || "[]"));
  }, []);

  const removeBook = (id) => {
    const updated = savedBooks.filter((book) => book._id !== id);
    setSavedBooks(updated);
    localStorage.setItem("savedBooks", JSON.stringify(updated));
  };

  const totalPrice = calculateTotal(savedBooks);

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Library</h1>
          <p style={styles.subtitle}>{savedBooks.length} book{savedBooks.length !== 1 ? "s" : ""} saved</p>
        </div>
        {savedBooks.length > 0 && (
          <div style={styles.totalBadge}>
            <span style={styles.totalLabel}>Total Value</span>
            <span style={styles.totalValue}>₹{totalPrice}</span>
          </div>
        )}
      </div>

      {savedBooks.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: "64px", margin: "0 0 16px" }}>📭</p>
          <h2 style={{ margin: "0 0 8px", color: "#111827" }}>Your library is empty</h2>
          <p style={{ color: "#6b7280", margin: "0 0 24px" }}>
            Browse our collection and save books you love.
          </p>
          <Link href="/books" style={styles.browseBtn}>Browse Books</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {savedBooks.map((book) => (
            <div key={book._id} style={styles.card}>
              <div style={styles.coverWrap}>
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} style={styles.coverImg} />
                ) : (
                  <div style={styles.coverPlaceholder}>📚</div>
                )}
              </div>
              <div style={styles.cardInfo}>
                <span style={styles.genre}>{book.genre}</span>
                <h3 style={styles.bookTitle}>{book.title}</h3>
                <p style={styles.bookAuthor}>{book.author}</p>
                <div style={styles.cardBottom}>
                  <span style={styles.price}>₹{book.price}</span>
                  <span style={styles.rating}>★ {book.rating}</span>
                </div>
                <div style={styles.cardActions}>
                  <Link href={`/books/${book._id}`} style={styles.viewBtn}>View</Link>
                  <button onClick={() => removeBook(book._id)} style={styles.removeBtn}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: { fontSize: "32px", fontWeight: "800", margin: "0 0 4px", color: "#111827" },
  subtitle: { color: "#6b7280", margin: 0 },
  totalBadge: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "16px 24px",
    textAlign: "center",
  },
  totalLabel: { display: "block", fontSize: "12px", color: "#6b7280", fontWeight: "600", marginBottom: "4px" },
  totalValue: { fontSize: "24px", fontWeight: "800", color: "#4f46e5" },
  empty: { textAlign: "center", padding: "80px 20px" },
  browseBtn: {
    display: "inline-block",
    padding: "14px 24px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  coverWrap: { height: "180px", background: "#f3f4f6", overflow: "hidden" },
  coverImg: { width: "100%", height: "100%", objectFit: "cover" },
  coverPlaceholder: { height: "100%", display: "grid", placeItems: "center", fontSize: "40px" },
  cardInfo: { padding: "16px" },
  genre: {
    display: "inline-block",
    background: "#e0e7ff",
    color: "#4f46e5",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  bookTitle: { fontSize: "16px", fontWeight: "700", margin: "0 0 4px", color: "#111827" },
  bookAuthor: { fontSize: "13px", color: "#6b7280", margin: "0 0 10px" },
  cardBottom: { display: "flex", justifyContent: "space-between", marginBottom: "12px" },
  price: { fontWeight: "800", color: "#4f46e5", fontSize: "16px" },
  rating: { fontSize: "13px", color: "#f59e0b", fontWeight: "700" },
  cardActions: { display: "flex", gap: "8px" },
  viewBtn: {
    flex: 1,
    display: "block",
    textAlign: "center",
    padding: "9px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  removeBtn: {
    flex: 1,
    padding: "9px",
    background: "#fee2e2",
    color: "#ef4444",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },
};

"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BookCard from "@/components/BookCard";

const GENRES = ["All", "Fiction", "Self-Help", "Tech", "Business", "Science", "History", "Romance", "Mystery", "Biography"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "title", label: "Title A–Z" },
];

export default function BooksPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading books...</div>}>
      <BooksContent />
    </Suspense>
  );
}

function BooksContent() {
  const searchParams = useSearchParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [filter, setFilter] = useState(searchParams.get("filter") || "");
  const [sort, setSort] = useState("newest");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const loadBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre && genre !== "All") params.set("genre", genre);
    if (filter) params.set("filter", filter);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/books?${params.toString()}`);
    const data = await res.json();
    setBooks(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, genre, filter, sort]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>All Books</h1>
        <p style={styles.subtitle}>
          {loading ? "Loading..." : `${books.length} book${books.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Search + Sort bar */}
      <form onSubmit={handleSearchSubmit} style={styles.searchRow}>
        <div style={styles.searchWrap}>
          <span>🔍</span>
          <input
            placeholder="Search by title or author..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.select}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </form>

      {/* Genre tabs */}
      <div style={styles.genreTabs}>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g === "All" ? "" : g)}
            style={{
              ...styles.genreTab,
              ...(genre === (g === "All" ? "" : g) ? styles.genreTabActive : {}),
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Filter badges */}
      <div style={styles.filterRow}>
        {["featured", "bestseller", "newArrival"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(filter === f ? "" : f)}
            style={{
              ...styles.filterBadge,
              ...(filter === f ? styles.filterBadgeActive : {}),
            }}
          >
            {f === "featured" ? "⭐ Featured" : f === "bestseller" ? "🔥 Best Sellers" : "🆕 New Arrivals"}
          </button>
        ))}
        {(search || genre || filter) && (
          <button
            onClick={() => { setSearch(""); setSearchInput(""); setGenre(""); setFilter(""); }}
            style={styles.clearBtn}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div style={styles.loadingGrid}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={styles.skeleton} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: "48px" }}>📭</p>
          <h3>No books found</h3>
          <p style={{ color: "#6b7280" }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { marginBottom: "24px" },
  title: { fontSize: "32px", fontWeight: "800", margin: "0 0 4px", color: "#111827" },
  subtitle: { color: "#6b7280", margin: 0 },
  searchRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
    background: "white",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "6px 8px 6px 14px",
    minWidth: "260px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "15px",
    padding: "8px 4px",
    background: "transparent",
  },
  searchBtn: {
    padding: "8px 16px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  select: {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    background: "white",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  genreTabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  genreTab: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    background: "white",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    color: "#374151",
  },
  genreTabActive: {
    background: "#4f46e5",
    color: "white",
    border: "1px solid #4f46e5",
  },
  filterRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px", alignItems: "center" },
  filterBadge: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    color: "#374151",
  },
  filterBadgeActive: { background: "#fef9c3", border: "1px solid #fbbf24", color: "#92400e" },
  clearBtn: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #fca5a5",
    background: "#fff1f2",
    cursor: "pointer",
    fontSize: "13px",
    color: "#ef4444",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  skeleton: {
    height: "340px",
    borderRadius: "16px",
    background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
  },
  empty: { textAlign: "center", padding: "60px 20px" },
};

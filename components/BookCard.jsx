import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <div style={styles.card}>
      {/* Cover */}
      <div style={styles.cover}>
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} style={styles.img} />
        ) : (
          <div style={styles.placeholder}>📚</div>
        )}
        {/* Badges */}
        <div style={styles.badges}>
          {book.newArrival && <span style={styles.badge("#10b981")}>🆕 New</span>}
          {book.bestseller && <span style={styles.badge("#f59e0b")}>🔥 Hot</span>}
          {book.featured && <span style={styles.badge("#4f46e5")}>⭐</span>}
        </div>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <span style={styles.genre}>{book.genre}</span>
        <h3 style={styles.title}>{book.title}</h3>
        <p style={styles.author}>{book.author}</p>

        <div style={styles.bottom}>
          <div style={styles.ratingRow}>
            <span style={styles.star}>★</span>
            <span style={styles.rating}>{book.rating}</span>
            {book.reviewCount > 0 && (
              <span style={styles.reviewCount}>({book.reviewCount})</span>
            )}
          </div>
          <span style={styles.price}>₹{book.price}</span>
        </div>
      </div>

      <Link href={`/books/${book._id}`} style={styles.btn} aria-label={`View details for ${book.title}`}>
        View Details
      </Link>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    background: "white",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 0.2s",
  },
  cover: {
    position: "relative",
    width: "100%",
    height: "220px",
    background: "#f3f4f6",
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  placeholder: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    fontSize: "48px",
    color: "#d1d5db",
  },
  badges: {
    position: "absolute",
    top: "8px",
    left: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  badge: (color) => ({
    display: "inline-block",
    background: color,
    color: "white",
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  }),
  info: { padding: "14px 16px", flex: 1 },
  genre: {
    display: "inline-block",
    background: "#e0e7ff",
    color: "#4f46e5",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  title: { margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#111827", lineHeight: "1.3" },
  author: { margin: "0 0 10px", fontSize: "13px", color: "#6b7280" },
  bottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  ratingRow: { display: "flex", alignItems: "center", gap: "3px" },
  star: { color: "#f59e0b", fontSize: "14px" },
  rating: { fontSize: "13px", fontWeight: "700", color: "#374151" },
  reviewCount: { fontSize: "12px", color: "#9ca3af" },
  price: { fontSize: "16px", fontWeight: "800", color: "#4f46e5" },
  btn: {
    display: "block",
    textAlign: "center",
    margin: "0 16px 16px",
    padding: "10px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },
};

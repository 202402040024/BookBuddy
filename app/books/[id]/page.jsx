"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

function StarRating({ value, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          style={{
            background: "none",
            border: "none",
            cursor: readOnly ? "default" : "pointer",
            fontSize: readOnly ? "18px" : "26px",
            color: star <= (hover || value) ? "#f59e0b" : "#d1d5db",
            padding: "2px",
            lineHeight: 1,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, review: "" });
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/books/${id}`).then((r) => r.json()).then(setBook);
    fetch(`/api/reviews?bookId=${id}`).then((r) => r.json()).then(setReviews);
  }, [id]);

  const saveToLibrary = () => {
    const saved = JSON.parse(localStorage.getItem("savedBooks") || "[]");
    if (!saved.find((b) => b._id === book._id)) {
      saved.push(book);
      localStorage.setItem("savedBooks", JSON.stringify(saved));
      alert("Saved to library!");
    } else {
      alert("Already in your library.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) { setSubmitError("Please select a rating."); return; }
    if (!reviewForm.review.trim()) { setSubmitError("Please write a review."); return; }

    setSubmitting(true);
    setSubmitError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: id, ...reviewForm }),
    });
    const data = await res.json();

    if (res.ok) {
      setReviews((prev) => [data, ...prev]);
      setReviewForm({ rating: 0, review: "" });
      setSubmitSuccess(true);
      // Refresh book to get updated rating
      fetch(`/api/books/${id}`).then((r) => r.json()).then(setBook);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } else {
      setSubmitError(data.message || "Failed to submit review.");
    }
    setSubmitting(false);
  };

  if (!book) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <p style={{ fontSize: "48px" }}>⏳</p>
      <p>Loading book details...</p>
    </div>
  );
  if (book.message) return <p style={{ padding: "40px", color: "#ef4444" }}>{book.message}</p>;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : book.rating;

  return (
    <div>
      {/* Book Detail Card */}
      <div style={styles.wrap}>
        <div style={styles.coverWrap}>
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} style={styles.img} />
          ) : (
            <div style={styles.placeholder}>📚</div>
          )}
          {book.featured && <span style={styles.badge("⭐ Featured", "#4f46e5")} />}
          {book.bestseller && <span style={styles.badge("🔥 Bestseller", "#f59e0b")} />}
          {book.newArrival && <span style={styles.badge("🆕 New", "#10b981")} />}
        </div>

        <div style={styles.info}>
          <p style={styles.genre}>{book.genre}</p>
          <h1 style={styles.title}>{book.title}</h1>
          <p style={styles.author}>by <strong>{book.author}</strong></p>

          <div style={styles.ratingRow}>
            <StarRating value={Math.round(avgRating)} readOnly />
            <span style={styles.ratingText}>{avgRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>

          <p style={styles.price}>₹{book.price}</p>

          <span style={{
            ...styles.statusBadge,
            background: book.status === "Available" ? "#dcfce7" : "#fee2e2",
            color: book.status === "Available" ? "#166534" : "#991b1b",
          }}>
            {book.status}
          </span>

          <p style={styles.description}>{book.description}</p>

          <div style={styles.actions}>
            <button onClick={saveToLibrary} style={styles.saveBtn}>
              📚 Save to Library
            </button>
            <Link href="/books" style={styles.backLink}>← Back to Books</Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewsTitle}>Customer Reviews</h2>

        {/* Submit Review Form */}
        {session ? (
          <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px" }}>Write a Review</h3>
            <div style={{ marginBottom: "12px" }}>
              <p style={{ margin: "0 0 8px", fontWeight: "600" }}>Your Rating</p>
              <StarRating
                value={reviewForm.rating}
                onChange={(val) => setReviewForm((p) => ({ ...p, rating: val }))}
              />
            </div>
            <textarea
              placeholder="Share your thoughts about this book..."
              value={reviewForm.review}
              onChange={(e) => setReviewForm((p) => ({ ...p, review: e.target.value }))}
              style={styles.textarea}
              rows={4}
            />
            {submitError && <p style={styles.error}>{submitError}</p>}
            {submitSuccess && <p style={styles.success}>✓ Review submitted successfully!</p>}
            <button type="submit" disabled={submitting} style={styles.submitBtn}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div style={styles.loginPrompt}>
            <p>
              <Link href="/login" style={{ color: "#4f46e5", fontWeight: "600" }}>Login</Link>{" "}
              to write a review.
            </p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "32px 0" }}>
            No reviews yet. Be the first to review this book!
          </p>
        ) : (
          <div style={styles.reviewsList}>
            {reviews.map((r) => (
              <div key={r._id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewAvatar}>{r.userName?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={styles.reviewName}>{r.userName}</p>
                    <p style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <StarRating value={r.rating} readOnly />
                  </div>
                </div>
                <p style={styles.reviewText}>{r.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "40px",
    alignItems: "start",
    background: "white",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid #e5e7eb",
    marginBottom: "40px",
  },
  coverWrap: { position: "relative" },
  img: { width: "100%", borderRadius: "16px", objectFit: "cover", maxHeight: "400px" },
  placeholder: {
    width: "100%",
    height: "360px",
    borderRadius: "16px",
    background: "#f3f4f6",
    display: "grid",
    placeItems: "center",
    fontSize: "60px",
  },
  badge: (label, color) => ({
    position: "absolute",
    top: "12px",
    left: "12px",
    content: label,
    padding: "4px 10px",
    background: color,
    color: "white",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  }),
  info: { paddingTop: "8px" },
  genre: {
    display: "inline-block",
    background: "#e0e7ff",
    color: "#4f46e5",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    margin: "0 0 12px",
  },
  title: { fontSize: "34px", fontWeight: "800", margin: "0 0 8px", color: "#111827" },
  author: { fontSize: "16px", color: "#6b7280", margin: "0 0 16px" },
  ratingRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" },
  ratingText: { color: "#6b7280", fontSize: "14px" },
  price: { fontSize: "28px", fontWeight: "800", color: "#4f46e5", margin: "0 0 12px" },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  description: { fontSize: "16px", color: "#374151", lineHeight: "1.7", margin: "0 0 24px" },
  actions: { display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" },
  saveBtn: {
    padding: "12px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },
  backLink: {
    color: "#6b7280",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
  },
  reviewsSection: {
    background: "white",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid #e5e7eb",
  },
  reviewsTitle: { fontSize: "24px", fontWeight: "700", margin: "0 0 24px", color: "#111827" },
  reviewForm: {
    background: "#f9fafb",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px",
    border: "1px solid #e5e7eb",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    resize: "vertical",
    fontSize: "15px",
    marginBottom: "12px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  error: { color: "#ef4444", margin: "0 0 8px", fontSize: "14px" },
  success: { color: "#16a34a", margin: "0 0 8px", fontSize: "14px", fontWeight: "600" },
  submitBtn: {
    padding: "12px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },
  loginPrompt: {
    background: "#f0fdf4",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    textAlign: "center",
    color: "#374151",
    border: "1px solid #bbf7d0",
  },
  reviewsList: { display: "flex", flexDirection: "column", gap: "16px" },
  reviewCard: {
    background: "#f9fafb",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid #e5e7eb",
  },
  reviewHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  reviewAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    flexShrink: 0,
  },
  reviewName: { fontWeight: "700", margin: 0, color: "#111827", fontSize: "15px" },
  reviewDate: { margin: 0, color: "#9ca3af", fontSize: "13px" },
  reviewText: { margin: 0, color: "#374151", lineHeight: "1.6", fontSize: "15px" },
};

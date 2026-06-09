import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import AccessDeniedBanner from "@/components/AccessDeniedBanner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectDB();

  const [featuredBooks, bestsellerBooks, newArrivals] = await Promise.all([
    Book.find({ featured: true }).limit(4).sort({ createdAt: -1 }).lean(),
    Book.find({ bestseller: true }).limit(4).sort({ rating: -1 }).lean(),
    Book.find({ newArrival: true }).limit(4).sort({ createdAt: -1 }).lean(),
  ]);

  const serialize = (books) =>
    books.map((b) => ({ ...b, _id: b._id.toString() }));

  return (
    <div>
      <AccessDeniedBanner />
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>🌟 Welcome to BookBuddy</p>
          <h1 style={styles.heroTitle}>
            Discover Your Next<br />
            <span style={styles.heroAccent}>Favorite Book</span>
          </h1>
          <p style={styles.heroSub}>
            Explore thousands of books across every genre. Find your perfect read, save your favorites, and share your reviews.
          </p>
          <div style={styles.heroBtns}>
            <Link href="/books" style={styles.primaryBtn}>Browse All Books</Link>
            <Link href="/about" style={styles.secondaryBtn}>Learn More</Link>
          </div>
        </div>
        <div style={styles.heroIllustration}>📚</div>
      </section>

      {/* Search Bar */}
      <SearchBar />

      {/* Categories */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Browse by Category</h2>
        <div style={styles.categories}>
          {[
            { name: "Fiction", icon: "📖", color: "#ede9fe" },
            { name: "Self-Help", icon: "🌱", color: "#dcfce7" },
            { name: "Tech", icon: "💻", color: "#dbeafe" },
            { name: "Business", icon: "💼", color: "#fef9c3" },
            { name: "Science", icon: "🔬", color: "#fee2e2" },
            { name: "History", icon: "🏛️", color: "#e0f2fe" },
          ].map((cat) => (
            <Link key={cat.name} href={`/books?genre=${cat.name}`} style={{ ...styles.catCard, background: cat.color }}>
              <span style={styles.catIcon}>{cat.icon}</span>
              <span style={styles.catName}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>⭐ Featured Books</h2>
            <Link href="/books?filter=featured" style={styles.viewAll}>View All →</Link>
          </div>
          <div style={styles.grid}>
            {serialize(featuredBooks).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestsellerBooks.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🔥 Best Sellers</h2>
            <Link href="/books?filter=bestseller" style={styles.viewAll}>View All →</Link>
          </div>
          <div style={styles.grid}>
            {serialize(bestsellerBooks).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🆕 New Arrivals</h2>
            <Link href="/books?filter=newArrival" style={styles.viewAll}>View All →</Link>
          </div>
          <div style={styles.grid}>
            {serialize(newArrivals).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* No books fallback */}
      {featuredBooks.length === 0 && bestsellerBooks.length === 0 && newArrivals.length === 0 && (
        <section style={{ ...styles.section, textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: "60px" }}>📚</p>
          <h2>No books yet</h2>
          <p style={{ color: "#6b7280" }}>Head to the Admin panel to add your first books.</p>
          <Link href="/admin" style={styles.primaryBtn}>Go to Admin</Link>
        </section>
      )}

      {/* CTA Banner */}
      <section style={styles.ctaBanner}>
        <h2 style={{ margin: "0 0 12px", fontSize: "28px" }}>Ready to start reading?</h2>
        <p style={{ margin: "0 0 20px", color: "#6b7280" }}>
          Create a free account to save books, write reviews, and track your reading list.
        </p>
        <Link href="/register" style={styles.ctaBtn}>Create Free Account</Link>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "60px 48px",
    background: "linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)",
    borderRadius: "24px",
    marginBottom: "40px",
    gap: "24px",
  },
  heroContent: { flex: 1, maxWidth: "560px" },
  heroTag: {
    display: "inline-block",
    background: "#e0e7ff",
    color: "#4f46e5",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  heroTitle: { fontSize: "48px", fontWeight: "800", margin: "0 0 16px", lineHeight: "1.15", color: "#111827" },
  heroAccent: { color: "#4f46e5" },
  heroSub: { fontSize: "18px", color: "#4b5563", margin: "0 0 28px", lineHeight: "1.6" },
  heroBtns: { display: "flex", gap: "12px", flexWrap: "wrap" },
  primaryBtn: {
    display: "inline-block",
    padding: "14px 24px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
  },
  secondaryBtn: {
    display: "inline-block",
    padding: "14px 24px",
    background: "white",
    color: "#374151",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    border: "1px solid #d1d5db",
    fontSize: "16px",
  },
  heroIllustration: { fontSize: "120px", lineHeight: 1 },
  section: { marginBottom: "48px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  sectionTitle: { fontSize: "24px", fontWeight: "700", margin: 0, color: "#111827" },
  viewAll: { color: "#4f46e5", textDecoration: "none", fontWeight: "600", fontSize: "15px" },
  categories: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px",
  },
  catCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "20px 12px",
    borderRadius: "16px",
    textDecoration: "none",
    transition: "transform 0.2s",
  },
  catIcon: { fontSize: "32px" },
  catName: { fontWeight: "700", color: "#111827", fontSize: "14px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  ctaBanner: {
    textAlign: "center",
    background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
    padding: "60px 40px",
    borderRadius: "24px",
    marginTop: "32px",
  },
  ctaBtn: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
  },
};

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const GENRES = [
  "Fiction", "Self-Help", "Tech", "Business",
  "Science", "History", "Romance", "Mystery", "Biography", "Children",
];

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [previewError, setPreviewError] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/books/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.message) {
          router.push("/admin");
          return;
        }
        const fields = {
          title: data.title || "",
          author: data.author || "",
          genre: data.genre || "Fiction",
          description: data.description || "",
          coverImage: data.coverImage || "",
          rating: data.rating?.toString() || "",
          price: data.price?.toString() || "",
          status: data.status || "Available",
          featured: Boolean(data.featured),
          bestseller: Boolean(data.bestseller),
          newArrival: Boolean(data.newArrival),
        };
        setForm(fields);
        setOriginal(fields);
        setFetching(false);
      })
      .catch(() => router.push("/admin"));
  }, [id, router]);

  useEffect(() => {
    if (!form || !original) return;
    setHasChanges(JSON.stringify(form) !== JSON.stringify(original));
  }, [form, original]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.price !== "" && isNaN(Number(form.price))) e.price = "Price must be a number";
    if (form.rating !== "" && (isNaN(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5))
      e.rating = "Rating must be 0–5";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (name === "coverImage") setPreviewError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const res = await fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        rating: Number(form.rating) || 0,
        price: Number(form.price) || 0,
      }),
    });

    if (res.ok) {
      router.push("/admin?updated=1");
    } else {
      const data = await res.json();
      setErrors({ general: data.message || "Failed to update book." });
    }
    setLoading(false);
  };

  const handleReset = () => {
    setForm(original);
    setErrors({});
    setPreviewError(false);
  };

  if (fetching) return (
    <div style={styles.loadingPage}>
      <div style={styles.loadingSpinner} />
      <p style={{ color: "#6b7280" }}>Loading book details...</p>
    </div>
  );

  if (!form) return null;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <Link href="/admin" style={styles.breadLink}>Admin</Link>
          <span style={styles.breadSep}>›</span>
          <span style={styles.breadCurrent}>Edit Book</span>
        </div>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>✏️ Edit Book</h1>
            <p style={styles.subtitle}>
              Editing: <strong>{original.title}</strong>
            </p>
          </div>
          {hasChanges && (
            <div style={styles.changesBadge}>
              ● Unsaved changes
            </div>
          )}
        </div>
      </div>

      <div style={styles.layout}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.formCard}>
          {errors.general && (
            <div style={styles.errorBanner}>⚠️ {errors.general}</div>
          )}

          {/* Basic Info */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📝 Basic Information</h2>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <label style={styles.label}>Book Title <span style={styles.required}>*</span></label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
                />
                {errors.title && <span style={styles.fieldError}>{errors.title}</span>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Author <span style={styles.required}>*</span></label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.author ? styles.inputError : {}) }}
                />
                {errors.author && <span style={styles.fieldError}>{errors.author}</span>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Genre</label>
                <select name="genre" value={form.genre} onChange={handleChange} style={styles.input}>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                  <option value="Available">✅ Available</option>
                  <option value="Out of Stock">❌ Out of Stock</option>
                  <option value="Coming Soon">⏳ Coming Soon</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Price (₹)</label>
                <div style={styles.inputWithPrefix}>
                  <span style={styles.inputPrefix}>₹</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    style={{ ...styles.input, ...styles.inputPrefixed, ...(errors.price ? styles.inputError : {}) }}
                  />
                </div>
                {errors.price && <span style={styles.fieldError}>{errors.price}</span>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Rating (0–5)</label>
                <div style={styles.inputWithPrefix}>
                  <span style={styles.inputPrefix}>⭐</span>
                  <input
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={handleChange}
                    style={{ ...styles.input, ...styles.inputPrefixed, ...(errors.rating ? styles.inputError : {}) }}
                  />
                </div>
                {errors.rating && <span style={styles.fieldError}>{errors.rating}</span>}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description <span style={styles.required}>*</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                style={{ ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
              />
              <span style={styles.charCount}>{form.description.length} characters</span>
              {errors.description && <span style={styles.fieldError}>{errors.description}</span>}
            </div>
          </div>

          {/* Cover Image */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🖼️ Cover Image</h2>
            <div style={styles.field}>
              <label style={styles.label}>Cover Image URL</label>
              <input
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
                style={styles.input}
              />
              <p style={styles.hint}>Update the URL to change the cover image.</p>
            </div>
          </div>

          {/* Tags */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🏷️ Tags & Visibility</h2>
            <p style={styles.hint}>These tags control how the book appears on the homepage sections.</p>
            <div style={styles.checkGrid}>
              {[
                { name: "featured", label: "⭐ Featured", desc: "Show in Featured section" },
                { name: "bestseller", label: "🔥 Bestseller", desc: "Show in Best Sellers section" },
                { name: "newArrival", label: "🆕 New Arrival", desc: "Show in New Arrivals section" },
              ].map((c) => (
                <label key={c.name} style={{ ...styles.checkCard, ...(form[c.name] ? styles.checkCardActive : {}) }}>
                  <input
                    type="checkbox"
                    name={c.name}
                    checked={form[c.name]}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  <div style={styles.checkTop}>
                    <span style={styles.checkEmoji}>{c.label.split(" ")[0]}</span>
                    <div style={{ ...styles.checkToggle, background: form[c.name] ? "#4f46e5" : "#e5e7eb" }}>
                      <div style={{ ...styles.checkDot, transform: form[c.name] ? "translateX(16px)" : "translateX(2px)" }} />
                    </div>
                  </div>
                  <p style={styles.checkLabel}>{c.label.split(" ").slice(1).join(" ")}</p>
                  <p style={styles.checkDesc}>{c.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Change Summary */}
          {hasChanges && (
            <div style={styles.changeSummary}>
              <p style={styles.changeSummaryTitle}>📋 Changed Fields:</p>
              <div style={styles.changeList}>
                {Object.keys(form).filter((k) => form[k] !== original[k]).map((k) => (
                  <span key={k} style={styles.changeTag}>{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={styles.formActions}>
            <button type="button" onClick={handleReset} disabled={!hasChanges} style={{
              ...styles.resetBtn,
              opacity: hasChanges ? 1 : 0.4,
              cursor: hasChanges ? "pointer" : "not-allowed",
            }}>
              ↩️ Revert Changes
            </button>
            <div style={styles.rightActions}>
              <Link href="/admin" style={styles.cancelBtn}>Cancel</Link>
              <button type="submit" disabled={loading || !hasChanges} style={{
                ...styles.submitBtn,
                opacity: hasChanges ? 1 : 0.5,
                cursor: hasChanges ? "pointer" : "not-allowed",
              }}>
                {loading ? (
                  <span style={styles.loadingInner}>
                    <span style={styles.btnSpinner} /> Saving...
                  </span>
                ) : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </form>

        {/* Preview */}
        <div style={styles.previewPanel}>
          <h3 style={styles.previewTitle}>👁️ Live Preview</h3>
          <div style={styles.previewCard}>
            <div style={styles.previewCover}>
              {form.coverImage && !previewError ? (
                <img
                  src={form.coverImage}
                  alt="cover"
                  style={styles.previewImg}
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div style={styles.previewPlaceholder}>📚</div>
              )}
              <div style={styles.previewBadges}>
                {form.newArrival && <span style={styles.badge("#10b981")}>🆕 New</span>}
                {form.bestseller && <span style={styles.badge("#f59e0b")}>🔥 Hot</span>}
                {form.featured && <span style={styles.badge("#4f46e5")}>⭐</span>}
              </div>
            </div>
            <div style={styles.previewInfo}>
              <span style={styles.previewGenre}>{form.genre}</span>
              <h4 style={styles.previewBookTitle}>{form.title || "Book Title"}</h4>
              <p style={styles.previewAuthor}>{form.author || "Author"}</p>
              <div style={styles.previewMeta}>
                <span style={styles.previewRating}>⭐ {form.rating || "0"}</span>
                <span style={styles.previewPrice}>₹{form.price || "0"}</span>
              </div>
              <span style={{
                ...styles.previewStatus,
                background: form.status === "Available" ? "#dcfce7" : form.status === "Out of Stock" ? "#fee2e2" : "#fef9c3",
                color: form.status === "Available" ? "#166534" : form.status === "Out of Stock" ? "#991b1b" : "#92400e",
              }}>
                {form.status}
              </span>
              {form.description && (
                <p style={styles.previewDesc}>
                  {form.description.length > 120 ? form.description.slice(0, 120) + "..." : form.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick compare */}
          {hasChanges && (
            <div style={styles.compareBox}>
              <p style={styles.compareTitle}>🔄 Changes from original</p>
              {Object.keys(form)
                .filter((k) => form[k] !== original[k])
                .slice(0, 4)
                .map((k) => (
                  <div key={k} style={styles.compareRow}>
                    <span style={styles.compareField}>{k}</span>
                    <div>
                      <p style={styles.compareOld}>
                        {String(original[k]).length > 20 ? String(original[k]).slice(0, 20) + "…" : String(original[k])}
                      </p>
                      <p style={styles.compareNew}>
                        {String(form[k]).length > 20 ? String(form[k]).slice(0, 20) + "…" : String(form[k])}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto" },
  loadingPage: { textAlign: "center", padding: "100px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" },
  loadingSpinner: {
    width: "40px", height: "40px",
    border: "3px solid #e5e7eb", borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
  },

  header: { marginBottom: "32px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" },
  breadLink: { color: "#4f46e5", textDecoration: "none", fontWeight: "600", fontSize: "14px" },
  breadSep: { color: "#9ca3af" },
  breadCurrent: { color: "#6b7280", fontSize: "14px" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" },
  title: { fontSize: "32px", fontWeight: "800", margin: "0 0 6px", color: "#111827" },
  subtitle: { color: "#6b7280", margin: 0 },
  changesBadge: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    border: "1px solid #fde68a",
    whiteSpace: "nowrap",
  },

  layout: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "28px", alignItems: "start" },

  formCard: {
    background: "white", borderRadius: "20px", padding: "32px",
    border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  errorBanner: {
    background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca",
    borderRadius: "12px", padding: "14px 16px", marginBottom: "24px", fontWeight: "600",
  },

  section: { marginBottom: "32px", paddingBottom: "28px", borderBottom: "1px solid #f3f4f6" },
  sectionTitle: { fontSize: "17px", fontWeight: "700", margin: "0 0 20px", color: "#111827" },

  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontWeight: "600", fontSize: "14px", color: "#374151" },
  required: { color: "#ef4444" },
  input: {
    padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: "10px",
    fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box",
    color: "#111827", background: "white", transition: "border-color 0.2s",
  },
  inputError: { borderColor: "#fca5a5", background: "#fff5f5" },
  inputWithPrefix: { position: "relative", display: "flex", alignItems: "center" },
  inputPrefix: { position: "absolute", left: "12px", fontSize: "15px", color: "#6b7280", pointerEvents: "none" },
  inputPrefixed: { paddingLeft: "32px" },
  textarea: {
    padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: "10px",
    fontSize: "15px", outline: "none", resize: "vertical", fontFamily: "inherit",
    width: "100%", boxSizing: "border-box", color: "#111827", lineHeight: "1.6",
  },
  charCount: { fontSize: "12px", color: "#9ca3af", textAlign: "right" },
  fieldError: { fontSize: "12px", color: "#ef4444", fontWeight: "600" },
  hint: { fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" },

  checkGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" },
  checkCard: { padding: "16px", borderRadius: "12px", border: "2px solid #e5e7eb", cursor: "pointer", background: "white" },
  checkCardActive: { borderColor: "#4f46e5", background: "#f5f3ff" },
  checkTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  checkEmoji: { fontSize: "22px" },
  checkToggle: { width: "36px", height: "20px", borderRadius: "10px", position: "relative", transition: "background 0.2s", flexShrink: 0 },
  checkDot: { width: "16px", height: "16px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", transition: "transform 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" },
  checkLabel: { fontWeight: "700", fontSize: "14px", color: "#111827", margin: "0 0 2px" },
  checkDesc: { fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: "1.4" },

  changeSummary: {
    background: "#fefce8", border: "1px solid #fde68a", borderRadius: "12px",
    padding: "14px 16px", marginBottom: "4px",
  },
  changeSummaryTitle: { fontWeight: "700", color: "#92400e", margin: "0 0 8px", fontSize: "14px" },
  changeList: { display: "flex", flexWrap: "wrap", gap: "6px" },
  changeTag: {
    background: "#fef3c7", color: "#92400e", padding: "3px 10px",
    borderRadius: "10px", fontSize: "12px", fontWeight: "700",
  },

  formActions: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", flexWrap: "wrap", gap: "12px" },
  rightActions: { display: "flex", gap: "10px", alignItems: "center" },
  resetBtn: { padding: "11px 18px", background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", fontWeight: "600", fontSize: "14px", color: "#6b7280" },
  cancelBtn: { display: "inline-block", padding: "11px 18px", background: "white", border: "1px solid #d1d5db", borderRadius: "10px", textDecoration: "none", fontWeight: "600", fontSize: "14px", color: "#374151" },
  submitBtn: { padding: "12px 28px", background: "#4f46e5", color: "white", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "15px" },
  loadingInner: { display: "flex", alignItems: "center", gap: "8px" },
  btnSpinner: { display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%" },

  previewPanel: { position: "sticky", top: "24px" },
  previewTitle: { fontSize: "16px", fontWeight: "700", color: "#374151", margin: "0 0 14px" },
  previewCard: { background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  previewCover: { position: "relative", height: "200px", background: "#f3f4f6", overflow: "hidden" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  previewPlaceholder: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px", color: "#d1d5db" },
  previewBadges: { position: "absolute", top: "8px", left: "8px", display: "flex", flexDirection: "column", gap: "4px" },
  badge: (color) => ({ display: "inline-block", background: color, color: "white", padding: "3px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "700" }),
  previewInfo: { padding: "16px" },
  previewGenre: { display: "inline-block", background: "#e0e7ff", color: "#4f46e5", padding: "2px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", marginBottom: "8px" },
  previewBookTitle: { fontSize: "17px", fontWeight: "800", margin: "0 0 4px", color: "#111827" },
  previewAuthor: { fontSize: "13px", color: "#6b7280", margin: "0 0 10px" },
  previewMeta: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  previewRating: { fontSize: "13px", color: "#92400e", fontWeight: "700" },
  previewPrice: { fontSize: "18px", color: "#4f46e5", fontWeight: "800" },
  previewStatus: { display: "inline-block", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", marginBottom: "10px" },
  previewDesc: { fontSize: "12px", color: "#6b7280", lineHeight: "1.5", margin: 0 },

  compareBox: { background: "white", borderRadius: "14px", padding: "16px", border: "1px solid #e5e7eb" },
  compareTitle: { fontWeight: "700", color: "#374151", margin: "0 0 12px", fontSize: "13px" },
  compareRow: { display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "8px", alignItems: "flex-start" },
  compareField: { fontWeight: "700", fontSize: "12px", color: "#6b7280", minWidth: "70px" },
  compareOld: { margin: 0, fontSize: "12px", color: "#ef4444", textDecoration: "line-through" },
  compareNew: { margin: 0, fontSize: "12px", color: "#16a34a", fontWeight: "600" },
};

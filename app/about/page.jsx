export const metadata = {
  title: "About Us – BookBuddy",
  description: "Learn about BookBuddy, our mission, vision, and the team behind your favorite online bookstore.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <p style={styles.heroTag}>📚 About BookBuddy</p>
        <h1 style={styles.heroTitle}>We Love Books.<br />We Built This for You.</h1>
        <p style={styles.heroSub}>
          BookBuddy is your all-in-one destination to discover, explore, and manage your reading life.
          Whether you&apos;re a casual reader or a dedicated bookworm, we&apos;ve got you covered.
        </p>
      </section>

      {/* Stats */}
      <section style={styles.stats}>
        {[
          { value: "10,000+", label: "Books Available" },
          { value: "50,000+", label: "Happy Readers" },
          { value: "100+", label: "Genres & Categories" },
          { value: "4.9★", label: "Average Rating" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <p style={styles.statValue}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Our Story */}
      <section style={styles.section}>
        <div style={styles.twoCol}>
          <div>
            <h2 style={styles.sectionTitle}>Our Story</h2>
            <p style={styles.body}>
              BookBuddy was born from a simple frustration: finding a great book shouldn&apos;t be hard.
              In 2024, a small team of passionate readers and developers came together to build a platform
              that makes book discovery intuitive, personal, and joyful.
            </p>
            <p style={styles.body}>
              We started with a simple catalog app and quickly grew into a full-featured bookstore — with
              curated collections, personalized libraries, reader reviews, and a community of book lovers
              who share their passion every day.
            </p>
            <p style={styles.body}>
              Today, BookBuddy serves thousands of readers across India, helping them find their next
              favorite book one recommendation at a time.
            </p>
          </div>
          <div style={styles.storyIllustration}>📖</div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={styles.mvSection}>
        <div style={styles.mvCard}>
          <div style={styles.mvIcon}>🎯</div>
          <h2 style={styles.mvTitle}>Our Mission</h2>
          <p style={styles.mvBody}>
            To make quality books accessible to everyone by creating a seamless, enjoyable, and
            personalized reading discovery experience. We believe every reader deserves to find
            their perfect book effortlessly.
          </p>
        </div>
        <div style={styles.mvCard}>
          <div style={styles.mvIcon}>🔭</div>
          <h2 style={styles.mvTitle}>Our Vision</h2>
          <p style={styles.mvBody}>
            To be India&apos;s most trusted and beloved online bookstore — a place where readers
            connect with stories that inspire, educate, and transform. We envision a world where
            every person has access to the books that change their life.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, textAlign: "center", marginBottom: "32px" }}>What We Stand For</h2>
        <div style={styles.valuesGrid}>
          {[
            { icon: "💡", title: "Curiosity", desc: "We foster a love of learning through diverse and thoughtfully curated book collections." },
            { icon: "❤️", title: "Community", desc: "Reading is better together. We build spaces for readers to share, review, and connect." },
            { icon: "🌍", title: "Accessibility", desc: "We believe great books should be available to everyone, regardless of background or budget." },
            { icon: "⭐", title: "Quality", desc: "Every book on our platform is selected with care to ensure the best reading experience." },
            { icon: "🔒", title: "Trust", desc: "Your data and privacy are sacred to us. We operate with full transparency and integrity." },
            { icon: "🚀", title: "Innovation", desc: "We continuously evolve our platform to better serve our readers with the latest technology." },
          ].map((v) => (
            <div key={v.title} style={styles.valueCard}>
              <div style={styles.valueIcon}>{v.icon}</div>
              <h3 style={styles.valueTitle}>{v.title}</h3>
              <p style={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, textAlign: "center", marginBottom: "32px" }}>Meet the Team</h2>
        <div style={styles.teamGrid}>
          {[
            { name: "Arjun Sharma", role: "Founder & CEO", emoji: "👨‍💼", bio: "Book lover turned entrepreneur with 10 years in ed-tech." },
            { name: "Priya Mehta", role: "Head of Curation", emoji: "👩‍🏫", bio: "Former librarian who has read 2,000+ books and counting." },
            { name: "Rahul Dev", role: "Lead Engineer", emoji: "👨‍💻", bio: "Full-stack developer passionate about building intuitive products." },
            { name: "Sneha Patel", role: "Community Manager", emoji: "👩‍🎤", bio: "Connects our community of readers and curates our social presence." },
          ].map((m) => (
            <div key={m.name} style={styles.teamCard}>
              <div style={styles.teamAvatar}>{m.emoji}</div>
              <h3 style={styles.teamName}>{m.name}</h3>
              <p style={styles.teamRole}>{m.role}</p>
              <p style={styles.teamBio}>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={styles.contactSection}>
        <h2 style={{ margin: "0 0 12px", fontSize: "28px" }}>Get in Touch</h2>
        <p style={{ color: "#6b7280", margin: "0 0 24px" }}>
          Have questions, feedback, or just want to say hello? We&apos;d love to hear from you.
        </p>
        <div style={styles.contactCards}>
          {[
            { icon: "📧", label: "Email Us", value: "hello@bookbuddy.in" },
            { icon: "📞", label: "Call Us", value: "+91 98765 43210" },
            { icon: "📍", label: "Visit Us", value: "Pune, Maharashtra, India" },
          ].map((c) => (
            <div key={c.label} style={styles.contactCard}>
              <span style={styles.contactIcon}>{c.icon}</span>
              <div>
                <p style={styles.contactLabel}>{c.label}</p>
                <p style={styles.contactValue}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    textAlign: "center",
    padding: "64px 40px",
    background: "linear-gradient(135deg, #eef2ff, #f0fdf4)",
    borderRadius: "24px",
    marginBottom: "48px",
  },
  heroTag: {
    display: "inline-block",
    background: "#e0e7ff",
    color: "#4f46e5",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  heroTitle: { fontSize: "48px", fontWeight: "800", margin: "0 0 16px", color: "#111827", lineHeight: "1.2" },
  heroSub: { fontSize: "18px", color: "#4b5563", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "56px",
  },
  statCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px 16px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  statValue: { fontSize: "32px", fontWeight: "800", color: "#4f46e5", margin: "0 0 4px" },
  statLabel: { color: "#6b7280", margin: 0, fontWeight: "600", fontSize: "14px" },
  section: { marginBottom: "56px" },
  sectionTitle: { fontSize: "28px", fontWeight: "800", margin: "0 0 16px", color: "#111827" },
  body: { fontSize: "16px", color: "#4b5563", lineHeight: "1.8", margin: "0 0 16px" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 200px",
    gap: "40px",
    alignItems: "center",
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    border: "1px solid #e5e7eb",
  },
  storyIllustration: { fontSize: "100px", textAlign: "center", lineHeight: 1 },
  mvSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "56px",
  },
  mvCard: {
    background: "white",
    borderRadius: "20px",
    padding: "36px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
  },
  mvIcon: { fontSize: "40px", marginBottom: "16px" },
  mvTitle: { fontSize: "22px", fontWeight: "800", margin: "0 0 12px", color: "#111827" },
  mvBody: { fontSize: "16px", color: "#4b5563", lineHeight: "1.7", margin: 0 },
  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  valueCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    border: "1px solid #e5e7eb",
  },
  valueIcon: { fontSize: "32px", marginBottom: "12px" },
  valueTitle: { fontSize: "18px", fontWeight: "700", margin: "0 0 8px", color: "#111827" },
  valueDesc: { fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: "1.6" },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  teamCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  teamAvatar: { fontSize: "56px", marginBottom: "12px" },
  teamName: { fontSize: "17px", fontWeight: "700", margin: "0 0 4px", color: "#111827" },
  teamRole: { color: "#4f46e5", fontWeight: "600", fontSize: "13px", margin: "0 0 8px" },
  teamBio: { fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: "1.5" },
  contactSection: {
    background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
    borderRadius: "24px",
    padding: "48px",
    textAlign: "center",
  },
  contactCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  contactCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "white",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    textAlign: "left",
  },
  contactIcon: { fontSize: "28px" },
  contactLabel: { fontWeight: "700", margin: "0 0 2px", color: "#111827", fontSize: "14px" },
  contactValue: { color: "#6b7280", margin: 0, fontSize: "13px" },
};

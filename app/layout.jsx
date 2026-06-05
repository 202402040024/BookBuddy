import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata = {
  title: "BookBuddy – Your Online Bookstore",
  description: "Discover, explore and manage your favorite books with BookBuddy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f9fafb" }}>
        <SessionWrapper>
          <Navbar />
          <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 20px" }}>
            {children}
          </main>
          <footer style={footerStyle}>
            <p style={{ margin: 0, color: "#6b7280" }}>
              © {new Date().getFullYear()} BookBuddy. All rights reserved.
            </p>
          </footer>
        </SessionWrapper>
      </body>
    </html>
  );
}

const footerStyle = {
  textAlign: "center",
  padding: "28px 20px",
  borderTop: "1px solid #e5e7eb",
  background: "white",
  marginTop: "48px",
};

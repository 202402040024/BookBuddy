"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Banner() {
  const params = useSearchParams();
  if (params.get("error") !== "access_denied") return null;

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>🔒</span>
      <div>
        <p style={styles.title}>Access Denied</p>
        <p style={styles.msg}>You need admin privileges to access that page.</p>
      </div>
    </div>
  );
}

export default function AccessDeniedBanner() {
  return (
    <Suspense fallback={null}>
      <Banner />
    </Suspense>
  );
}

const styles = {
  banner: {
    display: "flex", alignItems: "center", gap: "14px",
    background: "#fef2f2", border: "1px solid #fecaca",
    borderRadius: "14px", padding: "16px 20px", marginBottom: "24px",
  },
  icon:  { fontSize: "28px" },
  title: { fontWeight: "700", color: "#991b1b", margin: "0 0 2px", fontSize: "15px" },
  msg:   { color: "#b91c1c", margin: 0, fontSize: "14px" },
};

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="spinner" style={{ width: "32px", height: "32px", borderWidth: "3px" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="var(--accent)" />
            <path d="M7 8h10a3 3 0 010 6H7V8z" fill="#0f0e0a" />
            <path d="M7 14h12a3 3 0 010 6H7v-6z" fill="#0f0e0a" opacity="0.6" />
            <rect x="7" y="8" width="2" height="12" fill="#0f0e0a" />
          </svg>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>
            Bibliotheca
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{user.name}</span>
          <Button variant="ghost" onClick={() => router.push("/dashboard/settings")}>Settings</Button>
          <Button variant="ghost" onClick={logout}>Sign out</Button>
        </div>
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px" }}>
        <div className="animate-fade-up">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>
            Your library dashboard · Role:{" "}
            <span style={{
              background: "var(--accent-dim)", color: "var(--accent)",
              padding: "2px 8px", borderRadius: "4px",
              fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em",
            }}>
              {user.role}
            </span>
          </p>
        </div>

        <div
          className="animate-fade-up delay-1"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}
        >
          {[
            { label: "Books borrowed", value: "—" },
            { label: "Active reservations", value: "—" },
            { label: "Pending returns", value: "—" },
            { label: "Reviews written", value: "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "12px", padding: "24px",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "28px", fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
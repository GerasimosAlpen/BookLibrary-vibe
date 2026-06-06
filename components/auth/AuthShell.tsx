"use client";

import React from "react";
import Link from "next/link";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthShell({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: "-20%", left: "-10%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="var(--accent)" />
              <path d="M7 8h10a3 3 0 010 6H7V8z" fill="#0f0e0a" />
              <path d="M7 14h12a3 3 0 010 6H7v-6z" fill="#0f0e0a" opacity="0.6" />
              <rect x="7" y="8" width="2" height="12" fill="#0f0e0a" />
            </svg>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px", fontWeight: 700,
                color: "var(--text-primary)", letterSpacing: "-0.02em",
              }}
            >
              Bibliotheca
            </span>
          </div>
        </div>

        <div
          className="animate-fade-up delay-1"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "36px 32px",
          }}
        >
          <div style={{ marginBottom: "28px" }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "26px", fontWeight: 700,
                color: "var(--text-primary)", margin: "0 0 6px",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
              {subtitle}
            </p>
          </div>
          {children}
        </div>

        <p
          className="animate-fade-up delay-2"
          style={{
            textAlign: "center", marginTop: "20px",
            color: "var(--text-secondary)", fontSize: "14px",
          }}
        >
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
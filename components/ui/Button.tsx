"use client";

import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
}

export function Button({
  loading,
  variant = "primary",
  fullWidth,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: fullWidth ? "100%" : "auto",
        padding: "13px 24px",
        borderRadius: "8px",
        border: isPrimary ? "none" : "1px solid var(--border)",
        background: isPrimary
          ? disabled || loading
            ? "rgba(201,169,110,0.4)"
            : "var(--accent)"
          : "transparent",
        color: isPrimary ? "#0f0e0a" : "var(--text-secondary)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = isPrimary
            ? "var(--accent-hover)"
            : "var(--accent-dim)";
          if (!isPrimary) e.currentTarget.style.color = "var(--accent)";
          if (!isPrimary) e.currentTarget.style.borderColor = "var(--accent)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isPrimary
          ? disabled || loading
            ? "rgba(201,169,110,0.4)"
            : "var(--accent)"
          : "transparent";
        if (!isPrimary) {
          e.currentTarget.style.color = "var(--text-secondary)";
          e.currentTarget.style.borderColor = "var(--border)";
        }
      }}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}
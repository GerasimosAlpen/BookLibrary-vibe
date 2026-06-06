"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          htmlFor={inputId}
          style={{
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          {...props}
          style={{
            background: "var(--bg-input)",
            border: `1px solid ${error ? "var(--error)" : "var(--border)"}`,
            borderRadius: "8px",
            padding: "12px 16px",
            color: "var(--text-primary)",
            fontSize: "15px",
            outline: "none",
            transition: "border-color 0.2s",
            width: "100%",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? "var(--error)" : "var(--border-focus)";
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "var(--error)" : "var(--border)";
            props.onBlur?.(e);
          }}
        />
        {error && (
          <p style={{ fontSize: "12px", color: "var(--error)", margin: 0 }}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
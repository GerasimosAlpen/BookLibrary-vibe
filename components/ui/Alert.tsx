"use client";

import React from "react";

interface AlertProps {
  type: "error" | "success";
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  const isError = type === "error";

  return (
    <div
      role="alert"
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        background: isError ? "var(--error-bg)" : "rgba(126,184,154,0.1)",
        border: `1px solid ${isError ? "var(--error)" : "var(--success)"}`,
        color: isError ? "var(--error)" : "var(--success)",
        fontSize: "14px",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}
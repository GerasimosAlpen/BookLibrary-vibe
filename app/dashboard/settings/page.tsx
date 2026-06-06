"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

function validate(current: string, next: string, confirm: string): FormErrors {
  const errors: FormErrors = {};
  if (!current) errors.currentPassword = "Current password is required";
  if (!next) errors.newPassword = "New password is required";
  else if (next.length < 8) errors.newPassword = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(next)) errors.newPassword = "Must contain at least one uppercase letter";
  else if (!/[0-9]/.test(next)) errors.newPassword = "Must contain at least one number";
  if (!confirm) errors.confirmPassword = "Please confirm your new password";
  else if (next !== confirm) errors.confirmPassword = "Passwords do not match";
  return errors;
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const fieldErrors = validate(currentPassword, newPassword, confirmPassword);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const json = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: json.message ?? "Failed to update password" });
        return;
      }

      setStatus({ type: "success", message: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav
        style={{
          borderBottom: "1px solid var(--border)", background: "var(--bg-card)",
          padding: "0 32px", display: "flex", alignItems: "center", gap: "16px", height: "60px",
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "none", border: "none", color: "var(--text-secondary)",
            cursor: "pointer", fontSize: "14px", display: "flex",
            alignItems: "center", gap: "6px", fontFamily: "inherit", padding: 0,
          }}
        >
          ← Dashboard
        </button>
        <span style={{ color: "var(--border)", fontSize: "16px" }}>|</span>
        <span style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 500 }}>Settings</span>
      </nav>

      <main style={{ maxWidth: "480px", margin: "0 auto", padding: "48px 32px" }}>
        <h1 className="animate-fade-up" style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
          Account Settings
        </h1>
        <p className="animate-fade-up delay-1" style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>
          {user.email}
        </p>

        <div
          className="animate-fade-up delay-2"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px" }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600, margin: "0 0 24px" }}>
            Change Password
          </h2>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {status && <Alert type={status.type} message={status.message} />}

            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, currentPassword: undefined })); }}
              error={errors.currentPassword}
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: undefined })); }}
              error={errors.newPassword}
              autoComplete="new-password"
              placeholder="••••••••"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: undefined })); }}
              error={errors.confirmPassword}
              autoComplete="new-password"
              placeholder="••••••••"
            />

            <Button type="submit" fullWidth loading={submitting} style={{ marginTop: "6px" }}>
              {submitting ? "Updating…" : "Update Password"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
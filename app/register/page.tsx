"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

function validate(name: string, email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!name || name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";
  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";
  else if (password.length < 8)
    errors.password = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(password))
    errors.password = "Must contain at least one uppercase letter";
  else if (!/[0-9]/.test(password))
    errors.password = "Must contain at least one number";
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    const fieldErrors = validate(name, email, password);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        setApiError(json.message ?? "Registration failed");
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Join the Bibliotheca community"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "18px" }}
      >
        {apiError && <Alert type="error" message={apiError} />}

        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((p) => ({ ...p, name: undefined }));
          }}
          error={errors.name}
          autoComplete="name"
          placeholder="Jane Doe"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: undefined }));
          }}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: undefined }));
            }}
            error={errors.password}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              marginTop: "6px",
              lineHeight: 1.5,
            }}
          >
            Min. 8 chars · 1 uppercase · 1 number
          </p>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          style={{ marginTop: "6px" }}
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}

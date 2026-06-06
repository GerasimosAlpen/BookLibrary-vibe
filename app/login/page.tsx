"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/lib/auth-context";

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    const fieldErrors = validate(email, password);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        setApiError(json.message ?? "Login failed");
        return;
      }

      sessionStorage.setItem("auth_user", JSON.stringify(json.data.user));
      setUser(json.data.user);
      router.push("/dashboard");
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your library account"
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkHref="/register"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "18px" }}
      >
        {apiError && <Alert type="error" message={apiError} />}

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
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((p) => ({ ...p, password: undefined }));
          }}
          error={errors.password}
          autoComplete="current-password"
          placeholder="••••••••"
        />

        <Button type="submit" fullWidth loading={loading} style={{ marginTop: "6px" }}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
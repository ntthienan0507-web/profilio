"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "./_components/login-form";
import { AdminTabs } from "./_components/admin-tabs";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/content", { method: "GET" })
      .then(() => {
        // Try a PUT with empty body to check auth — if 401, not logged in
        return fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: "{}" });
      })
      .then((r) => {
        if (r.ok || r.status === 400) setAuthed(true);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--text-muted)]">Checking session...</p>
      </div>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return <AdminTabs onLogout={() => setAuthed(false)} />;
}

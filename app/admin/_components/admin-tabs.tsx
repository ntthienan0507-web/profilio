"use client";

import { useState, useEffect, useCallback } from "react";
import type { PortfolioContent } from "@/lib/types";
import { AboutEditor } from "./about-editor";
import { SkillsEditor } from "./skills-editor";
import { ExperienceEditor } from "./experience-editor";
import { AchievementsEditor } from "./achievements-editor";
import { EducationEditor } from "./education-editor";
import { HobbiesEditor } from "./hobbies-editor";
import { ConfigEditor } from "./config-editor";
import { NavEditor } from "./nav-editor";

const TABS = [
  { key: "config", label: "Site Config" },
  { key: "nav", label: "Navigation" },
  { key: "about", label: "About" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "achievements", label: "Achievements" },
  { key: "education", label: "Education" },
  { key: "hobbies", label: "Hobbies" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AdminTabs({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabKey>("config");
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => setStatus("Failed to load content"))
      .finally(() => setLoading(false));
  }, []);

  const update = useCallback(
    (partial: Partial<PortfolioContent>) => {
      setContent((prev) => (prev ? { ...prev, ...partial } : prev));
    },
    []
  );

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setStatus("");

    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        const err = await res.json();
        setStatus(err.error || "Save failed");
        return;
      }

      setStatus("Saved successfully");
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onLogout();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--text-muted)]">Loading content...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Failed to load content</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
            P
          </span>
          <h1 className="text-lg font-semibold">Content Editor</h1>
        </div>
        <div className="flex items-center gap-3">
          {status && (
            <span
              className={`text-sm ${status.includes("success") ? "text-green-500" : "text-red-500"}`}
            >
              {status}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-[var(--glass-border)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-accent text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6">
        {tab === "config" && (
          <ConfigEditor
            siteConfig={content.siteConfig}
            onChange={(siteConfig) => update({ siteConfig })}
          />
        )}
        {tab === "nav" && (
          <NavEditor
            navLinks={content.navLinks}
            onChange={(navLinks) => update({ navLinks })}
          />
        )}
        {tab === "about" && (
          <AboutEditor
            aboutText={content.aboutText}
            stats={content.stats}
            onChange={(aboutText, stats) => update({ aboutText, stats })}
          />
        )}
        {tab === "skills" && (
          <SkillsEditor
            skills={content.skills}
            onChange={(skills) => update({ skills })}
          />
        )}
        {tab === "experience" && (
          <ExperienceEditor
            experiences={content.experiences}
            onChange={(experiences) => update({ experiences })}
          />
        )}
        {tab === "achievements" && (
          <AchievementsEditor
            achievements={content.achievements}
            onChange={(achievements) => update({ achievements })}
          />
        )}
        {tab === "education" && (
          <EducationEditor
            education={content.education}
            onChange={(education) => update({ education })}
          />
        )}
        {tab === "hobbies" && (
          <HobbiesEditor
            hobbies={content.hobbies}
            onChange={(hobbies) => update({ hobbies })}
          />
        )}
      </div>
    </div>
  );
}

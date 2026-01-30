"use client";

import { SiteConfig } from "@/lib/types";

interface ConfigEditorProps {
  siteConfig: SiteConfig;
  onChange: (siteConfig: SiteConfig) => void;
}

export function ConfigEditor({ siteConfig, onChange }: ConfigEditorProps) {
  const handleChange = (field: keyof SiteConfig, value: string) => {
    onChange({ ...siteConfig, [field]: value });
  };

  const handleLinkChange = (field: keyof SiteConfig["links"], value: string) => {
    onChange({
      ...siteConfig,
      links: { ...siteConfig.links, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-3">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">Basic Information</h3>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            Name
          </label>
          <input
            type="text"
            value={siteConfig.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            Title
          </label>
          <input
            type="text"
            value={siteConfig.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
            placeholder="Full Stack Developer"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            Description
          </label>
          <textarea
            value={siteConfig.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
            rows={3}
            placeholder="Portfolio website showcasing my work..."
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            URL
          </label>
          <input
            type="text"
            value={siteConfig.url}
            onChange={(e) => handleChange("url", e.target.value)}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
            placeholder="https://johndoe.com"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            OG Image
          </label>
          <input
            type="text"
            value={siteConfig.ogImage}
            onChange={(e) => handleChange("ogImage", e.target.value)}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
            placeholder="/og.jpg"
          />
        </div>
      </div>

      <div className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-3">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">Social Links</h3>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            GitHub
          </label>
          <input
            type="text"
            value={siteConfig.links.github}
            onChange={(e) => handleLinkChange("github", e.target.value)}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            LinkedIn
          </label>
          <input
            type="text"
            value={siteConfig.links.linkedin}
            onChange={(e) => handleLinkChange("linkedin", e.target.value)}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            Email
          </label>
          <input
            type="email"
            value={siteConfig.links.email}
            onChange={(e) => handleLinkChange("email", e.target.value)}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
            placeholder="john@example.com"
          />
        </div>
      </div>
    </div>
  );
}

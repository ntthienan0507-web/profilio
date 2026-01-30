"use client";

import { NavLink } from "@/lib/types";

interface NavEditorProps {
  navLinks: NavLink[];
  onChange: (navLinks: NavLink[]) => void;
}

export function NavEditor({ navLinks, onChange }: NavEditorProps) {
  const handleLinkChange = (index: number, field: keyof NavLink, value: string) => {
    const newLinks = [...navLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  const addLink = () => {
    onChange([...navLinks, { label: "", href: "" }]);
  };

  const removeLink = (index: number) => {
    onChange(navLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {navLinks.map((link, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]"
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Link {index + 1}
            </label>
            <button
              onClick={() => removeLink(index)}
              className="text-red-500 hover:text-red-400 text-sm px-2 py-1"
            >
              × Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                Label
              </label>
              <input
                type="text"
                value={link.label}
                onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                placeholder="About"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                Href
              </label>
              <input
                type="text"
                value={link.href}
                onChange={(e) => handleLinkChange(index, "href", e.target.value)}
                className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                placeholder="#about"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addLink}
        className="px-4 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-accent text-accent"
      >
        Add Link
      </button>
    </div>
  );
}

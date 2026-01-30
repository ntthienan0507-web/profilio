"use client";

import { SkillCategory } from "@/lib/types";

interface SkillsEditorProps {
  skills: SkillCategory[];
  onChange: (skills: SkillCategory[]) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const handleCategoryChange = (index: number, field: keyof SkillCategory, value: string | string[]) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    onChange(newSkills);
  };

  const addCategory = () => {
    onChange([...skills, { category: "", skills: [] }]);
  };

  const removeCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {skills.map((skillCat, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-3"
        >
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Category {index + 1}
            </label>
            <button
              onClick={() => removeCategory(index)}
              className="text-red-500 hover:text-red-400 text-sm px-2 py-1"
            >
              × Remove
            </button>
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
              Category Name
            </label>
            <input
              type="text"
              value={skillCat.category}
              onChange={(e) => handleCategoryChange(index, "category", e.target.value)}
              className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
              placeholder="Frontend"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
              Skills (comma-separated)
            </label>
            <textarea
              value={skillCat.skills.join(", ")}
              onChange={(e) =>
                handleCategoryChange(
                  index,
                  "skills",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
              rows={3}
              placeholder="React, TypeScript, Next.js"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addCategory}
        className="px-4 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-accent text-accent"
      >
        Add Category
      </button>
    </div>
  );
}

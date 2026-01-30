"use client";

import { Education } from "@/lib/types";

interface EducationEditorProps {
  education: Education;
  onChange: (education: Education) => void;
}

export function EducationEditor({ education, onChange }: EducationEditorProps) {
  const handleChange = (field: keyof Education, value: string) => {
    onChange({ ...education, [field]: value });
  };

  return (
    <div className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-3">
      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">
          Degree
        </label>
        <input
          type="text"
          value={education.degree}
          onChange={(e) => handleChange("degree", e.target.value)}
          className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
          placeholder="Bachelor of Science in Computer Science"
        />
      </div>

      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">
          School
        </label>
        <input
          type="text"
          value={education.school}
          onChange={(e) => handleChange("school", e.target.value)}
          className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
          placeholder="University of Technology"
        />
      </div>

      <div>
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">
          Period
        </label>
        <input
          type="text"
          value={education.period}
          onChange={(e) => handleChange("period", e.target.value)}
          className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
          placeholder="2018 - 2022"
        />
      </div>
    </div>
  );
}

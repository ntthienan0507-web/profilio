"use client";

import { useState } from "react";
import { Experience } from "@/lib/types";

interface ExperienceEditorProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export function ExperienceEditor({ experiences, onChange }: ExperienceEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string | string[] | { value: string; label: string }[]
  ) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    onChange(newExperiences);
  };

  const addExperience = () => {
    onChange([
      ...experiences,
      {
        title: "",
        subtitle: "",
        company: "",
        period: "",
        tech: [],
        metrics: [
          { value: "", label: "" },
          { value: "", label: "" },
          { value: "", label: "" },
        ],
        bullets: [],
      },
    ]);
    setExpandedIndex(experiences.length);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]"
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-[var(--glass-bg)]/80"
            onClick={() => toggleExpanded(index)}
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {exp.title || `Experience ${index + 1}`}
              </div>
              {exp.company && (
                <div className="text-xs text-[var(--text-secondary)]">{exp.company}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeExperience(index);
                }}
                className="text-red-500 hover:text-red-400 text-sm px-2 py-1"
              >
                × Remove
              </button>
              <span className="text-[var(--text-secondary)]">
                {expandedIndex === index ? "▼" : "▶"}
              </span>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="p-4 pt-0 space-y-3 border-t border-[var(--glass-border)]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                    className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={exp.subtitle}
                    onChange={(e) => handleExperienceChange(index, "subtitle", e.target.value)}
                    className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                    placeholder="Full Stack"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                    className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                    Period
                  </label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
                    className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                    placeholder="2023 - Present"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                  Tech Stack (comma-separated)
                </label>
                <textarea
                  value={exp.tech.join(", ")}
                  onChange={(e) =>
                    handleExperienceChange(
                      index,
                      "tech",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                  rows={2}
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">
                  Metrics
                </label>
                <div className="space-y-2">
                  {exp.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const newMetrics = [...exp.metrics];
                          newMetrics[metricIndex] = { ...metric, value: e.target.value };
                          handleExperienceChange(index, "metrics", newMetrics);
                        }}
                        className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                        placeholder="50%"
                      />
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => {
                          const newMetrics = [...exp.metrics];
                          newMetrics[metricIndex] = { ...metric, label: e.target.value };
                          handleExperienceChange(index, "metrics", newMetrics);
                        }}
                        className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                        placeholder="faster"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                  Bullets (one per line)
                </label>
                <textarea
                  value={exp.bullets.join("\n")}
                  onChange={(e) =>
                    handleExperienceChange(
                      index,
                      "bullets",
                      e.target.value.split("\n").filter(Boolean)
                    )
                  }
                  className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                  rows={4}
                  placeholder="Led development of feature X&#10;Improved performance by Y%"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addExperience}
        className="px-4 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-accent text-accent"
      >
        Add Experience
      </button>
    </div>
  );
}

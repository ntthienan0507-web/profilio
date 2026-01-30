"use client";

import { Stat } from "@/lib/types";

interface AboutEditorProps {
  aboutText: string;
  stats: Stat[];
  onChange: (aboutText: string, stats: Stat[]) => void;
}

export function AboutEditor({ aboutText, stats, onChange }: AboutEditorProps) {
  const handleAboutChange = (text: string) => {
    onChange(text, stats);
  };

  const handleStatChange = (index: number, field: keyof Stat, value: string | number) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onChange(aboutText, newStats);
  };

  const addStat = () => {
    onChange(aboutText, [...stats, { value: 0, suffix: "", label: "" }]);
  };

  const removeStat = (index: number) => {
    onChange(aboutText, stats.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
          About Text
        </label>
        <textarea
          value={aboutText}
          onChange={(e) => handleAboutChange(e.target.value)}
          className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
          rows={6}
          placeholder="Write about yourself..."
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
          Stats
        </label>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex gap-2 items-start p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]"
            >
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                    Value
                  </label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) =>
                      handleStatChange(index, "value", parseInt(e.target.value) || 0)
                    }
                    className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => handleStatChange(index, "suffix", e.target.value)}
                    className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                    placeholder="+"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, "label", e.target.value)}
                    className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                    placeholder="Projects"
                  />
                </div>
              </div>
              <button
                onClick={() => removeStat(index)}
                className="text-red-500 hover:text-red-400 text-sm px-2 py-1 mt-5"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addStat}
          className="mt-3 px-4 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-accent text-accent"
        >
          Add Stat
        </button>
      </div>
    </div>
  );
}

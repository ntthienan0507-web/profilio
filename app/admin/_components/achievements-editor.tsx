"use client";

import { Achievement } from "@/lib/types";

interface AchievementsEditorProps {
  achievements: Achievement[];
  onChange: (achievements: Achievement[]) => void;
}

const iconOptions = ["zap", "bar-chart", "clock", "award", "star", "code", "globe"];

export function AchievementsEditor({ achievements, onChange }: AchievementsEditorProps) {
  const handleAchievementChange = (
    index: number,
    field: keyof Achievement,
    value: string
  ) => {
    const newAchievements = [...achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    onChange(newAchievements);
  };

  const addAchievement = () => {
    onChange([...achievements, { icon: "star", metric: "", label: "" }]);
  };

  const removeAchievement = (index: number) => {
    onChange(achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {achievements.map((achievement, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]"
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Achievement {index + 1}
            </label>
            <button
              onClick={() => removeAchievement(index)}
              className="text-red-500 hover:text-red-400 text-sm px-2 py-1"
            >
              × Remove
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                Icon
              </label>
              <select
                value={achievement.icon}
                onChange={(e) => handleAchievementChange(index, "icon", e.target.value)}
                className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                Metric
              </label>
              <input
                type="text"
                value={achievement.metric}
                onChange={(e) => handleAchievementChange(index, "metric", e.target.value)}
                className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                placeholder="100+"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                Label
              </label>
              <input
                type="text"
                value={achievement.label}
                onChange={(e) => handleAchievementChange(index, "label", e.target.value)}
                className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                placeholder="Projects Delivered"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addAchievement}
        className="px-4 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-accent text-accent"
      >
        Add Achievement
      </button>
    </div>
  );
}

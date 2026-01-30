"use client";

import { Hobby } from "@/lib/types";

interface HobbiesEditorProps {
  hobbies: Hobby[];
  onChange: (hobbies: Hobby[]) => void;
}

const iconOptions = ["code", "gamepad", "music", "book", "coffee", "globe", "camera", "heart"];

export function HobbiesEditor({ hobbies, onChange }: HobbiesEditorProps) {
  const handleHobbyChange = (index: number, field: keyof Hobby, value: string) => {
    const newHobbies = [...hobbies];
    newHobbies[index] = { ...newHobbies[index], [field]: value };
    onChange(newHobbies);
  };

  const addHobby = () => {
    onChange([...hobbies, { icon: "heart", label: "", description: "" }]);
  };

  const removeHobby = (index: number) => {
    onChange(hobbies.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {hobbies.map((hobby, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]"
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Hobby {index + 1}
            </label>
            <button
              onClick={() => removeHobby(index)}
              className="text-red-500 hover:text-red-400 text-sm px-2 py-1"
            >
              × Remove
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                Icon
              </label>
              <select
                value={hobby.icon}
                onChange={(e) => handleHobbyChange(index, "icon", e.target.value)}
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
                Label
              </label>
              <input
                type="text"
                value={hobby.label}
                onChange={(e) => handleHobbyChange(index, "label", e.target.value)}
                className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                placeholder="Gaming"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                Description
              </label>
              <input
                type="text"
                value={hobby.description}
                onChange={(e) => handleHobbyChange(index, "description", e.target.value)}
                className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm outline-none focus:border-accent w-full"
                placeholder="Strategy games and puzzles"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addHobby}
        className="px-4 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-accent text-accent"
      >
        Add Hobby
      </button>
    </div>
  );
}

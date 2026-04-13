"use client";

const moods = [
  { value: "grateful", emoji: "🥹", label: "grateful" },
  { value: "happy", emoji: "😁", label: "happy" },
  { value: "hopeful", emoji: "🙏", label: "hopeful" },
  { value: "cautious", emoji: "😐", label: "cautious" },
  { value: "frustrated", emoji: "😤", label: "frustrated" },
  { value: "hurt", emoji: "😢", label: "hurt" },
  { value: "angry", emoji: "😡", label: "angry" },
  { value: "done", emoji: "😒", label: "over it" },
];

interface Props {
  value: string | null;
  onChange: (mood: string | null) => void;
}

export default function MoodPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onChange(value === mood.value ? null : mood.value)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-sm font-medium transition-all ${
            value === mood.value
              ? "bg-pink-100 border-pink-400 text-pink-700 scale-105"
              : "bg-stone-50 border-stone-200 text-stone-500"
          }`}
        >
          <span>{mood.emoji}</span>
          <span>{mood.label}</span>
        </button>
      ))}
    </div>
  );
}

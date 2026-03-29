"use client";

const EMOJIS = ["😐", "😊", "😄", "🤩"];

interface GoodVibesSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function GoodVibesSlider({ value, onChange }: GoodVibesSliderProps) {
  return (
    <div>
      <p className="text-sm font-medium text-text-primary mb-2">Good vibes</p>
      <div className="flex items-center justify-between gap-2">
        {EMOJIS.map((emoji, i) => {
          const score = i + 1;
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`text-2xl p-2 rounded-lg transition-all ${
                value === score
                  ? "bg-brand-light scale-125"
                  : "hover:bg-surface-secondary"
              }`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

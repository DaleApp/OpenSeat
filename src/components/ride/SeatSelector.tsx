"use client";

interface SeatSelectorProps {
  value: number;
  onChange: (seats: number) => void;
}

export default function SeatSelector({ value, onChange }: SeatSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-text-primary mb-2">Available seats</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
              value === n
                ? "bg-brand text-white"
                : "bg-surface-secondary text-text-primary hover:bg-border"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

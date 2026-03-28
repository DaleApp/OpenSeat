"use client";

import Tag from "@/components/ui/Tag";

const RADIUS_OPTIONS = [1, 2, 5, 10];

interface PickupSelectorProps {
  mode: "driver" | "passenger";
  value: string;
  radius?: number;
  onChange: (value: string, radius?: number) => void;
}

export default function PickupSelector({ mode, value, radius, onChange }: PickupSelectorProps) {
  if (mode === "passenger") {
    const options = [
      { key: "pickup_me", label: "Pick me up" },
      { key: "i_go_to_you", label: "I'll go to you" },
      { key: "flexible", label: "Flexible" },
    ];

    return (
      <div>
        <p className="text-sm font-medium text-text-primary mb-2">Pickup preference</p>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <Tag
              key={o.key}
              label={o.label}
              selected={value === o.key}
              onClick={() => onChange(o.key)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-text-primary mb-2">Pickup model</p>
      <div className="flex flex-wrap gap-2 mb-3">
        <Tag
          label="Fixed point"
          selected={value === "fixed"}
          onClick={() => onChange("fixed")}
        />
        <Tag
          label="Flexible"
          selected={value === "flexible"}
          onClick={() => onChange("flexible", radius ?? 2)}
        />
      </div>
      {value === "flexible" && (
        <div>
          <p className="text-xs text-text-secondary mb-2">Pickup radius</p>
          <div className="flex gap-2">
            {RADIUS_OPTIONS.map((r) => (
              <Tag
                key={r}
                label={`${r} mi`}
                selected={radius === r}
                onClick={() => onChange("flexible", r)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

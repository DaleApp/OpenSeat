"use client";

import { VIBE_OPTIONS } from "@/lib/formatters";
import Tag from "@/components/ui/Tag";

interface VibeSelectorProps {
  value?: string;
  onChange: (vibe: string) => void;
}

export default function VibeSelector({ value, onChange }: VibeSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-text-primary mb-2">Ride vibe</p>
      <div className="flex flex-wrap gap-2">
        {VIBE_OPTIONS.map((v) => (
          <Tag
            key={v.key}
            label={v.label}
            selected={value === v.key}
            onClick={() => onChange(v.key)}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { RideFilters } from "@/types";
import { VIBE_OPTIONS } from "@/lib/formatters";
import Input from "@/components/ui/Input";
import Tag from "@/components/ui/Tag";
import { MapPinIcon, CalendarIcon, ClockIcon } from "@/components/ui/icons";

interface SearchFiltersProps {
  filters: RideFilters;
  onChange: (filters: RideFilters) => void;
}

export default function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  function update(partial: Partial<RideFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Destination"
        placeholder="Where are you going?"
        value={filters.destination ?? ""}
        onChange={(e) => update({ destination: e.target.value })}
        icon={<MapPinIcon size={18} />}
      />

      <Input
        label="Date"
        type="date"
        min={new Date().toISOString().split("T")[0]}
        value={filters.date ?? ""}
        onChange={(e) => update({ date: e.target.value })}
        icon={<CalendarIcon size={18} />}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="From"
          type="time"
          value={filters.timeFrom ?? ""}
          onChange={(e) => update({ timeFrom: e.target.value })}
          icon={<ClockIcon size={18} />}
        />
        <Input
          label="To"
          type="time"
          value={filters.timeTo ?? ""}
          onChange={(e) => update({ timeTo: e.target.value })}
          icon={<ClockIcon size={18} />}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-text-primary mb-2">Vibe</p>
        <div className="flex flex-wrap gap-2">
          {VIBE_OPTIONS.map((v) => (
            <Tag
              key={v.key}
              label={v.label}
              selected={filters.vibe === v.key}
              onClick={() =>
                update({ vibe: filters.vibe === v.key ? undefined : v.key })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

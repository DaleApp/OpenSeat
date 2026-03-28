"use client";

import { CommunityEvent } from "@/types";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import { CalendarIcon, MapPinIcon } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

function formatEventDateTime(date: string, time: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const monthName = d.toLocaleString("en-US", { month: "short" });
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, "0");
  return `${monthName} ${day} · ${h}:${m} ${ampm}`;
}

interface EventCardProps {
  event: CommunityEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  return (
    <Card onClick={() => router.push(`/events/${event.id}`)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text-primary text-base leading-snug">
            {event.name}
          </h3>
          <Tag
            label={`${event.interestedUsers.length} going`}
            variant="success"
            className="shrink-0"
          />
        </div>

        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <CalendarIcon size={14} className="text-brand shrink-0" />
          <span>{formatEventDateTime(event.date, event.time)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <MapPinIcon size={14} className="text-brand shrink-0" />
          <span className="truncate">{event.location.address}</span>
        </div>

        {event.description && (
          <p className="text-xs text-text-tertiary mt-0.5">{event.description}</p>
        )}
      </div>
    </Card>
  );
}

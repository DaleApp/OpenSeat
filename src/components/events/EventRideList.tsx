"use client";

import { Ride } from "@/types";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import EmptyState from "@/components/ui/EmptyState";
import { ClockIcon, CarIcon } from "@/components/ui/icons";

const VIBE_LABELS: Record<string, string> = {
  music_lover: "🎵 Music lover",
  chatty: "💬 Chatty",
  chill: "😌 Chill",
  study_mode: "📚 Study mode",
  podcast_listener: "🎧 Podcast",
  sing_along: "🎤 Sing-along",
};

function formatTimeRange(start: string, end: string): string {
  const fmt = (iso: string) => {
    const timePart = iso.split("T")[1] ?? iso;
    const [h, m] = timePart.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

interface EventRideListProps {
  rides: Ride[];
  eventId: string;
}

export default function EventRideList({ rides, eventId }: EventRideListProps) {
  const router = useRouter();

  if (rides.length === 0) {
    return (
      <EmptyState
        title="No rides yet for this event"
        subtitle="Be the first to offer a ride to the community."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rides.map((ride) => (
        <div
          key={ride.id}
          role="button"
          tabIndex={0}
          onClick={() => router.push(`/ride/${ride.id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") router.push(`/ride/${ride.id}`);
          }}
          className="card cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
        >
          <div className="flex items-start gap-3">
            <Avatar src={ride.driverPhotoUrl} name={ride.driverName} size="md" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-text-primary text-sm truncate">
                  {ride.driverName}
                </span>
                <span className="flex items-center gap-0.5 text-xs text-amber-500 shrink-0 font-medium">
                  ★ {ride.driverRating.toFixed(1)}
                </span>
              </div>

              <p className="text-xs text-text-secondary">{ride.driverMajor}</p>

              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                <span className="flex items-center gap-1 text-xs text-text-secondary">
                  <ClockIcon size={12} className="text-brand" />
                  {formatTimeRange(ride.departureTimeStart, ride.departureTimeEnd)}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-secondary">
                  <CarIcon size={12} className="text-brand" />
                  {ride.availableSeats} seat{ride.availableSeats !== 1 ? "s" : ""} free
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {VIBE_LABELS[ride.driverVibe] && (
                  <Tag label={VIBE_LABELS[ride.driverVibe]} />
                )}
                <Tag
                  label={
                    ride.pickupFlexibility === "flexible"
                      ? `Flexible · ${ride.flexibleRadiusMi} mi`
                      : "Fixed point"
                  }
                  variant={ride.pickupFlexibility === "flexible" ? "success" : "default"}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

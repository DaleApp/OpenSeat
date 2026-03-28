"use client";

import { Ride } from "@/types";
import { useRouter } from "next/navigation";
import { formatTimeRange } from "@/lib/formatters";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import EmptyState from "@/components/ui/EmptyState";
import { ClockIcon, CarIcon } from "@/components/ui/icons";

// Plain-text vibe labels — must stay in sync with RideCard.tsx (Phase 3).
// No emoji prefix here; emoji decoration is a RideCard-level concern if added later.
const VIBE_LABELS: Record<string, string> = {
  music_lover: "Music lover",
  chatty: "Chatty",
  chill: "Chill",
  study_mode: "Study mode",
  podcast_listener: "Podcast listener",
  sing_along: "Sing-along",
};

interface EventRideListProps {
  rides: Ride[];
}

export default function EventRideList({ rides }: EventRideListProps) {
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
        <Card
          key={ride.id}
          onClick={() => router.push(`/ride/${ride.id}`)}
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
                {/* Label and variant must match RideCard.tsx exactly so both
                    components show identical pickup badges across the app. */}
                <Tag
                  label={ride.pickupFlexibility === "flexible" ? "Flexible" : "Fixed"}
                  variant={ride.pickupFlexibility === "flexible" ? "info" : "warning"}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

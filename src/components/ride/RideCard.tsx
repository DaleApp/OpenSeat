import { Ride, User } from "@/types";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import Card from "@/components/ui/Card";
import { StarIcon, MapPinIcon, ClockIcon, UserIcon } from "@/components/ui/icons";

const VIBE_LABELS: Record<string, string> = {
  music_lover: "Music lover",
  chatty: "Chatty",
  chill: "Chill",
  study_mode: "Study mode",
  podcast_listener: "Podcast listener",
  sing_along: "Sing-along",
};

function formatTimeRange(start: string, end: string): string {
  const fmt = (iso: string) => {
    const [, time] = iso.split("T");
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export function computeSocialHint(ride: Ride, currentUser?: User): string | null {
  if (!currentUser || currentUser.id === ride.driverId) return null;
  if (ride.driverMajor === currentUser.major) {
    return `You both study ${ride.driverMajor}`;
  }
  return null;
}

interface RideCardProps {
  ride: Ride;
  socialHint?: string;
  onClick?: () => void;
}

export default function RideCard({ ride, socialHint, onClick }: RideCardProps) {
  const vibeLabel = VIBE_LABELS[ride.driverVibe] ?? ride.driverVibe;
  const timeRange = formatTimeRange(ride.departureTimeStart, ride.departureTimeEnd);

  return (
    <Card onClick={onClick}>
      {/* Driver row */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={ride.driverPhotoUrl} name={ride.driverName} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary text-sm truncate">{ride.driverName}</p>
          <p className="text-text-secondary text-xs truncate">{ride.driverMajor}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <StarIcon size={14} className="text-warning" />
          <span className="text-sm font-medium text-text-primary">
            {ride.driverRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-start gap-2 mb-3">
        <MapPinIcon size={15} className="text-brand mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-secondary truncate">{ride.origin.address}</p>
          <div className="border-l-2 border-dashed border-border ml-[3px] h-3 my-0.5" />
          <p className="text-xs font-medium text-text-primary truncate">{ride.destination.address}</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-text-secondary text-xs">
          <ClockIcon size={13} />
          <span>{timeRange}</span>
        </div>
        <div className="flex items-center gap-1 text-text-secondary text-xs">
          <UserIcon size={13} />
          <span>{ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"}</span>
        </div>
        <Tag label={vibeLabel} />
      </div>

      {/* Social hint */}
      {socialHint && (
        <p className="mt-2 text-xs text-brand font-medium bg-brand-light px-2 py-1 rounded-lg">
          ✦ {socialHint}
        </p>
      )}
    </Card>
  );
}

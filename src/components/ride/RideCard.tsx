import { Ride } from "@/types";
import { formatTimeRange, VIBE_LABELS } from "@/lib/formatters";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import Card from "@/components/ui/Card";
import { StarIcon, MapPinIcon, ClockIcon, UserIcon } from "@/components/ui/icons";
import SocialHint from "@/components/social/SocialHint";

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
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-text-secondary text-xs">
          <ClockIcon size={13} />
          <span>{timeRange}</span>
        </div>
        <div className="flex items-center gap-1 text-text-secondary text-xs">
          <UserIcon size={13} />
          <span>{ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"}</span>
        </div>
        <Tag label={vibeLabel} />
        <Tag
          label={ride.pickupFlexibility === "flexible" ? "Flexible" : "Fixed"}
          variant={ride.pickupFlexibility === "flexible" ? "info" : "warning"}
        />
      </div>

      {/* Social hint */}
      {socialHint && (
        <div className="mt-2">
          <SocialHint hint={socialHint} />
        </div>
      )}
    </Card>
  );
}

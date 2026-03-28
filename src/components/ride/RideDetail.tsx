import { Ride } from "@/types";
import { formatTimeRange, VIBE_LABELS } from "@/lib/formatters";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import RideMap from "./RideMap";
import { StarIcon, ClockIcon, UserIcon, CarIcon } from "@/components/ui/icons";

interface RideDetailProps {
  ride: Ride;
  showCarDetails?: boolean;
  passengerLocation?: { address: string; lat: number; lng: number };
}

export default function RideDetail({ ride, showCarDetails = false, passengerLocation }: RideDetailProps) {
  const vibeLabel = VIBE_LABELS[ride.driverVibe] ?? ride.driverVibe;
  const timeRange = formatTimeRange(ride.departureTimeStart, ride.departureTimeEnd);

  return (
    <div className="flex flex-col gap-5">
      {/* Driver card */}
      <div className="flex items-center gap-3">
        <Avatar src={ride.driverPhotoUrl} name={ride.driverName} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-primary text-lg truncate">{ride.driverName}</p>
          <p className="text-text-secondary text-sm">{ride.driverMajor}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <StarIcon size={14} className="text-warning" />
            <span className="text-sm font-medium text-text-primary">
              {ride.driverRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Map */}
      <RideMap
        origin={ride.origin}
        destination={ride.destination}
        meetingPoint={ride.meetingPoint}
        passengerLocation={passengerLocation}
        pickupFlexibility={ride.pickupFlexibility}
        flexibleRadiusMi={ride.flexibleRadiusMi}
      />

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-secondary rounded-card p-3">
          <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
            <ClockIcon size={14} />
            <span>Time</span>
          </div>
          <p className="text-sm font-medium text-text-primary">{timeRange}</p>
        </div>
        <div className="bg-surface-secondary rounded-card p-3">
          <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
            <UserIcon size={14} />
            <span>Seats</span>
          </div>
          <p className="text-sm font-medium text-text-primary">
            {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"} left
          </p>
        </div>
        <div className="bg-surface-secondary rounded-card p-3">
          <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
            <CarIcon size={14} />
            <span>Car</span>
          </div>
          <p className="text-sm font-medium text-text-primary">
            {ride.driverCar.brand} {ride.driverCar.model}
          </p>
          {showCarDetails && (
            <p className="text-xs text-text-secondary mt-0.5">
              {ride.driverCar.color} · {ride.driverCar.licensePlate}
            </p>
          )}
        </div>
        <div className="bg-surface-secondary rounded-card p-3">
          <p className="text-text-secondary text-xs mb-1">Vibe</p>
          <Tag label={vibeLabel} />
        </div>
      </div>

      {/* Pickup model */}
      <div className="bg-surface-secondary rounded-card p-3">
        <p className="text-text-secondary text-xs mb-1">Pickup</p>
        <div className="flex items-center gap-2">
          <Tag
            label={ride.pickupFlexibility === "flexible" ? "Flexible" : "Fixed"}
            variant={ride.pickupFlexibility === "flexible" ? "info" : "warning"}
          />
          {ride.pickupFlexibility === "flexible" && ride.flexibleRadiusMi && (
            <span className="text-sm text-text-secondary">
              within {ride.flexibleRadiusMi} mi
            </span>
          )}
        </div>
      </div>

      {/* Event */}
      {ride.eventName && (
        <div className="bg-brand-light rounded-card p-3">
          <p className="text-xs text-brand-dark font-medium">Event</p>
          <p className="text-sm font-semibold text-brand-dark mt-0.5">{ride.eventName}</p>
        </div>
      )}

      {/* Note */}
      {ride.note && (
        <div>
          <p className="text-text-secondary text-xs mb-1">Note from driver</p>
          <p className="text-sm text-text-primary">{ride.note}</p>
        </div>
      )}
    </div>
  );
}

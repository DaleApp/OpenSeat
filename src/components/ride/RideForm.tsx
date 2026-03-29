"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createRide } from "@/lib/db";
import { GeoPoint } from "@/types/user";
import { getGoogleMapsLoader } from "@/lib/maps";
import AddressInput from "./AddressInput";
import RideMap from "./RideMap";
import VibeSelector from "./VibeSelector";
import SeatSelector from "./SeatSelector";
import PickupSelector from "./PickupSelector";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ClockIcon } from "@/components/ui/icons";

interface RideFormProps {
  defaultDestination?: string;
  defaultEventName?: string;
  defaultEventId?: string;
}

export default function RideForm({ defaultDestination, defaultEventName, defaultEventId }: RideFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [originAddress, setOriginAddress] = useState(user?.address?.address ?? "");
  const [originGeo, setOriginGeo] = useState<GeoPoint | undefined>(user?.address);
  const [destAddress, setDestAddress] = useState(defaultDestination ?? "");
  const [destGeo, setDestGeo] = useState<GeoPoint | undefined>(undefined);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState(2);
  const [vibe, setVibe] = useState(user?.vibe ?? "chill");
  const [pickupFlexibility, setPickupFlexibility] = useState<"fixed" | "flexible">("flexible");
  const [flexibleRadius, setFlexibleRadius] = useState(2);
  const [eventName, setEventName] = useState(defaultEventName ?? "");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Geocode pre-filled destination from URL params
  useEffect(() => {
    if (!defaultDestination || destGeo) return;
    const loader = getGoogleMapsLoader();
    if (!loader.apiKey) return;

    loader.importLibrary("geocoding").then(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: defaultDestination }, (results, status) => {
        if (status === "OK" && results && results[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          setDestGeo({
            address: defaultDestination,
            lat: loc.lat(),
            lng: loc.lng(),
          });
        }
      });
    });
  }, [defaultDestination, destGeo]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !user.car) return;
    if (!originGeo || !destGeo) {
      setError("Please enter valid origin and destination addresses.");
      return;
    }
    if (!date || !timeStart || !timeEnd) {
      setError("Please select a date and time range.");
      return;
    }
    if (timeEnd <= timeStart) {
      setError("Departure end time must be after start time.");
      return;
    }

    setError(null);
    setShowConfirm(true);
  }

  async function handleConfirm() {
    if (!user || !user.car || !originGeo || !destGeo) return;
    setShowConfirm(false);
    setLoading(true);

    try {
      const rideId = await createRide({
        driverId: user.id,
        driverName: user.name,
        driverPhotoUrl: user.photoUrl,
        driverMajor: user.major,
        driverRating: user.stats.averageRating,
        driverVibe: vibe,
        driverCar: user.car,
        origin: originGeo,
        destination: destGeo,
        departureTimeStart: `${date}T${timeStart}`,
        departureTimeEnd: `${date}T${timeEnd}`,
        totalSeats: seats,
        availableSeats: seats,
        pickupFlexibility,
        flexibleRadiusMi: pickupFlexibility === "flexible" ? flexibleRadius : undefined,
        eventId: defaultEventId,
        eventName: eventName || undefined,
        note: note || undefined,
        status: "active",
        passengers: [],
        ratings: [],
      });
      router.push(`/ride/${rideId}`);
    } catch {
      setError("Could not publish ride. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AddressInput
        label="Origin"
        placeholder="Where are you leaving from?"
        value={originAddress}
        onChange={(addr, geo) => {
          setOriginAddress(addr);
          if (geo) setOriginGeo(geo);
        }}
      />

      <AddressInput
        label="Destination"
        placeholder="Where are you going?"
        value={destAddress}
        onChange={(addr, geo) => {
          setDestAddress(addr);
          if (geo) setDestGeo(geo);
        }}
      />

      <RideMap
        origin={originGeo ?? { address: "", lat: 35.9132, lng: -79.0558 }}
        destination={destGeo ?? originGeo ?? { address: "", lat: 35.9049, lng: -79.0469 }}
        {...(originGeo && !destGeo ? { passengerLocation: undefined } : {})}
      />
      {(!originGeo || !destGeo) && (
        <p className="text-xs text-text-tertiary text-center -mt-3">
          Select origin and destination to see your route
        </p>
      )}

      <Input
        label="Date"
        type="date"
        min={today}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Depart from"
          type="time"
          value={timeStart}
          onChange={(e) => setTimeStart(e.target.value)}
          icon={<ClockIcon size={18} />}
          required
        />
        <Input
          label="Depart until"
          type="time"
          value={timeEnd}
          onChange={(e) => setTimeEnd(e.target.value)}
          icon={<ClockIcon size={18} />}
          required
        />
      </div>

      <SeatSelector value={seats} onChange={setSeats} />

      <VibeSelector value={vibe} onChange={setVibe} />

      <PickupSelector
        mode="driver"
        value={pickupFlexibility}
        radius={flexibleRadius}
        onChange={(val, r) => {
          setPickupFlexibility(val as "fixed" | "flexible");
          if (r !== undefined) setFlexibleRadius(r);
        }}
      />

      {defaultEventId ? (
        <div className="bg-brand-light rounded-card p-3">
          <p className="text-xs text-brand-dark font-medium">Event</p>
          <p className="text-sm font-semibold text-brand-dark mt-0.5">{eventName}</p>
        </div>
      ) : (
        <Input
          label="Event name (optional)"
          placeholder="e.g. UNC vs Duke Basketball"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      )}

      <Input
        label="Note (optional)"
        placeholder="e.g. Trunk space available, quiet ride"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-sm text-error">{error}</p>}

      <Button type="submit" loading={loading} className="w-full">
        Publish ride
      </Button>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-surface-primary rounded-card p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-text-primary mb-2">Publish this ride?</h3>
            <p className="text-sm text-text-secondary mb-6">
              Your ride will be visible to all members. They can request to join and you&apos;ll review each request.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

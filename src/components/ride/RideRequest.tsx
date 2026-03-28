"use client";

import { useState } from "react";
import { Ride } from "@/types";
import { User, GeoPoint } from "@/types/user";
import { requestRide } from "@/lib/db";
import { Timestamp } from "firebase/firestore";
import PickupSelector from "./PickupSelector";
import AddressInput from "./AddressInput";
import Button from "@/components/ui/Button";

interface RideRequestProps {
  ride: Ride;
  user: User;
  onSuccess: () => void;
  pickupAddress: string;
  onPickupAddressChange: (address: string, location?: GeoPoint) => void;
}

function isPickupCompatible(
  driverFlexibility: string,
  passengerPreference: string
): boolean {
  if (driverFlexibility === "flexible") return true;
  return passengerPreference === "i_go_to_you" || passengerPreference === "flexible";
}

export default function RideRequest({ ride, user, onSuccess, pickupAddress, onPickupAddressChange }: RideRequestProps) {
  const [pickupPreference, setPickupPreference] = useState("flexible");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compatible = isPickupCompatible(ride.pickupFlexibility, pickupPreference);

  async function handleRequest() {
    setLoading(true);
    setError(null);
    try {
      await requestRide(ride.id, {
        userId: user.id,
        userName: user.name,
        userPhotoUrl: user.photoUrl,
        userMajor: user.major,
        status: "pending",
        pickupPreference: pickupPreference as "pickup_me" | "i_go_to_you" | "flexible",
        requestedAt: Timestamp.now(),
      });
      onSuccess();
    } catch {
      setError("Could not send request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4">
      <h3 className="font-semibold text-text-primary">Request this ride</h3>

      <AddressInput
        label="Where are you?"
        placeholder="Enter your pickup address"
        value={pickupAddress}
        onChange={onPickupAddressChange}
      />

      <PickupSelector
        mode="passenger"
        value={pickupPreference}
        onChange={(val) => setPickupPreference(val)}
      />

      {!compatible && (
        <p className="text-sm text-error bg-red-50 p-3 rounded-lg">
          This driver uses a fixed pickup point. Select &quot;I&apos;ll go to you&quot; or &quot;Flexible&quot; to request this ride.
        </p>
      )}

      {error && <p className="text-sm text-error">{error}</p>}

      <Button
        onClick={handleRequest}
        loading={loading}
        disabled={!compatible || !pickupAddress}
        className="w-full"
      >
        Send request
      </Button>
    </div>
  );
}

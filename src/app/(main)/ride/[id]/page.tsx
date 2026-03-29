"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getRideById, respondToRequest, getUserById } from "@/lib/db";
import { computeSocialHint } from "@/lib/social";
import { Ride, User } from "@/types";
import { GeoPoint } from "@/types/user";
import RideDetail from "@/components/ride/RideDetail";
import PassengerList from "@/components/ride/PassengerList";
import RideRequest from "@/components/ride/RideRequest";
import SocialHint from "@/components/social/SocialHint";
import Button from "@/components/ui/Button";

export default function RideDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [driver, setDriver] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupLocation, setPickupLocation] = useState<GeoPoint | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const rideData = await getRideById(params.id);
        setRide(rideData);
        if (rideData) {
          const driverData = await getUserById(rideData.driverId);
          setDriver(driverData);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function handleRespond(userId: string, accept: boolean) {
    if (!ride) return;
    await respondToRequest(ride.id, userId, accept);
    const updated = await getRideById(ride.id);
    setRide(updated);
  }

  function handleRequestSuccess() {
    setRequested(true);
    getRideById(params.id).then(setRide);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-text-secondary">Could not load ride. Please try again.</p>
        <Button size="sm" className="mt-4" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-text-secondary">Ride not found</p>
        <Button size="sm" className="mt-4" onClick={() => router.push("/ride/search")}>
          Back to search
        </Button>
      </div>
    );
  }

  const isDriver = user?.id === ride.driverId;
  const alreadyRequested = ride.passengers.some((p) => p.userId === user?.id);
  const isAcceptedPassenger = ride.passengers.some((p) => p.userId === user?.id && p.status === "accepted");
  const showCarDetails = isDriver || isAcceptedPassenger;
  const canRequest = !isDriver && !alreadyRequested && !requested && ride.status === "active" && ride.availableSeats > 0;

  const socialHint =
    driver && user && !isDriver
      ? computeSocialHint(
          { id: driver.id, major: driver.major, interests: driver.interests, clubs: driver.clubs },
          user
        )
      : null;

  return (
    <div className="px-4 py-5 pb-8">
      <RideDetail
        ride={ride}
        showCarDetails={showCarDetails}
        passengerLocation={!isDriver && pickupAddress ? (pickupLocation ?? user?.address) : undefined}
      />

      {/* Social hint */}
      {socialHint && (
        <div className="mt-4">
          <SocialHint hint={socialHint} />
        </div>
      )}

      {/* Passengers section (visible to driver) */}
      {isDriver && ride.passengers.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-text-primary mb-3">
            Passengers ({ride.passengers.length})
          </h3>
          <PassengerList
            passengers={ride.passengers}
            isDriver={isDriver}
            onRespond={handleRespond}
          />
        </div>
      )}

      {/* Request section (visible to passengers) */}
      {canRequest && user && (
        <div className="mt-6">
          <RideRequest
            ride={ride}
            user={user}
            onSuccess={handleRequestSuccess}
            pickupAddress={pickupAddress}
            onPickupAddressChange={(address, location) => {
              setPickupAddress(address);
              if (location) setPickupLocation(location);
            }}
          />
        </div>
      )}

      {/* Already requested */}
      {(alreadyRequested || requested) && !isDriver && (
        <div className="mt-6 text-center p-4 bg-brand-light rounded-card">
          <p className="text-sm font-medium text-brand-dark">
            Request sent! The driver will review it soon.
          </p>
        </div>
      )}

      {/* Ride completed */}
      {ride.status === "completed" && (
        <div className="mt-6">
          <Button
            href={`/ride/${ride.id}/rate`}
            className="w-full"
          >
            Rate this ride
          </Button>
        </div>
      )}
    </div>
  );
}

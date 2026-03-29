"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import RideForm from "@/components/ride/RideForm";
import Button from "@/components/ui/Button";
import { CarIcon } from "@/components/ui/icons";

export default function PublishRidePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const destination = searchParams.get("destination") ?? undefined;
  const eventName = searchParams.get("eventName") ?? undefined;
  const eventId = searchParams.get("eventId") ?? undefined;

  if (!user?.car) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <CarIcon size={28} className="text-text-tertiary" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Add your car first</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-xs mx-auto">
          You need to add your car details before publishing a ride.
        </p>
        <Button href="/profile" size="sm">
          Go to profile
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 pb-8">
      <h1 className="text-xl font-bold text-text-primary mb-4">Publish a ride</h1>
      <RideForm
        defaultDestination={destination}
        defaultEventName={eventName}
        defaultEventId={eventId}
      />
    </div>
  );
}

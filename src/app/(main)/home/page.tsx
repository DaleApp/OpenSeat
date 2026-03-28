"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getRides, getEvents, getUserRides, getUserById } from "@/lib/db";
import { computeSocialHint } from "@/lib/social";
import { Ride, CommunityEvent, User } from "@/types";
import RideCard from "@/components/ride/RideCard";
import EventCard from "@/components/events/EventCard";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const first = name.split(" ")[0];
  if (hour < 12) return `Good morning, ${first}`;
  if (hour < 18) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [nearbyRides, setNearbyRides] = useState<Ride[]>([]);
  const [driverMap, setDriverMap] = useState<Map<string, User>>(new Map());
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const currentUser = user;

    // Clear stale state from any previous session or attempt
    setError(null);
    setLoading(true);

    async function load() {
      try {
        const [allRides, myRidesData, eventsData] = await Promise.all([
          getRides({}),
          getUserRides(currentUser.id),
          getEvents(),
        ]);

        const nearby = allRides
          .filter((r) => r.driverId !== currentUser.id)
          .slice(0, 5);

        // Fetch full driver User objects for social hints
        const uniqueDriverIds = Array.from(new Set(nearby.map((r) => r.driverId)));
        const driverUsers = await Promise.all(
          uniqueDriverIds.map((id) => getUserById(id))
        );
        const map = new Map<string, User>();
        uniqueDriverIds.forEach((id, i) => {
          const u = driverUsers[i];
          if (u) map.set(id, u);
        });

        setMyRides(myRidesData.slice(0, 3));
        setNearbyRides(nearby);
        setDriverMap(map);
        setEvents(eventsData.slice(0, 2));
      } catch {
        setError("Could not load rides. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, retryCount]);

  return (
    <div className="px-4 py-5 pb-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {user ? getGreeting(user.name) : "Welcome back"}
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Where are you headed today?
        </p>
      </div>

      {/* Primary CTAs */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Button onClick={() => router.push("/ride/new")} className="w-full">
          Offer ride
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push("/ride/search")}
          className="w-full"
        >
          Find ride
        </Button>
      </div>

      {/* Your rides */}
      {myRides.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-text-primary mb-3">
            Your rides
          </h2>
          <div className="flex flex-col gap-3">
            {myRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onClick={() => router.push(`/ride/${ride.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Nearby rides */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-text-primary mb-3">
          Nearby rides
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <p className="text-sm text-text-secondary text-center">{error}</p>
            <Button size="sm" variant="secondary" onClick={() => setRetryCount((c) => c + 1)}>
              Try again
            </Button>
          </div>
        ) : nearbyRides.length > 0 ? (
          <div className="flex flex-col gap-3">
            {nearbyRides.map((ride) => {
              const driver = driverMap.get(ride.driverId);
              const hint =
                driver && user
                  ? computeSocialHint(
                      { id: driver.id, major: driver.major, interests: driver.interests, clubs: driver.clubs },
                      user
                    )
                  : undefined;
              return (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  socialHint={hint ?? undefined}
                  onClick={() => router.push(`/ride/${ride.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No rides nearby"
            subtitle="Be the first to offer a ride in your community"
            actionLabel="Offer a ride"
            onAction={() => router.push("/ride/new")}
          />
        )}
      </section>

      {/* Upcoming events */}
      {events.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-primary">
              Upcoming events
            </h2>
            <button
              onClick={() => router.push("/events")}
              className="text-brand text-sm font-medium"
            >
              See all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => router.push(`/events/${event.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

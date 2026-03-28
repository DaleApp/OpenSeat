"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getRides, getEvents } from "@/lib/db";
import { Ride, CommunityEvent } from "@/types";
import RideCard, { computeSocialHint } from "@/components/ride/RideCard";
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
  const [rides, setRides] = useState<Ride[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [ridesData, eventsData] = await Promise.all([
        getRides({}),
        getEvents(),
      ]);
      setRides(
        ridesData
          .filter((r) => r.driverId !== user?.id)
          .slice(0, 5)
      );
      setEvents(eventsData.slice(0, 2));
      setLoading(false);
    }
    load();
  }, [user?.id]);

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

      {/* Upcoming rides */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-text-primary mb-3">
          Upcoming rides
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rides.length > 0 ? (
          <div className="flex flex-col gap-3">
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                socialHint={computeSocialHint(ride, user ?? undefined)}
                onClick={() => router.push(`/ride/${ride.id}`)}
              />
            ))}
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

"use client";

/**
 * EventsPage — /events — Phase 4 (feat/events)
 *
 * Lists all upcoming community events sorted by nearest date.
 * Each EventCard navigates to /events/[id] on tap.
 *
 * Why "use client":
 *   EventCard receives an onClick prop for navigation (router.push).
 *   Since function props can't be passed from server to client components
 *   in Next.js 14, this page is a client component that fetches data on
 *   mount and handles navigation itself — matching the same pattern used
 *   by home/page.tsx (Phase 3, feat/home-page).
 *
 * Data source:
 *   getEvents() from lib/db.ts → returns MOCK_EVENTS (hackathon).
 *   Post-hackathon: replace with a real-time Firestore listener (onSnapshot)
 *   or a server component + client EventList sub-component.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEvents } from "@/lib/db";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";
import { CommunityEvent } from "@/types";

export default function EventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const router = useRouter();

  useEffect(() => {
    getEvents().then((data) => {
      // Sort ascending so the nearest upcoming event appears first
      const sorted = [...data].sort((a, b) => {
        const da = new Date(`${a.date}T${a.time}`).getTime();
        const db = new Date(`${b.date}T${b.time}`).getTime();
        return da - db;
      });
      setEvents(sorted);
    });
  }, []);

  return (
    <div className="px-4 py-5">
      <h2 className="text-xl font-semibold text-text-primary mb-1">
        Community Events
      </h2>
      <p className="text-sm text-text-secondary mb-4">
        Find rides to upcoming UNC events
      </p>

      {events.length === 0 ? (
        <EmptyState
          title="No upcoming events"
          subtitle="Check back soon for community events."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => router.push(`/events/${event.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

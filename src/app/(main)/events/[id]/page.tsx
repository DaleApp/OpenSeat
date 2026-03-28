import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById, getRidesForEvent, getUsersByIds } from "@/lib/db";
import { formatEventDateTime } from "@/lib/formatters";
import EventRideList from "@/components/events/EventRideList";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { CalendarIcon, MapPinIcon, UserIcon } from "@/components/ui/icons";

/**
 * EventDetailPage — /events/[id] — Phase 4 (feat/events)
 *
 * Shows full details for a single community event:
 *   - Name, formatted date/time, location, optional description
 *   - Stacked avatars of up to 5 interested members (batch-fetched via getUsersByIds)
 *   - EventRideList: rides linked to this event via ride.eventId
 *   - "Publish a ride for this event" CTA — pre-fills /ride/new via URL params:
 *       destination, eventName, eventId
 *     Phase 7 (RideForm / ride/new/page.tsx) reads these params to pre-fill the form.
 *
 * Server Component — data is fetched at render time (no useEffect needed).
 * EventRideList is a client component that handles its own tap navigation.
 *
 * params type:
 *   Next.js 14 — params is a plain { id: string } object (NOT a Promise).
 *   Next.js 15 changed this to Promise<{ id: string }> — do NOT upgrade yet.
 *
 * N+1 fix:
 *   Interested users are fetched in one batch with getUsersByIds()
 *   instead of calling getUserById() per user in a loop.
 *   Post-hackathon: Firestore equivalent is where('__name__', 'in', ids).
 *
 * Active rides filter:
 *   Only rides with status "active" or "full" are shown.
 *   "full" rides are still shown so passengers can see demand and add to waitlist
 *   (waitlist is a post-hackathon feature — for now they just see the ride).
 */

interface PageProps {
  // Next.js 14: params is a plain object, not a Promise
  params: { id: string };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = params;

  const [event, rides] = await Promise.all([
    getEventById(id),
    getRidesForEvent(id),
  ]);

  if (!event) notFound();

  // Batch-fetch up to 5 interested users to display their avatars
  const interestedUsers = await getUsersByIds(
    event.interestedUsers.slice(0, 5)
  );

  // Filter to rides that passengers can still act on
  const activeRides = rides.filter(
    (r) => r.status === "active" || r.status === "full"
  );

  // Build the pre-fill URL for /ride/new (Phase 7 reads these query params)
  const publishHref =
    `/ride/new` +
    `?destination=${encodeURIComponent(event.location.address)}` +
    `&eventName=${encodeURIComponent(event.name)}` +
    `&eventId=${event.id}`;

  return (
    <div className="pb-6">
      {/* Back to events list */}
      <div className="px-4 pt-4 mb-2">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-brand font-medium hover:underline"
        >
          ← Events
        </Link>
      </div>

      {/* Event header */}
      <div className="px-4 pb-4 border-b border-border">
        <h1 className="text-xl font-semibold text-text-primary leading-snug mb-3">
          {event.name}
        </h1>

        <div className="flex flex-col gap-2 mb-3">
          {/* formatEventDateTime from lib/formatters → "Friday, April 10 · 7:00 PM" */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CalendarIcon size={16} className="text-brand shrink-0" />
            <span>{formatEventDateTime(event.date, event.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPinIcon size={16} className="text-brand shrink-0" />
            <span>{event.location.address}</span>
          </div>
        </div>

        {event.description && (
          <p className="text-sm text-text-secondary mb-3">{event.description}</p>
        )}

        {/* Interested members — stacked avatars + total count */}
        {interestedUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {interestedUsers.map((u) => (
                <Avatar key={u.id} src={u.photoUrl} name={u.name} size="sm" />
              ))}
            </div>
            <span className="text-xs text-text-secondary flex items-center gap-1">
              <UserIcon size={12} className="text-brand" />
              {event.interestedUsers.length} member
              {event.interestedUsers.length !== 1 ? "s" : ""} interested
            </span>
          </div>
        )}
      </div>

      {/* Available rides section */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-text-primary">
            Available Rides
          </h2>
          {activeRides.length > 0 && (
            <span className="text-xs text-text-secondary">
              {activeRides.length} ride{activeRides.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* EventRideList is a client component — handles tap → /ride/[id] */}
        <EventRideList rides={activeRides} />

        {/* Publish CTA — destination and eventName pre-fill the ride form (Phase 7) */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-text-secondary mb-3 text-center">
            Going to this event? Offer a ride!
          </p>
          <Button href={publishHref} className="w-full">
            Publish a ride for this event
          </Button>
        </div>
      </div>
    </div>
  );
}

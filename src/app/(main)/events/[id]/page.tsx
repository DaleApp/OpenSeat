import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById, getRidesForEvent, getUserById } from "@/lib/db";
import EventRideList from "@/components/events/EventRideList";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { CalendarIcon, MapPinIcon, UserIcon } from "@/components/ui/icons";
import { User } from "@/types";

function formatEventDateTime(date: string, time: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dayOfWeek = d.toLocaleString("en-US", { weekday: "long" });
  const monthName = d.toLocaleString("en-US", { month: "long" });
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, "0");
  return `${dayOfWeek}, ${monthName} ${day} · ${h}:${m} ${ampm}`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [event, rides] = await Promise.all([
    getEventById(id),
    getRidesForEvent(id),
  ]);

  if (!event) notFound();

  // Fetch up to 5 interested users to show avatars
  const interestedUsers: User[] = (
    await Promise.all(
      event.interestedUsers.slice(0, 5).map((uid) => getUserById(uid))
    )
  ).filter((u): u is User => u !== null);

  const publishHref = `/ride/new?destination=${encodeURIComponent(
    event.location.address
  )}&eventName=${encodeURIComponent(event.name)}&eventId=${event.id}`;

  const activeRides = rides.filter(
    (r) => r.status === "active" || r.status === "full"
  );

  return (
    <div className="pb-6">
      {/* Back link */}
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

        {/* Interested users */}
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

      {/* Rides section */}
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

        <EventRideList rides={activeRides} eventId={event.id} />

        {/* Publish CTA */}
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

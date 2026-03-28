import { getEvents } from "@/lib/db";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";

export default async function EventsPage() {
  const events = await getEvents();

  // Sort by date ascending so nearest events appear first
  const sorted = [...events].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time}`).getTime();
    const db = new Date(`${b.date}T${b.time}`).getTime();
    return da - db;
  });

  return (
    <div className="px-4 py-5">
      <h2 className="text-xl font-semibold text-text-primary mb-1">Community Events</h2>
      <p className="text-sm text-text-secondary mb-4">
        Find rides to upcoming UNC events
      </p>

      {sorted.length === 0 ? (
        <EmptyState
          title="No upcoming events"
          subtitle="Check back soon for community events."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * EventCard — Phase 4 (feat/events)
 *
 * Reusable summary card for a CommunityEvent.
 *
 * API contract (must stay stable — Phase 3 home page depends on it):
 *   <EventCard event={event} onClick={() => router.push(`/events/${event.id}`)} />
 *
 * The parent is always responsible for navigation (onClick prop).
 * This component never imports useRouter — it stays a pure presentational
 * component so it can be rendered inside both server and client parents.
 *
 * Used in:
 *   1. /events page (Phase 4) — full event list, each card navigates to /events/[id]
 *   2. /home page (Phase 3, feat/home-page) — "Upcoming Events" section, same navigation
 *
 * Data shown:
 *   - Event name
 *   - Formatted date + time  via formatDate() + formatTime() from lib/formatters
 *   - Location address (truncated)
 *   - "X going" badge (count of event.interestedUsers[])
 *   - Optional short description
 *
 * Future / post-hackathon:
 *   - Add event.imageUrl as a banner thumbnail
 *   - Add "Mark as interested" toggle (currently count is read-only)
 *   - Consider a denormalized interestedCount field on the Firestore doc
 *     to avoid reading the full interestedUsers[] array just for the badge
 */

import { CommunityEvent } from "@/types";
import { formatDate, formatTime } from "@/lib/formatters";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import { CalendarIcon, MapPinIcon } from "@/components/ui/icons";

interface EventCardProps {
  event: CommunityEvent;
  /** Navigation handler provided by the parent. */
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card onClick={onClick}>
      <div className="flex flex-col gap-2">
        {/* Title row + interested count badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text-primary text-base leading-snug">
            {event.name}
          </h3>
          {/* interestedUsers is an array of user IDs in Firestore.
              Post-hackathon: use a denormalized count field instead. */}
          <Tag
            label={`${event.interestedUsers.length} going`}
            variant="success"
            className="shrink-0"
          />
        </div>

        {/* Date + time — uses formatDate (e.g. "Fri, Apr 10") + formatTime (e.g. "7:00 PM") */}
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <CalendarIcon size={14} className="text-brand shrink-0" />
          <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
        </div>

        {/* Location — uses event.location.address (GeoPoint.address from schema) */}
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <MapPinIcon size={14} className="text-brand shrink-0" />
          <span className="truncate">{event.location.address}</span>
        </div>

        {event.description && (
          <p className="text-xs text-text-tertiary mt-0.5">{event.description}</p>
        )}
      </div>
    </Card>
  );
}

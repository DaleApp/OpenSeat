import { CommunityEvent } from "@/types";
import Card from "@/components/ui/Card";
import { CalendarIcon, MapPinIcon, UserIcon } from "@/components/ui/icons";

function formatDate(dateStr: string): string {
  // Parse as local date to avoid UTC offset shifting the day
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

interface EventCardProps {
  event: CommunityEvent;
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card onClick={onClick}>
      <h3 className="font-semibold text-text-primary text-sm mb-2 truncate">
        {event.name}
      </h3>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <CalendarIcon size={13} className="shrink-0" />
          <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <MapPinIcon size={13} className="shrink-0" />
          <span className="truncate">{event.location.address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <UserIcon size={13} className="shrink-0" />
          <span>{event.interestedUsers.length} interested</span>
        </div>
      </div>
    </Card>
  );
}

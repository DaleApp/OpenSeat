import { CommunityEvent } from "@/types";
import { formatDate, formatTime } from "@/lib/formatters";
import Card from "@/components/ui/Card";
import { CalendarIcon, MapPinIcon, UserIcon } from "@/components/ui/icons";

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

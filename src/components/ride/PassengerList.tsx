"use client";

import { RidePassenger } from "@/types/ride";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";

interface PassengerListProps {
  passengers: RidePassenger[];
  isDriver: boolean;
  onRespond?: (userId: string, accept: boolean) => void;
}

export default function PassengerList({ passengers, isDriver, onRespond }: PassengerListProps) {
  if (passengers.length === 0) {
    return (
      <p className="text-sm text-text-secondary text-center py-4">
        No passengers yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {passengers.map((p) => (
        <div key={p.userId} className="flex items-center gap-3 p-3 bg-surface-secondary rounded-card">
          <Avatar src={p.userPhotoUrl} name={p.userName} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{p.userName}</p>
            <p className="text-xs text-text-secondary">{p.userMajor}</p>
          </div>

          {p.status === "pending" && isDriver && onRespond ? (
            <div className="flex gap-2 shrink-0">
              <Button size="sm" onClick={() => onRespond(p.userId, true)}>
                Accept
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onRespond(p.userId, false)}>
                Reject
              </Button>
            </div>
          ) : (
            <Tag
              label={p.status.charAt(0).toUpperCase() + p.status.slice(1)}
              variant={
                p.status === "accepted" ? "success" :
                p.status === "rejected" ? "danger" : "warning"
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

import { User } from "@/types/user";
import Avatar from "@/components/ui/Avatar";

interface ConnectionCardProps {
  user: User;
  onClick?: () => void;
}

export default function ConnectionCard({ user, onClick }: ConnectionCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={`flex items-center gap-3 p-3 bg-surface-secondary rounded-card ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    >
      <Avatar src={user.photoUrl} name={user.name} size="md" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
        <p className="text-xs text-text-secondary">{user.major}</p>
      </div>
    </div>
  );
}

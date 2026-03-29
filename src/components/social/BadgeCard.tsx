import { LockIcon } from "@/components/ui/icons";

interface BadgeCardProps {
  badge: { id: string; name: string; description: string; icon: string };
  unlocked: boolean;
}

export default function BadgeCard({ badge, unlocked }: BadgeCardProps) {
  return (
    <div className={`relative rounded-card p-3 text-center ${unlocked ? "bg-surface-secondary" : "bg-surface-secondary/50 opacity-50"}`}>
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <LockIcon size={12} className="text-text-tertiary" />
        </div>
      )}
      <div className="text-2xl mb-1">{badge.icon}</div>
      <p className="text-xs font-semibold text-text-primary">{badge.name}</p>
      <p className="text-[10px] text-text-secondary mt-0.5">{badge.description}</p>
    </div>
  );
}

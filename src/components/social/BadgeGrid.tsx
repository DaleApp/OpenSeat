import { Badge } from "@/types/user";
import BadgeCard from "./BadgeCard";

const ALL_BADGES = [
  { id: "icebreaker", name: "Icebreaker", description: "First ride with someone new", icon: "🧊" },
  { id: "eco-hero", name: "Eco Hero", description: "Saved more than 50 kg CO2", icon: "🌱" },
  { id: "punctual", name: "Punctual", description: "Always on time", icon: "⏰" },
  { id: "explorer", name: "Explorer", description: "Rode with 5 different majors", icon: "🧭" },
  { id: "social-butterfly", name: "Social Butterfly", description: "Connected with 10 people", icon: "🦋" },
  { id: "road-warrior", name: "Road Warrior", description: "Completed 25 rides", icon: "🛣️" },
  { id: "five-star", name: "Five Star", description: "Maintained 5.0 average rating", icon: "⭐" },
  { id: "good-vibes", name: "Good Vibes", description: "Average good vibes above 4.5", icon: "✨" },
];

interface BadgeGridProps {
  unlockedBadges: Badge[];
}

export default function BadgeGrid({ unlockedBadges }: BadgeGridProps) {
  const unlockedIds = new Set(unlockedBadges.map((b) => b.id));

  return (
    <div className="grid grid-cols-4 gap-2">
      {ALL_BADGES.map((badge) => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          unlocked={unlockedIds.has(badge.id)}
        />
      ))}
    </div>
  );
}

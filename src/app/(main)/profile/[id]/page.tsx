"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "@/lib/db";
import { User } from "@/types/user";
import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import StatsCard from "@/components/social/StatsCard";
import BadgeGrid from "@/components/social/BadgeGrid";
import ConnectionsList from "@/components/social/ConnectionsList";
import { VIBE_LABELS } from "@/lib/formatters";
import { StarIcon } from "@/components/ui/icons";

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(params.id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-text-secondary">User not found</p>
      </div>
    );
  }

  const vibeLabel = user.vibe ? VIBE_LABELS[user.vibe] ?? user.vibe : null;

  return (
    <div className="px-4 py-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar src={user.photoUrl} name={user.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-text-primary truncate">{user.name}</h1>
          <p className="text-sm text-text-secondary">{user.major}</p>
          <div className="flex items-center gap-2 mt-1">
            {user.stats.totalRatings > 0 && (
              <div className="flex items-center gap-1">
                <StarIcon size={14} className="text-warning" />
                <span className="text-sm font-medium text-text-primary">
                  {user.stats.averageRating.toFixed(1)}
                </span>
              </div>
            )}
            {vibeLabel && <Tag label={vibeLabel} />}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatsCard label="Rides" value={user.stats.totalRides} />
        <StatsCard label="Connected" value={user.stats.peopleConnected} />
        <StatsCard label="Miles" value={Math.round(user.stats.totalKm * 0.621)} />
      </div>

      {/* Interests & Clubs */}
      {(user.interests.length > 0 || user.clubs.length > 0) && (
        <div className="mb-6">
          {user.interests.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-text-secondary mb-1.5">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((i) => (
                  <Tag key={i} label={i} />
                ))}
              </div>
            </div>
          )}
          {user.clubs.length > 0 && (
            <div>
              <p className="text-xs text-text-secondary mb-1.5">Clubs</p>
              <div className="flex flex-wrap gap-1.5">
                {user.clubs.map((c) => (
                  <Tag key={c} label={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-text-primary mb-3">Badges</h3>
        <BadgeGrid unlockedBadges={user.badges} />
      </div>

      {/* Connections */}
      <ConnectionsList userId={user.id} />
    </div>
  );
}

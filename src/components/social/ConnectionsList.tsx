"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getConnections } from "@/lib/db";
import { User } from "@/types/user";
import ConnectionCard from "./ConnectionCard";

interface ConnectionsListProps {
  userId: string;
}

export default function ConnectionsList({ userId }: ConnectionsListProps) {
  const [connections, setConnections] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    getConnections(userId).then(setConnections);
  }, [userId]);

  if (connections.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-text-primary mb-3">
        Connections ({connections.length})
      </h3>
      <div className="flex flex-col gap-2">
        {connections.map((c) => (
          <ConnectionCard
            key={c.id}
            user={c}
            onClick={() => router.push(`/profile/${c.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

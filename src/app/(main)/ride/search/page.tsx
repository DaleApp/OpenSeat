"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getRides, getUsersByIds } from "@/lib/db";
import { computeSocialHint } from "@/lib/social";
import { Ride, RideFilters, User } from "@/types";
import SearchFilters from "@/components/ride/SearchFilters";
import RideCard from "@/components/ride/RideCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { SearchIcon } from "@/components/ui/icons";
import { distanceMi } from "@/lib/maps";

export default function RideSearchPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filters, setFilters] = useState<RideFilters>({});
  const [rides, setRides] = useState<Ride[]>([]);
  const [driverMap, setDriverMap] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    setError(null);
    try {
      const results = await getRides(filters);
      // Exclude own rides
      const filtered = user
        ? results.filter((r) => r.driverId !== user.id)
        : results;

      // Sort by proximity to user's address
      if (user?.address) {
        const userAddr = user.address;
        filtered.sort(
          (a, b) => distanceMi(a.origin, userAddr) - distanceMi(b.origin, userAddr)
        );
      }

      const driverIds = Array.from(new Set(filtered.map((r) => r.driverId)));
      const drivers = await getUsersByIds(driverIds);
      setDriverMap(new Map(drivers.map((u) => [u.id, u])));
      setRides(filtered);
    } catch {
      setError("Could not load rides. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  // Search on mount and when demo user switches
  useEffect(() => {
    search();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="px-4 py-5 pb-8">
      <h1 className="text-xl font-bold text-text-primary mb-4">Find a ride</h1>

      <SearchFilters filters={filters} onChange={setFilters} />

      <Button onClick={search} loading={loading} className="w-full mt-4">
        <SearchIcon size={18} />
        Search
      </Button>

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <p className="text-sm text-text-secondary text-center">{error}</p>
            <Button size="sm" variant="secondary" onClick={search}>
              Try again
            </Button>
          </div>
        ) : rides.length > 0 ? (
          <>
            <p className="text-sm text-text-secondary mb-3">
              {rides.length} {rides.length === 1 ? "ride" : "rides"} found
            </p>
            <div className="flex flex-col gap-3">
              {rides.map((ride) => {
                const driver = driverMap.get(ride.driverId);
                const hint =
                  driver && user
                    ? computeSocialHint(
                        {
                          id: driver.id,
                          major: driver.major,
                          interests: driver.interests,
                          clubs: driver.clubs,
                        },
                        user
                      )
                    : undefined;
                return (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    socialHint={hint ?? undefined}
                    onClick={() => router.push(`/ride/${ride.id}`)}
                  />
                );
              })}
            </div>
          </>
        ) : searched ? (
          <EmptyState
            title="No rides found"
            subtitle="Try adjusting your filters or offer a ride yourself"
            actionLabel="Offer a ride"
            actionHref="/ride/new"
          />
        ) : null}
      </div>
    </div>
  );
}

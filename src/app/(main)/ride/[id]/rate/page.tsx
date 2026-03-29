"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getRideById, addRating } from "@/lib/db";
import { Ride } from "@/types";
import { Timestamp } from "firebase/firestore";
import RatingForm from "@/components/social/RatingForm";
import Button from "@/components/ui/Button";

export default function RateRidePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getRideById(params.id)
      .then(setRide)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ride || !user) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-text-secondary">Ride not found</p>
      </div>
    );
  }

  // Find the other person in the ride
  const isDriver = user.id === ride.driverId;
  const otherName = isDriver
    ? ride.passengers.find((p) => p.status === "accepted")?.userName ?? "Rider"
    : ride.driverName;
  const otherUserId = isDriver
    ? ride.passengers.find((p) => p.status === "accepted")?.userId ?? ""
    : ride.driverId;

  async function handleSubmit(data: { stars: number; goodVibes: number; wantsToConnect: boolean }) {
    if (!user || !ride) return;
    setSubmitting(true);

    await addRating(ride.id, {
      fromUserId: user.id,
      toUserId: otherUserId,
      stars: data.stars,
      goodVibes: data.goodVibes,
      wantsToConnect: data.wantsToConnect,
      createdAt: Timestamp.now(),
    });

    // Check if Icebreaker badge should unlock (first ride with someone new)
    const hasIcebreaker = user.badges.some((b) => b.id === "icebreaker");
    if (!hasIcebreaker) {
      setShowBadge(true);
      setTimeout(() => {
        setShowBadge(false);
        setDone(true);
      }, 3000);
    } else {
      setDone(true);
    }

    setSubmitting(false);
  }

  // Badge unlock animation
  if (showBadge) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1D1A] px-6">
        <div className="animate-bounce text-7xl mb-6">🧊</div>
        <h2 className="text-2xl font-bold text-white mb-2">Badge Unlocked!</h2>
        <p className="text-brand text-lg font-semibold">Icebreaker</p>
        <p className="text-gray-400 text-sm mt-2">First ride with someone new</p>
      </div>
    );
  }

  // Done screen
  if (done) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Thanks for rating!</h2>
        <p className="text-sm text-text-secondary mb-6">
          Your feedback helps build a better community.
        </p>
        <Button onClick={() => router.push("/home")} className="w-full">
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 pb-8">
      <h1 className="text-xl font-bold text-text-primary mb-1">Rate your ride</h1>
      <p className="text-sm text-text-secondary mb-6">
        How was your ride with {otherName}?
      </p>
      <RatingForm
        otherUserName={otherName}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  );
}

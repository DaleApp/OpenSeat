"use client";

import { useState } from "react";
import GoodVibesSlider from "./GoodVibesSlider";
import Button from "@/components/ui/Button";
import { StarIcon } from "@/components/ui/icons";

interface RatingFormProps {
  otherUserName: string;
  onSubmit: (data: { stars: number; goodVibes: number; wantsToConnect: boolean }) => void;
  loading?: boolean;
}

export default function RatingForm({ otherUserName, onSubmit, loading }: RatingFormProps) {
  const [stars, setStars] = useState(0);
  const [goodVibes, setGoodVibes] = useState(0);
  const [wantsToConnect, setWantsToConnect] = useState(false);

  const firstName = otherUserName.split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Star rating */}
      <div>
        <p className="text-sm font-medium text-text-primary mb-2">Rate your ride</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setStars(n)}>
              <StarIcon
                size={32}
                className={n <= stars ? "text-warning" : "text-border"}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Good vibes */}
      <GoodVibesSlider value={goodVibes} onChange={setGoodVibes} />

      {/* Connect toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          className={`w-12 h-7 rounded-full transition-colors relative ${
            wantsToConnect ? "bg-brand" : "bg-border"
          }`}
          onClick={() => setWantsToConnect(!wantsToConnect)}
        >
          <div
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
              wantsToConnect ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
        <span className="text-sm text-text-primary">Connect with {firstName}?</span>
      </label>

      <Button
        onClick={() => onSubmit({ stars, goodVibes, wantsToConnect })}
        loading={loading}
        disabled={stars === 0 || goodVibes === 0}
        className="w-full"
      >
        Submit rating
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useCallback } from "react";
import { GeoPoint } from "@/types/user";
import { getGoogleMapsLoader } from "@/lib/maps";
import { MapPinIcon } from "@/components/ui/icons";

interface AddressInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (address: string, location?: GeoPoint) => void;
}

export default function AddressInput({ label, placeholder, value, onChange }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Initialize autocomplete once
  useEffect(() => {
    if (autocompleteRef.current) return;

    const loader = getGoogleMapsLoader();
    if (!loader.apiKey) return;

    loader
      .importLibrary("places")
      .then(() => {
        if (!inputRef.current || autocompleteRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["formatted_address", "geometry"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address && place.geometry?.location) {
            onChangeRef.current(place.formatted_address, {
              address: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        });

        autocompleteRef.current = autocomplete;
      })
      .catch(() => {});
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeRef.current(e.target.value);
  }, []);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
          <MapPinIcon size={18} />
        </span>
        <input
          ref={inputRef}
          type="text"
          className="input pl-10"
          placeholder={placeholder ?? "Enter address"}
          value={value}
          onChange={handleInput}
        />
      </div>
    </div>
  );
}

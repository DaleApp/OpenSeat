"use client";

import { useEffect, useRef, useState } from "react";
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
  const [placesAvailable, setPlacesAvailable] = useState(false);

  useEffect(() => {
    const loader = getGoogleMapsLoader();
    if (!loader.apiKey) return;

    loader
      .importLibrary("places")
      .then(() => {
        if (!inputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["formatted_address", "geometry"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address && place.geometry?.location) {
            onChange(place.formatted_address, {
              address: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        });

        autocompleteRef.current = autocomplete;
        setPlacesAvailable(true);
      })
      .catch(() => {
        // Places API not available, fallback to plain text input
      });
  }, [onChange]);

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
          value={placesAvailable ? undefined : value}
          defaultValue={placesAvailable ? value : undefined}
          onChange={placesAvailable ? undefined : (e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

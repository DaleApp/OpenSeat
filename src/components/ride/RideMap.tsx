"use client";

import { useEffect, useRef, useState } from "react";
import { GeoPoint } from "@/types/user";
import { getGoogleMapsLoader, distanceMi } from "@/lib/maps";

interface RideMapProps {
  origin: GeoPoint;
  destination: GeoPoint;
  meetingPoint?: GeoPoint;
  passengerLocation?: GeoPoint;
  pickupFlexibility?: "fixed" | "flexible";
  flexibleRadiusMi?: number;
}

function createPin(color: string, label: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";

  const dot = document.createElement("div");
  dot.style.width = "14px";
  dot.style.height = "14px";
  dot.style.borderRadius = "50%";
  dot.style.backgroundColor = color;
  dot.style.border = "3px solid white";
  dot.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

  const tag = document.createElement("div");
  tag.textContent = label;
  tag.style.marginTop = "4px";
  tag.style.padding = "2px 6px";
  tag.style.borderRadius = "4px";
  tag.style.backgroundColor = "white";
  tag.style.color = "#1E293B";
  tag.style.fontSize = "10px";
  tag.style.fontWeight = "600";
  tag.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
  tag.style.whiteSpace = "nowrap";

  wrapper.appendChild(dot);
  wrapper.appendChild(tag);
  return wrapper;
}


export default function RideMap({
  origin,
  destination,
  meetingPoint,
  passengerLocation,
  pickupFlexibility,
  flexibleRadiusMi,
}: RideMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = getGoogleMapsLoader();
    if (!loader.apiKey) {
      setError(true);
      return;
    }

    Promise.all([
      loader.importLibrary("maps"),
      loader.importLibrary("marker"),
      loader.importLibrary("geometry"),
    ])
      .then(([{ Map }, { AdvancedMarkerElement }]) => {
        if (!mapRef.current) return;

        const midLat = (origin.lat + destination.lat) / 2;
        const midLng = (origin.lng + destination.lng) / 2;

        const map = new Map(mapRef.current, {
          center: { lat: midLat, lng: midLng },
          zoom: 10,
          disableDefaultUI: true,
          zoomControl: true,
          mapId: "openseat-ride-map",
        });

        const directionsService = new google.maps.DirectionsService();

        // Always draw the driver's original route (no waypoints)
        // Meeting point is calculated as closest point on this route to passenger
        directionsService.route(
          {
            origin: { lat: origin.lat, lng: origin.lng },
            destination: { lat: destination.lat, lng: destination.lng },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status !== "OK" || !result) return;

            const route = result.routes[0];

            // Draw full route following roads
            new google.maps.Polyline({
              map,
              path: route.overview_path,
              strokeColor: "#0D9488",
              strokeWeight: 5,
              strokeOpacity: 0.7,
            });

            // Origin marker
            new AdvancedMarkerElement({
              map,
              position: { lat: origin.lat, lng: origin.lng },
              title: "Pickup",
              content: createPin("#22C55E", "Pickup"),
            });

            // Passenger + meeting point logic
            if (passengerLocation) {
              const passengerPos = { lat: passengerLocation.lat, lng: passengerLocation.lng };

              // Find closest point on route to passenger
              const routePath = route.overview_path;
              let closestPoint = routePath[0];
              let closestDist = Infinity;
              for (let i = 0; i < routePath.length - 1; i++) {
                const a = routePath[i];
                const b = routePath[i + 1];
                const atob = { lat: b.lat() - a.lat(), lng: b.lng() - a.lng() };
                const atop = { lat: passengerLocation.lat - a.lat(), lng: passengerLocation.lng - a.lng() };
                const lenSq = atob.lat * atob.lat + atob.lng * atob.lng;
                let t = lenSq > 0 ? (atop.lat * atob.lat + atop.lng * atob.lng) / lenSq : 0;
                t = Math.max(0, Math.min(1, t));
                const projected = new google.maps.LatLng(a.lat() + t * atob.lat, a.lng() + t * atob.lng);
                const dist = google.maps.geometry.spherical.computeDistanceBetween(
                  new google.maps.LatLng(passengerLocation.lat, passengerLocation.lng),
                  projected
                );
                if (dist < closestDist) {
                  closestDist = dist;
                  closestPoint = projected;
                }
              }

              const meetPos = { lat: closestPoint.lat(), lng: closestPoint.lng() };

              // Dotted line from passenger to meeting point
              new google.maps.Polyline({
                map,
                path: [passengerPos, meetPos],
                strokeColor: "#6366F1",
                strokeWeight: 3,
                strokeOpacity: 0,
                icons: [{
                  icon: { path: "M 0,-1 0,1", strokeOpacity: 0.6, strokeWeight: 3, scale: 3 },
                  offset: "0",
                  repeat: "12px",
                }],
              });

              // Passenger marker
              new AdvancedMarkerElement({
                map,
                position: passengerPos,
                title: "You",
                content: createPin("#6366F1", "You"),
              });

              // Meeting point marker
              new AdvancedMarkerElement({
                map,
                position: meetPos,
                title: "Meet here",
                content: createPin("#0D9488", "Meet here"),
              });
            }

            // Explicit meeting point (if set without passenger)
            if (meetingPoint && !passengerLocation) {
              new AdvancedMarkerElement({
                map,
                position: { lat: meetingPoint.lat, lng: meetingPoint.lng },
                title: "Meeting point",
                content: createPin("#0D9488", "Meet here"),
              });
            }

            // Destination marker
            new AdvancedMarkerElement({
              map,
              position: { lat: destination.lat, lng: destination.lng },
              title: "Drop-off",
              content: createPin("#EF4444", "Drop-off"),
            });

            // Fit bounds with max zoom limit
            const bounds = route.bounds;
            if (bounds) {
              if (passengerLocation) {
                bounds.extend({ lat: passengerLocation.lat, lng: passengerLocation.lng });
              }
              map.fitBounds(bounds, 50);
              const listener = google.maps.event.addListener(map, "idle", () => {
                const zoom = map.getZoom();
                if (zoom !== undefined && zoom > 14) map.setZoom(14);
                google.maps.event.removeListener(listener);
              });
            }
          }
        );
      })
      .catch(() => setError(true));
  }, [origin, destination, meetingPoint, passengerLocation, pickupFlexibility, flexibleRadiusMi]);

  if (error) {
    const dist = distanceMi(origin, destination);
    const estMinutes = Math.round(dist * 2.2); // ~27 mph average in town

    const stops: { color: string; label: string; address: string; dotSize: string }[] = [
      { color: "bg-green-400", label: "Pickup", address: origin.address, dotSize: "w-3 h-3" },
    ];
    if (passengerLocation) {
      stops.push({ color: "bg-indigo-400", label: "You", address: passengerLocation.address, dotSize: "w-4 h-4" });
    }
    stops.push({ color: "bg-red-400", label: "Drop-off", address: destination.address, dotSize: "w-3 h-3" });

    return (
      <div className="rounded-card overflow-hidden">
        {/* Top stats bar */}
        <div className="bg-[#0B1D1A] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xl font-bold text-white">{dist.toFixed(1)} mi</p>
              <p className="text-xs text-gray-500">distance</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-xl font-bold text-white">~{estMinutes} min</p>
              <p className="text-xs text-gray-500">estimated</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Active</span>
          </div>
        </div>

        {/* Route stops */}
        <div className="bg-[#0F2622] px-4 py-4">
          {stops.map((stop, i) => (
            <div key={stop.label} className="flex items-start gap-3">
              {/* Dot + connector */}
              <div className="flex flex-col items-center w-5">
                <div className={`${stop.dotSize} rounded-full ${stop.color} border-2 border-white/20 shrink-0 shadow-lg`}
                  style={{ boxShadow: `0 0 8px ${stop.color === "bg-green-400" ? "#4ade80" : stop.color === "bg-indigo-400" ? "#818cf8" : "#f87171"}40` }}
                />
                {i < stops.length - 1 && (
                  <div className="w-0.5 h-10 bg-gradient-to-b from-white/20 to-white/5 my-1" />
                )}
              </div>

              {/* Address */}
              <div className="flex-1 min-w-0 pb-2">
                <p className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: stop.color === "bg-green-400" ? "#4ade80" : stop.color === "bg-indigo-400" ? "#818cf8" : "#f87171" }}
                >
                  {stop.label}
                </p>
                <p className="text-sm text-white/90 truncate mt-0.5">{stop.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-56 rounded-card" />;
}

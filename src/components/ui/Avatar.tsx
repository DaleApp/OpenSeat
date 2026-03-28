"use client";

import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const px = sizeMap[size];

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  };

  if (!src || imgError) {
    return (
      <div
        className={`rounded-full bg-brand flex items-center justify-center text-white font-semibold ${textSize[size]} ${className}`}
        style={{ width: px, height: px }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={px}
      height={px}
      className={`rounded-full object-cover ${className}`}
      onError={() => setImgError(true)}
    />
  );
}

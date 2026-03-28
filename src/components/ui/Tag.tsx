"use client";

interface TagProps {
  label: string;
  variant?: "default" | "success" | "warning";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Tag({
  label,
  variant = "default",
  selected,
  onClick,
  className = "",
}: TagProps) {
  const variantClasses = {
    default: "bg-brand-light text-brand-dark",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
  };

  const selectedClass = selected
    ? "ring-2 ring-brand ring-offset-1"
    : "";

  const clickableClass = onClick
    ? "cursor-pointer hover:opacity-80 active:scale-95 transition-all"
    : "";

  return (
    <span
      onClick={onClick}
      className={`tag ${variantClasses[variant]} ${selectedClass} ${clickableClass} ${className}`}
    >
      {label}
    </span>
  );
}

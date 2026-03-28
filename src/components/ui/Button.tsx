"use client";

import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  href,
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  const base = variant === "primary" ? "btn-primary" : "btn-secondary";

  const sizeClasses = {
    sm: "text-sm py-2 px-4",
    md: "",
    lg: "text-lg py-4 px-8",
  };

  const classes = `${base} ${sizeClasses[size]} inline-flex items-center justify-center gap-2 ${
    disabled || loading ? "opacity-50 pointer-events-none" : ""
  } ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

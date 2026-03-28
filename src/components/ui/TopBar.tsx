"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "./icons";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function TopBar({ title, showBack = false, rightAction }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-surface-primary border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 text-text-primary hover:text-brand transition-colors"
            >
              <ArrowLeftIcon size={22} />
            </button>
          )}
        </div>
        {title && (
          <h1 className="text-base font-semibold text-text-primary truncate">
            {title}
          </h1>
        )}
        <div className="w-10 flex justify-end">{rightAction}</div>
      </div>
    </header>
  );
}

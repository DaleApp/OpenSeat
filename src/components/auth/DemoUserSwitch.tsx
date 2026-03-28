"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { MOCK_USERS } from "@/lib/mock-data";
import { UserIcon } from "@/components/ui/icons";

export default function DemoUserSwitch() {
  const { isDemoMode, user, switchDemoUser } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!isDemoMode) return null;

  return (
    <div ref={containerRef} className="fixed bottom-20 right-4 z-50">
      {open && (
        <div className="bg-surface-primary border border-border rounded-card shadow-lg mb-2 overflow-hidden">
          {MOCK_USERS.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                switchDemoUser(u.id);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-secondary transition-colors ${
                user?.id === u.id ? "bg-brand-light text-brand-dark font-medium" : "text-text-primary"
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-brand text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-dark transition-colors"
      >
        <UserIcon size={20} />
      </button>
    </div>
  );
}

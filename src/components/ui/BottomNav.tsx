"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SearchIcon, PlusIcon, UserIcon } from "./icons";

const tabs = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/ride/search", label: "Search", icon: SearchIcon },
  { href: "/ride/new", label: "Publish", icon: PlusIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-nav-height bg-surface-primary border-t border-border flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              isActive
                ? "text-brand"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

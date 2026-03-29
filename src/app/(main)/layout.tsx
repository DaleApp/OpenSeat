"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import BottomNav from "@/components/ui/BottomNav";
import TopBar from "@/components/ui/TopBar";
import { useAuth } from "@/lib/auth-context";
import DemoUserSwitch from "@/components/auth/DemoUserSwitch";

const MAIN_TABS = ["/home", "/ride/search", "/events", "/profile"];

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, isDemoMode } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      router.push("/login");
    }
  }, [user, loading, isDemoMode, router]);

  if (loading || (!user && !isDemoMode)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMainTab = MAIN_TABS.includes(pathname);

  return (
    <AuthGate>
      <div className="min-h-screen pb-nav-height">
        <TopBar title="OpenSeat" showBack={!isMainTab} />
        <main>{children}</main>
        <BottomNav />
        <DemoUserSwitch />
      </div>
    </AuthGate>
  );
}

import BottomNav from "@/components/ui/BottomNav";
import TopBar from "@/components/ui/TopBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-nav-height">
      <TopBar title="OpenSeat" />
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}

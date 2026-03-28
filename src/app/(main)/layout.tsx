import BottomNav from "@/components/ui/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-nav-height">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}

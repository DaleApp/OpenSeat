import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenSeat — Tu asiento libre te está esperando",
  description:
    "Carpooling exclusivo para comunidades cerradas. Compartí viajes con gente verificada de tu universidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

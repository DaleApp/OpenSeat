import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenSeat — Your open seat is waiting",
  description:
    "Exclusive carpooling for closed communities. Share rides with verified people from your university.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

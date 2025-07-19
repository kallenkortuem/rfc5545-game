import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RFC 5545 Learning Game",
  description: "Learn RFC 5545 (iCalendar) specification through interactive games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

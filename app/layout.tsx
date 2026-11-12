import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raja & Nadhiya | Engagement Ceremony",
  description:
    "Join us as Raja and Nadhiya celebrate their engagement on Sunday, 22 November 2026 at Chinnaiyal Pazhanisami Mahal.",
  icons: {
    icon: "/rn-logo.png",
    apple: "/rn-logo.png",
  },
  openGraph: {
    title: "Raja & Nadhiya — Engagement Ceremony",
    description:
      "A celebration of love. Sunday, 22 November 2026 at 1:30 PM onwards · Chinnaiyal Pazhanisami Mahal.",
    images: ["/engagement-invitation.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

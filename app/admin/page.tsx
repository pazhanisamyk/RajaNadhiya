import type { Metadata } from "next";
import { AdminDashboard } from "../components/AdminDashboard";
import { isAdminAuthenticated } from "../lib/adminAuth";
import { readBlessings, readSiteSettings } from "../lib/dataStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel | Raja & Nadhiya Engagement",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [authenticated, settings] = await Promise.all([
    isAdminAuthenticated(),
    readSiteSettings(),
  ]);

  const blessings = authenticated ? await readBlessings() : [];

  return (
    <AdminDashboard
      initialAuthenticated={authenticated}
      initialBlessings={blessings}
      initialSettings={settings}
    />
  );
}


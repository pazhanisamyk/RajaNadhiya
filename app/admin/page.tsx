import type { Metadata } from "next";
import { AdminDashboard } from "../components/AdminDashboard";
import { isAdminAuthenticated } from "../lib/adminAuth";
import {
  getStorageInfo,
  readBlessings,
  readSiteSettings,
} from "../lib/dataStore";

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

  const blessings = authenticated
    ? await readBlessings().catch((err) => {
        console.error("[admin SSR] readBlessings failed:", err);
        return [];
      })
    : [];
  const storageInfo = getStorageInfo();

  return (
    <AdminDashboard
      initialAuthenticated={authenticated}
      initialBlessings={blessings}
      initialSettings={settings}
      storageMode={storageInfo.mode}
      storageLabel={storageInfo.label}
    />
  );
}


import { HomeClient } from "./components/HomeClient";
import { readBlessings, readSiteSettings } from "./lib/dataStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [blessings, settings] = await Promise.all([
    readBlessings().catch((err) => {
      console.error("[home SSR] readBlessings failed:", err);
      return [];
    }),
    readSiteSettings(),
  ]);

  let visibleBlessings = settings.showPublicBlessings
    ? blessings.filter((b) => b.approved)
    : [];

  if (visibleBlessings.length === 0) {
    try {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const raw = await fs.readFile(
        path.join(process.cwd(), "data", "blessings.json"),
        "utf8"
      );
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        visibleBlessings = parsed.filter((b) => b.approved !== false);
      }
    } catch {
      // fallback ignore
    }
  }

  return (
    <HomeClient
      initialBlessings={visibleBlessings}
      initialSettings={settings}
    />
  );
}

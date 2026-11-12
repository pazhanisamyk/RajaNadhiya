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

  const visibleBlessings = settings.showPublicBlessings
    ? blessings.filter((b) => b.approved)
    : [];

  return (
    <HomeClient
      initialBlessings={visibleBlessings}
      initialSettings={settings}
    />
  );
}

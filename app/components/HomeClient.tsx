"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import type { BlessingRecord, SiteSettings } from "../lib/types";
import { AmbientPetals } from "./AmbientPetals";
import { BackgroundMusicPlayer } from "./BackgroundMusicPlayer";
import { CalendarVenueSection } from "./CalendarVenueSection";
import { CeremonyInfoSection } from "./CeremonyInfoSection";
import { DressCodeScheduleSection } from "./DressCodeScheduleSection";
import { GiftBoxSection } from "./GiftBoxSection";
import { GuestbookSection } from "./GuestbookSection";
import { InvitationCover } from "./InvitationCover";
import { PhotoGallerySection } from "./PhotoGallerySection";
import { TemplateHero } from "./TemplateHero";

interface HomeClientProps {
  initialBlessings: BlessingRecord[];
  initialSettings: SiteSettings;
}

export function HomeClient({
  initialBlessings,
  initialSettings,
}: HomeClientProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const notify = useCallback((message: string) => {
    setToastMsg(message);
  }, []);

  // Ensure scroll is at top on reload/initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.getElementById("top")?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    }
  }, []);

  const handleCoverOpen = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.getElementById("top")?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    }
    setMusicPlaying(true);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2800);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  return (
    <main id="top" className="template-page-root">
      {/* 0. Front Cover Screen with Left & Right Pillars, Gold Wax Seal & 'Open' Button */}
      <InvitationCover
        groom={initialSettings.groom}
        bride={initialSettings.bride}
        dateDisplay={initialSettings.dateDisplay}
        onOpen={handleCoverOpen}
      />

      {/* 1. Floating Circular Golden Music Pill Button at bottom-right */}
      <BackgroundMusicPlayer autoPlayTrigger={musicPlaying} />

      {/* 2. Subtle Ambient Jasmine Petals */}
      <AmbientPetals />

      {/* 3. Central Mobile/Template Container Frame (#6b0508) */}
      <div className="template-viewport-container">
        {/* Background Texture Overlay across all sections */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage: "url('/assets/decorations/background-texture.webp')",
            backgroundRepeat: "repeat",
            backgroundPosition: "top left",
            backgroundSize: "calc(1.00000 * var(--st-w)) calc(1.44019 * var(--st-w))",
            opacity: 0.55,
            zIndex: 0,
          }}
        />
        {/* Section 1: Hero Frame with Arch, Bells, Om, Pillars, Kolam, Urli & Lamps */}
        <TemplateHero
          groom={initialSettings.groom}
          bride={initialSettings.bride}
        />

        {/* Section 2: Ceremony Info with Parents & Date */}
        <CeremonyInfoSection
          groom={initialSettings.groom}
          bride={initialSettings.bride}
        />

        {/* Section 3: Photo Gallery 3D Carousel & Countdown */}
        <PhotoGallerySection />

        {/* Section 4: Golden Filigree Calendar & Venue Map */}
        <CalendarVenueSection onNotify={notify} />

        {/* Section 5: Dress Code & Schedule with Wreath, Swan, Chair Icons */}
        <DressCodeScheduleSection />

        {/* Section 6: Guestbook with Magic Wand Suggested Wishes Modal */}
        <GuestbookSection
          initialBlessings={initialBlessings}
          quickBlessings={initialSettings?.quickBlessings}
          onNotify={notify}
        />

        {/* Section 7: Gift Box with 3D Box, Modal, Bottom Temple Framing & Footer */}
        <GiftBoxSection onNotify={notify} />
      </div>

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="template-toast-banner" role="status" aria-live="polite">
          <Sparkles size={14} />
          <span>{toastMsg}</span>
        </div>
      )}
    </main>
  );
}

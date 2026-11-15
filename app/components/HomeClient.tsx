"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const stopAutoScrollRef = useRef<(() => void) | null>(null);
  const autoScrollStartedRef = useRef(false);

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
    }
  }, []);

  // Smooth, slow cinematic auto-scroll after opening; stops completely on any user interaction
  const startAutoScroll = useCallback(() => {
    if (typeof window === "undefined") return () => {};
    if (autoScrollStartedRef.current) return () => {};
    autoScrollStartedRef.current = true;

    // Ensure overflow is unlocked
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    let rafId: number | null = null;
    let isCancelled = false;
    let listenersAttached = false;
    let graceTimer: number | null = null;

    const htmlEl = document.documentElement;
    const prevScrollBehavior = htmlEl.style.scrollBehavior;
    // CRITICAL: Set html scrollBehavior to 'auto' so window.scrollTo in rAF does not conflict with CSS scroll-behavior: smooth
    htmlEl.style.scrollBehavior = "auto";

    const cleanup = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (graceTimer !== null) {
        clearTimeout(graceTimer);
        graceTimer = null;
      }
      if (listenersAttached) {
        listenersAttached = false;
        const events: (keyof WindowEventMap)[] = [
          "wheel",
          "touchstart",
          "touchmove",
          "pointerdown",
          "mousedown",
          "keydown",
        ];
        events.forEach((evt) => {
          window.removeEventListener(evt, handleUserInteraction);
        });
      }
      htmlEl.style.scrollBehavior = prevScrollBehavior;
    };

    const stopAutoScroll = () => {
      if (isCancelled) return;
      isCancelled = true;
      cleanup();
    };

    const handleUserInteraction = () => {
      stopAutoScroll();
    };

    // Speed: smooth relaxed cinematic glide (~65px/sec)
    const SCROLL_SPEED_PX_PER_SEC = 65;
    let lastTime = performance.now();
    let currentY = window.scrollY || document.documentElement.scrollTop || 0;

    const scrollStep = (now: number) => {
      if (isCancelled) return;

      const elapsed = (now - lastTime) / 1000;
      lastTime = now;
      // Cap delta time to prevent large leaps if tab was temporarily blurred/throttled
      const dt = Math.min(elapsed, 0.1);

      currentY += SCROLL_SPEED_PX_PER_SEC * dt;
      window.scrollTo({ top: currentY, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = currentY;

      // Stop automatically if reached near the bottom of document
      const maxScroll = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      ) - window.innerHeight;

      if (currentY >= maxScroll - 6) {
        stopAutoScroll();
        return;
      }

      rafId = requestAnimationFrame(scrollStep);
    };

    // Begin auto-scrolling immediately
    lastTime = performance.now();
    currentY = window.scrollY || document.documentElement.scrollTop || 0;
    rafId = requestAnimationFrame(scrollStep);

    // Attach user interaction cancellation listeners after 300ms grace period
    // so the initial click/tap on the "Open" button doesn't accidentally cancel auto-scroll!
    graceTimer = window.setTimeout(() => {
      if (isCancelled) return;
      listenersAttached = true;
      const events: (keyof WindowEventMap)[] = [
        "wheel",
        "touchstart",
        "touchmove",
        "pointerdown",
        "mousedown",
        "keydown",
      ];
      events.forEach((evt) => {
        window.addEventListener(evt, handleUserInteraction, { passive: true });
      });
    }, 300);

    return () => {
      stopAutoScroll();
    };
  }, []);

  const handleCoverOpen = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    setMusicPlaying(true);

    // Failsafe: if handleCoverDismissed is not called within 1550ms, start auto-scroll
    window.setTimeout(() => {
      if (!autoScrollStartedRef.current) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        stopAutoScrollRef.current = startAutoScroll();
      }
    }, 1550);
  }, [startAutoScroll]);

  const handleCoverDismissed = useCallback(() => {
    if (!autoScrollStartedRef.current) {
      stopAutoScrollRef.current = startAutoScroll();
    }
  }, [startAutoScroll]);

  // Clean up auto-scroll listeners on unmount
  useEffect(() => {
    return () => {
      stopAutoScrollRef.current?.();
    };
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
        onDismissed={handleCoverDismissed}
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

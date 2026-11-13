"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface SiteLoaderProps {
  couple?: string;
  date?: string;
  duration?: number;
}

export function SiteLoader({
  couple = "Raja & Nadhiya",
  date = "22 · 11 · 2026",
  duration = 1500,
}: SiteLoaderProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      triggerExit();
    }, duration);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        triggerExit();
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [duration]);

  function triggerExit() {
    if (isExiting) return;
    setIsExiting(true);

    // Allow the 500ms fade-out/scale transition to finish before unmounting
    window.setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 500);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`site-loader-overlay ${isExiting ? "is-exiting" : ""}`}
      onClick={triggerExit}
      role="dialog"
      aria-modal="true"
      aria-label="Loading invitation"
    >
      {/* Ambient background glow and floating sparks */}
      <div className="loader-backdrop-glow" aria-hidden="true" />
      <div className="loader-particles" aria-hidden="true">
        <span className="loader-spark s-1" />
        <span className="loader-spark s-2" />
        <span className="loader-spark s-3" />
        <span className="loader-spark s-4" />
        <span className="loader-spark s-5" />
      </div>

      <div className="loader-card" onClick={(e) => e.stopPropagation()}>
        {/* Animated Emblem Lockup */}
        <div className="loader-emblem-wrap">
          <div className="loader-halo-pulse" aria-hidden="true" />

          {/* Rotating gold orbit filigree ring */}
          <svg
            className="loader-orbit-ring"
            viewBox="0 0 160 160"
            aria-hidden="true"
          >
            <circle
              cx="80"
              cy="80"
              r="76"
              fill="none"
              stroke="rgba(182, 138, 69, 0.22)"
              strokeWidth="1.5"
            />
            <circle
              cx="80"
              cy="80"
              r="76"
              fill="none"
              stroke="url(#loaderGoldGrad)"
              strokeWidth="2.5"
              strokeDasharray="90 150"
              strokeLinecap="round"
              className="loader-ring-spin"
            />
            <circle
              cx="80"
              cy="80"
              r="67"
              fill="none"
              stroke="rgba(124, 37, 38, 0.28)"
              strokeWidth="1"
              strokeDasharray="4 8"
              className="loader-ring-reverse"
            />
            <defs>
              <linearGradient
                id="loaderGoldGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#b68a45" />
                <stop offset="50%" stopColor="#f3ddaa" />
                <stop offset="100%" stopColor="#7c2526" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Monogram */}
          <div className="loader-logo-frame">
            <span className="loader-shimmer-sweep" aria-hidden="true" />
            <Image
              src="/rn-logo.png"
              alt={`${couple} Monogram`}
              width={548}
              height={520}
              className="loader-logo-img"
              priority
            />
          </div>
        </div>

        {/* Couple Branding */}
        <div className="loader-brand">
          <span className="loader-eyebrow">
            <Sparkles size={13} className="loader-sparkle-icon" />
            <span>Engagement Celebration</span>
            <Sparkles size={13} className="loader-sparkle-icon" />
          </span>

          <h1 className="loader-title">{couple}</h1>

          <div className="loader-date-row">
            <span className="loader-line" aria-hidden="true" />
            <span className="loader-date">{date}</span>
            <span className="loader-line" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}


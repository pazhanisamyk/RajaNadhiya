"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Expand,
  Heart,
  MapPin,
  QrCode,
  Share2,
  Sparkles,
} from "lucide-react";
import { getFullVenue } from "../lib/eventData";
import type { BlessingRecord, SiteSettings } from "../lib/types";
import { AmbientPetals } from "./AmbientPetals";
import { BlessingsSection } from "./BlessingsSection";
import { CelebrationHighlights } from "./CelebrationHighlights";
import { Countdown } from "./Countdown";
import { OrnamentDivider } from "./OrnamentDivider";
import { PreviewModal, type ModalKind } from "./PreviewModal";
import { Reveal } from "./Reveal";
import { VenueLocationSection } from "./VenueLocationSection";

interface HomeClientProps {
  initialBlessings: BlessingRecord[];
  initialSettings: SiteSettings;
}

export function HomeClient({
  initialBlessings,
  initialSettings,
}: HomeClientProps) {
  const [copied, setCopied] = useState(false);
  const [modalKind, setModalKind] = useState<ModalKind>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const fullVenue = getFullVenue(initialSettings);

  const notify = useCallback((message: string) => {
    setToastMsg(message);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  useEffect(() => {
    const updateScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(
        Math.min(100, Math.max(0, (window.scrollY / max) * 100))
      );
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  async function copyVenue() {
    try {
      await navigator.clipboard.writeText(fullVenue);
      setCopied(true);
      notify("Venue address copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy the venue address:", fullVenue);
    }
  }

  async function shareInvitation() {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `You are invited to the Engagement Ceremony of ${initialSettings.couple} on ${initialSettings.dateDisplay} at ${initialSettings.timeDisplay}. Venue: ${fullVenue}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: initialSettings.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or native share unsupported; fall back to clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      notify("Invitation link copied to share");
    } catch {
      notify("Use the browser menu to share this invitation");
    }
  }

  function handleCardMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 6).toFixed(2)),
      ry: Number((x * 6).toFixed(2)),
    });
  }

  function resetCardTilt() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <main id="top">
      <AmbientPetals />

      <header className="topbar">
        <div className="topbar-inner page-shell">
          <a
            className="brand-lockup"
            href="#home"
            aria-label={`${initialSettings.couple} home`}
          >
            <span className="brand-logo-ring">
              <Image
                src="/rn-logo.png"
                alt="R & N Logo"
                width={548}
                height={520}
                className="brand-logo-img"
                priority
              />
            </span>
            <span className="brand-text">
              <strong>{initialSettings.couple}</strong>
              <small>{initialSettings.dateNumeric}</small>
            </span>
          </a>

          <nav className="topbar-nav" aria-label="Primary sections">
            <a href="#countdown">Countdown</a>
            <a href="#highlights">Celebration</a>
            <a href="#details">Details</a>
            <a href="#venue-qr">Location QR</a>
            <a href="#blessings">Blessings</a>
          </nav>

          <div className="topbar-actions">
            <button
              type="button"
              className="topbar-share-btn"
              onClick={shareInvitation}
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </div>
        </div>
        <span
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
      </header>

      <div className="page-shell">
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow hero-animate hero-delay-1">
              <Sparkles size={14} /> Together with our families
            </span>

            <h1 className="hero-animate hero-delay-2">
              Two hearts.
              <br />
              <em className="gold-shimmer-text">One beautiful</em>
              <br />
              beginning.
            </h1>

            <p className="intro hero-animate hero-delay-3">
              With joyful hearts and the blessings of our elders, we warmly
              invite you to share in a cherished moment as we celebrate our
              engagement and begin our forever together.
            </p>

            <div className="couple-names hero-animate hero-delay-4">
              <span>{initialSettings.groom}</span>
              <span className="couple-amp-wrap" aria-hidden="true">
                <span className="couple-amp-rule" />
                <i>&amp;</i>
                <span className="couple-amp-rule" />
              </span>
              <span>{initialSettings.bride}</span>
            </div>

            <div className="hero-meta-pills hero-animate hero-delay-5">
              <span className="meta-pill">
                <CalendarDays size={15} /> {initialSettings.dateDisplay}
              </span>
              <span className="meta-pill">
                <Clock3 size={15} /> {initialSettings.timeDisplay}
              </span>
              <a className="meta-pill meta-pill-link" href="#venue-qr">
                <MapPin size={15} /> {initialSettings.venueName}
              </a>
            </div>

            <div className="hero-cta-group hero-animate hero-delay-6">
              <a className="primary-button" href="#details">
                Join our celebration <ArrowUpRight size={16} />
              </a>
              <a className="secondary-button" href="#venue-qr">
                <QrCode size={15} /> Venue QR
              </a>
              <button
                type="button"
                className="ghost-link-button"
                onClick={() => setModalKind("invitation")}
              >
                <Expand size={14} /> Full Invite
              </button>
            </div>
          </div>

          <div className="hero-visual hero-animate hero-delay-3">
            <div
              className="invitation-frame"
              onMouseMove={handleCardMove}
              onMouseLeave={resetCardTilt}
              onClick={() => setModalKind("invitation")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setModalKind("invitation");
                }
              }}
              aria-label="Open full engagement invitation card"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) rotate(1.1deg)`,
              }}
            >
              <div className="frame-corner frame-corner-tl" />
              <div className="frame-corner frame-corner-br" />
              <div className="card-sheen" aria-hidden="true" />

              <div className="invitation-seal" aria-hidden="true">
                <Image
                  src="/rn-logo.png"
                  alt=""
                  width={548}
                  height={520}
                  className="invitation-seal-img"
                />
              </div>

              <Image
                src="/engagement-invitation.png"
                alt={`${initialSettings.couple} engagement invitation with ceremony date and venue`}
                width={1055}
                height={1491}
                priority
                className="invitation-image"
                sizes="(max-width: 850px) 88vw, 42vw"
              />

              <div className="image-caption">
                <span>Save the date &middot; Tap to enlarge</span>
                <Heart size={13} fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="hero-ornament" aria-hidden="true">
            ✳
          </div>
        </section>

        <OrnamentDivider />

        <section
          className="countdown-section"
          id="countdown"
          aria-label="Countdown to the engagement"
        >
          <Reveal>
            <p className="section-kicker">The countdown begins</p>
            <h2>
              Until we say <em>“yes”</em>
            </h2>
            <Countdown settings={initialSettings} onNotify={notify} />
          </Reveal>
        </section>

        <OrnamentDivider withLogo />

        <CelebrationHighlights />

        <VenueLocationSection
          settings={initialSettings}
          copied={copied}
          onCopyVenue={copyVenue}
          onOpenQrModal={() => setModalKind("qr")}
          onNotify={notify}
        />

        <BlessingsSection
          initialBlessings={initialBlessings}
          settings={initialSettings}
          onNotify={notify}
        />

        <footer className="footer-shell">
          <div className="footer">
            <span className="footer-brand">
              <Image
                src="/rn-logo.png"
                alt="R & N logo"
                width={548}
                height={520}
                className="footer-logo"
              />
              Made with <Heart size={12} fill="currentColor" /> for our special
              day
            </span>
            <span className="footer-center">
              {initialSettings.dateNumeric} &middot; {initialSettings.venueName}
            </span>
          </div>

          <div className="developer-credit">
            <div className="developer-line">
              <span className="developer-label">Website designed by</span>
              <a
                className="developer-name"
                href="https://devpazhani.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="developer-name-text">Pazhanisamy K</span>
                <Heart
                  size={12}
                  fill="currentColor"
                  className="developer-heart"
                  aria-hidden="true"
                />
                <span className="developer-arrow" aria-hidden="true">
                  <ArrowUpRight size={12} />
                </span>
              </a>
            </div>
            <span className="developer-role">
              Full Stack Web &amp; Mobile Application Developer
            </span>
            <span className="developer-rights">
              &copy; 2026 {initialSettings.couple}. All rights reserved.{" "}
              <span aria-hidden="true">&middot;</span>{" "}
              <Link className="admin-footer-link" href="/admin">
                Admin
              </Link>
            </span>
          </div>
        </footer>
      </div>

      <a
        className={`floating-top-btn ${scrollProgress > 8 ? "is-visible" : ""}`}
        href="#top"
        aria-label="Back to top"
      >
        <ArrowUp size={13} />
        <span>Top</span>
      </a>

      <PreviewModal
        kind={modalKind}
        settings={initialSettings}
        onClose={() => setModalKind(null)}
        onNotify={notify}
      />

      {toastMsg && (
        <div className="toast-banner" role="status" aria-live="polite">
          <Sparkles size={14} />
          <span>{toastMsg}</span>
        </div>
      )}
    </main>
  );
}


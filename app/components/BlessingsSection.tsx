"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Eye, Heart, Lock, Send, Sparkles, X } from "lucide-react";
import { DEFAULT_SITE_SETTINGS } from "../lib/eventData";
import type { BlessingRecord, SiteSettings } from "../lib/types";
import { PetalShape } from "./AmbientPetals";
import { Reveal } from "./Reveal";

const SENDER_STORAGE_KEY = "rn_sender_blessings_v1";

interface BurstPiece {
  dx: string;
  dy: string;
  rot: string;
  delay: string;
  tone: "gold" | "wine" | "blush";
}

interface BlessingsSectionProps {
  initialBlessings?: BlessingRecord[];
  settings?: SiteSettings;
  onNotify?: (msg: string) => void;
}

const BURST_TEMPLATE: BurstPiece[] = [
  { dx: "-130px", dy: "-95px", rot: "-35deg", delay: "0ms", tone: "gold" },
  { dx: "-85px", dy: "-135px", rot: "25deg", delay: "30ms", tone: "blush" },
  { dx: "-28px", dy: "-150px", rot: "-15deg", delay: "10ms", tone: "wine" },
  { dx: "32px", dy: "-148px", rot: "28deg", delay: "40ms", tone: "gold" },
  { dx: "92px", dy: "-132px", rot: "-24deg", delay: "20ms", tone: "blush" },
  { dx: "134px", dy: "-88px", rot: "42deg", delay: "50ms", tone: "wine" },
  { dx: "-152px", dy: "-32px", rot: "-48deg", delay: "35ms", tone: "blush" },
  { dx: "152px", dy: "-28px", rot: "38deg", delay: "25ms", tone: "gold" },
  { dx: "-115px", dy: "42px", rot: "30deg", delay: "60ms", tone: "wine" },
  { dx: "118px", dy: "46px", rot: "-30deg", delay: "45ms", tone: "blush" },
  { dx: "-64px", dy: "-82px", rot: "16deg", delay: "55ms", tone: "gold" },
  { dx: "68px", dy: "-78px", rot: "-18deg", delay: "15ms", tone: "wine" },
];

const CELEBRATION_CASCADE = [
  { left: "9%", delay: "0ms", duration: "3.4s", size: 20, kind: "blossom" as const },
  { left: "21%", delay: "160ms", duration: "3.7s", size: 17, kind: "rose" as const },
  { left: "34%", delay: "80ms", duration: "3.5s", size: 18, kind: "ivory" as const },
  { left: "46%", delay: "220ms", duration: "3.9s", size: 21, kind: "blossom" as const },
  { left: "58%", delay: "110ms", duration: "3.6s", size: 17, kind: "blush" as const },
  { left: "70%", delay: "250ms", duration: "3.8s", size: 16, kind: "gold" as const },
  { left: "81%", delay: "60ms", duration: "3.5s", size: 20, kind: "blossom" as const },
  { left: "91%", delay: "180ms", duration: "3.7s", size: 18, kind: "rose" as const },
];

export function BlessingsSection({
  initialBlessings = [],
  settings = DEFAULT_SITE_SETTINGS,
  onNotify,
}: BlessingsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [blessingText, setBlessingText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    message?: string;
    submit?: string;
  }>({});
  const [personalWishes, setPersonalWishes] = useState<BlessingRecord[]>([]);
  const [burstKey, setBurstKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let localList: BlessingRecord[] = [];
    try {
      const raw = window.localStorage.getItem(SENDER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          localList = parsed.filter(
            (item): item is BlessingRecord =>
              Boolean(item) &&
              typeof item === "object" &&
              typeof (item as BlessingRecord).id === "string" &&
              typeof (item as BlessingRecord).name === "string" &&
              typeof (item as BlessingRecord).message === "string"
          );
        }
      }
    } catch {
      // Ignore storage read errors in restricted browsers
    }

    if (localList.length === 0) return;

    let cancelled = false;
    const ids = localList.map((item) => item.id).slice(0, 20);
    fetch(`/api/blessings?ids=${encodeURIComponent(ids.join(","))}`, {
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { blessings?: BlessingRecord[] };
        if (cancelled || !Array.isArray(data.blessings)) return;
        setPersonalWishes(data.blessings);
        try {
          window.localStorage.setItem(
            SENDER_STORAGE_KEY,
            JSON.stringify(data.blessings)
          );
        } catch {
          // Ignore storage write errors in restricted browsers
        }
      })
      .catch(() => {
        // Keep page quiet if verification request fails transiently
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [modalOpen]);

  function openModal() {
    setErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
    setErrors({});
  }

  function handleQuickPick(wish: string) {
    setBlessingText(wish);
    if (errors.message || errors.submit) {
      setErrors((prev) => ({ ...prev, message: undefined, submit: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanedName = guestName.trim();
    const cleanedMessage = blessingText.trim();
    const nextErrors: { name?: string; message?: string } = {};

    if (!cleanedName) {
      nextErrors.name = "Please enter your name.";
    }
    if (!cleanedMessage) {
      nextErrors.message = "Please choose a quick blessing or write your wish.";
    }

    if (nextErrors.name || nextErrors.message) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/blessings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanedName, message: cleanedMessage }),
      });

      const data = (await res.json()) as {
        blessing?: BlessingRecord;
        error?: string;
      };

      if (!res.ok || !data.blessing) {
        setErrors({
          submit: data.error || "Unable to save blessing. Please try again.",
        });
        return;
      }

      const savedWish = data.blessing;
      setPersonalWishes((prev) => {
        const next = [savedWish, ...prev.filter((w) => w.id !== savedWish.id)];
        try {
          window.localStorage.setItem(SENDER_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage write errors in restricted browsers
        }
        return next;
      });
      setBurstKey((k) => k + 1);
      setModalOpen(false);
      setGuestName("");
      setBlessingText("");
      onNotify?.(`Your blessing has been saved for ${settings.couple}!`);
    } catch {
      setErrors({
        submit: "Connection issue while saving blessing. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Merge admin-approved public wishes (when enabled) with the sender's own locally remembered wishes.
  const wishMap = new Map<string, BlessingRecord>();
  if (settings.showPublicBlessings) {
    for (const wish of initialBlessings) {
      wishMap.set(wish.id, wish);
    }
  }
  for (const wish of personalWishes) {
    if (!wishMap.has(wish.id)) {
      wishMap.set(wish.id, wish);
    }
  }

  const orderedWishes = Array.from(wishMap.values()).sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <section className="closing" id="blessings">
      {mounted &&
        burstKey > 0 &&
        createPortal(
          <div
            className="celebration-cascade"
            key={`cascade-${burstKey}`}
            aria-hidden="true"
          >
            {CELEBRATION_CASCADE.map((p, idx) => (
              <span
                key={idx}
                className="cascade-petal"
                style={{
                  left: p.left,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              >
                <PetalShape kind={p.kind} />
              </span>
            ))}
          </div>,
          document.body
        )}

      <Reveal variant="scale" className="closing-inner">
        <div className="closing-crest-row">
          <span className="closing-crest-line" aria-hidden="true" />
          <div className="closing-crest">
            <span className="closing-crest-halo" aria-hidden="true" />
            <Image
              src="/rn-logo.png"
              alt={`${settings.couple} monogram crest`}
              width={548}
              height={520}
              className="closing-crest-img"
            />
          </div>
          <span className="closing-crest-line" aria-hidden="true" />
        </div>

        <p className="closing-lead">With love and happiness,</p>
        <h2>
          {settings.groom} <i>&amp;</i> {settings.bride}
        </h2>
        <p className="closing-small">
          We look forward to celebrating this milestone with your warm smiles and
          blessings.
        </p>

        <div className="blessing-action-wrap">
          {burstKey > 0 && (
            <div className="blessing-burst" key={burstKey} aria-hidden="true">
              {BURST_TEMPLATE.map((p, i) => (
                <span
                  key={i}
                  className={`burst-particle burst-${p.tone}`}
                  style={
                    {
                      "--dx": p.dx,
                      "--dy": p.dy,
                      "--rot": p.rot,
                      animationDelay: p.delay,
                    } as React.CSSProperties
                  }
                >
                  {p.tone === "gold" ? (
                    <Sparkles size={13} />
                  ) : (
                    <Heart size={12} fill="currentColor" />
                  )}
                </span>
              ))}
            </div>
          )}

          <button type="button" className="blessing-button" onClick={openModal}>
            <Heart size={15} fill="currentColor" />
            <span>
              {orderedWishes.length === 0
                ? "Shower Your Blessings"
                : "Send Another Blessing"}
            </span>
          </button>

          {orderedWishes.length > 0 && (
            <div className="sent-wishes-list" aria-live="polite">
              {orderedWishes.slice(0, 6).map((wish) => (
                <div
                  className={`sent-wish-card ${wish.featured ? "is-featured" : ""}`}
                  key={wish.id}
                >
                  <p className="sent-wish-message">“{wish.message}”</p>
                  <span className="sent-wish-author">
                    <Heart size={11} fill="currentColor" /> With love,{" "}
                    {wish.name}
                    {wish.featured && (
                      <span className="wish-featured-pill">
                        <Sparkles size={10} /> Featured
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {mounted &&
        modalOpen &&
        createPortal(
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="blessing-modal-title"
            onClick={closeModal}
          >
            <div
              className="modal-card blessing-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close blessing-modal-close"
                onClick={closeModal}
                aria-label="Close blessings popup"
              >
                <X size={17} />
              </button>

              <div className="blessing-modal-header">
                <div className="blessing-lotus-emblem" aria-hidden="true">
                  <svg viewBox="0 0 40 28" width="38" height="26" fill="none">
                    <path
                      d="M20 3C23.5 9.5 23.5 17 20 23C16.5 17 16.5 9.5 20 3Z"
                      fill="#e7c36a"
                    />
                    <path
                      d="M11 8C16 11 18.5 17 18.5 23C13 21 9.5 15 11 8Z"
                      fill="#d4a449"
                    />
                    <path
                      d="M29 8C24 11 21.5 17 21.5 23C27 21 30.5 15 29 8Z"
                      fill="#d4a449"
                    />
                    <path
                      d="M5 14C11 15 15.5 18.5 17.5 23C11.5 23.5 6.5 20 5 14Z"
                      fill="#c39038"
                    />
                    <path
                      d="M35 14C29 15 24.5 18.5 22.5 23C28.5 23.5 33.5 20 35 14Z"
                      fill="#c39038"
                    />
                  </svg>
                </div>
                <h3 id="blessing-modal-title">Send Your Blessings</h3>
                <p className="blessing-modal-subtitle">
                  {settings.couple} &mdash; Share your warm wishes
                </p>
              </div>

              <form className="blessing-form" onSubmit={handleSubmit} noValidate>
                <div className="blessing-field-group">
                  <span className="blessing-label">Choose a quick blessing:</span>
                  <div className="quick-wishes-grid">
                    {settings.quickBlessings.map((wish) => {
                      const isSelected = blessingText === wish;
                      return (
                        <button
                          key={wish}
                          type="button"
                          className={`quick-wish-chip ${isSelected ? "is-selected" : ""}`}
                          onClick={() => handleQuickPick(wish)}
                        >
                          {wish}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="blessing-guest-name">
                    Your Name <span className="blessing-required">*</span>
                  </label>
                  <input
                    id="blessing-guest-name"
                    type="text"
                    required
                    aria-invalid={Boolean(errors.name)}
                    className={`blessing-input ${errors.name ? "is-invalid" : ""}`}
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value);
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder="e.g., Arjun & Family"
                    maxLength={60}
                  />
                  {errors.name && (
                    <p className="blessing-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="blessing-field-group">
                  <label className="blessing-label" htmlFor="blessing-message">
                    Your Blessing <span className="blessing-required">*</span>
                  </label>
                  <textarea
                    id="blessing-message"
                    required
                    aria-invalid={Boolean(errors.message)}
                    className={`blessing-textarea ${errors.message ? "is-invalid" : ""}`}
                    rows={3}
                    value={blessingText}
                    onChange={(e) => {
                      setBlessingText(e.target.value);
                      if (errors.message) {
                        setErrors((prev) => ({ ...prev, message: undefined }));
                      }
                    }}
                    placeholder="Write your warm wishes here..."
                    maxLength={280}
                  />
                  {errors.message && (
                    <p className="blessing-error" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {errors.submit && (
                  <p className="blessing-error" role="alert">
                    {errors.submit}
                  </p>
                )}

                <div className="blessing-modal-actions">
                  <button
                    type="button"
                    className="blessing-cancel-btn"
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="blessing-submit-btn"
                    disabled={submitting}
                  >
                    <Send size={14} />
                    <span>{submitting ? "Saving..." : "Send Blessing"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

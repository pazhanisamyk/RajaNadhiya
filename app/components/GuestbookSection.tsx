"use client";

import { useEffect, useState } from "react";
import type { BlessingRecord } from "../lib/types";
import { SuggestedWishesModal } from "./SuggestedWishesModal";

const DEFAULT_FALLBACK_BLESSINGS: BlessingRecord[] = [];

function formatBlessingDate(isoOrDate?: string): string {
  if (!isoOrDate) return "";
  try {
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

interface GuestbookSectionProps {
  initialBlessings: BlessingRecord[];
  quickBlessings?: string[];
  onNotify?: (msg: string) => void;
}

export function GuestbookSection({
  initialBlessings,
  quickBlessings = [],
  onNotify,
}: GuestbookSectionProps) {
  const [blessings, setBlessings] = useState<BlessingRecord[]>(
    initialBlessings && initialBlessings.length > 0
      ? initialBlessings
      : DEFAULT_FALLBACK_BLESSINGS
  );
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Sync state whenever server initialBlessings update
  useEffect(() => {
    setBlessings(initialBlessings || []);
  }, [initialBlessings]);

  // Verify and sync any guest-submitted blessings against live MongoDB
  useEffect(() => {
    let isMounted = true;

    async function syncGuestBlessings() {
      try {
        // Collect candidate IDs from either modern or legacy localStorage
        let candidateIds: string[] = [];
        const storedIdsRaw = localStorage.getItem("rn_guest_blessing_ids");
        if (storedIdsRaw) {
          try {
            const parsed = JSON.parse(storedIdsRaw);
            if (Array.isArray(parsed)) {
              candidateIds = parsed.filter(
                (id): id is string => typeof id === "string" && id.trim().length > 0
              );
            }
          } catch {}
        }

        // Migrate or extract from legacy key if present
        const legacyRaw = localStorage.getItem("rn_guest_blessings");
        if (legacyRaw) {
          try {
            const parsed = JSON.parse(legacyRaw);
            if (Array.isArray(parsed)) {
              const legacyIds = parsed.map((b) => b?.id).filter(Boolean);
              candidateIds = Array.from(new Set([...candidateIds, ...legacyIds]));
            }
          } catch {}
          // Immediately purge the legacy key that blindly cached deleted records
          localStorage.removeItem("rn_guest_blessings");
        }

        if (candidateIds.length === 0) {
          localStorage.removeItem("rn_guest_blessing_ids");
          return;
        }

        // Validate candidate IDs directly against the live database
        const res = await fetch(
          `/api/blessings?ids=${encodeURIComponent(candidateIds.join(","))}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        const liveBlessings: BlessingRecord[] = Array.isArray(data.blessings)
          ? data.blessings
          : [];

        if (!isMounted) return;

        // Any ID not returned by the server has been DELETED by the admin!
        const liveIdSet = new Set(liveBlessings.map((b) => b.id));

        // Update localStorage to ONLY keep IDs that actually exist in the database
        const validIds = candidateIds.filter((id) => liveIdSet.has(id));
        if (validIds.length > 0) {
          localStorage.setItem("rn_guest_blessing_ids", JSON.stringify(validIds));
        } else {
          localStorage.removeItem("rn_guest_blessing_ids");
        }

        // Update blessings in state:
        // 1. Remove any blessing whose ID was deleted by admin
        // 2. Prepend any live pending blessing not already in initialBlessings
        setBlessings((prev) => {
          const candidateSet = new Set(candidateIds);
          const cleaned = prev.filter((b) => {
            if (candidateSet.has(b.id) && !liveIdSet.has(b.id)) {
              return false; // Removed by admin!
            }
            return true;
          });

          const existingIds = new Set(cleaned.map((b) => b.id));
          const toAdd = liveBlessings.filter((b) => !existingIds.has(b.id));

          return [...toAdd, ...cleaned];
        });
      } catch (err) {
        console.error("[GuestbookSection] syncGuestBlessings error:", err);
      }
    }

    syncGuestBlessings();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncGuestBlessings();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanMsg = message.trim();

    if (!cleanName || !cleanMsg) {
      setErrorMsg("Please enter both your name and wish.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/blessings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, message: cleanMsg }),
      });

      if (!res.ok) {
        throw new Error("Failed to send blessing");
      }

      const data = await res.json();
      const created: BlessingRecord = data.blessing || data;

      if (created && created.id) {
        const normalized: BlessingRecord = {
          id: created.id,
          name: created.name || cleanName,
          message: created.message || cleanMsg,
          createdAt: created.createdAt || new Date().toISOString(),
          approved: Boolean(created.approved),
          featured: Boolean(created.featured),
        };

        setBlessings((prev) => [
          normalized,
          ...prev.filter((b) => b.id !== normalized.id),
        ]);

        try {
          const storedIdsRaw = localStorage.getItem("rn_guest_blessing_ids");
          const storedIds: string[] = storedIdsRaw ? JSON.parse(storedIdsRaw) : [];
          const updatedIds = Array.from(
            new Set([created.id, ...(Array.isArray(storedIds) ? storedIds : [])])
          ).slice(0, 10);
          localStorage.setItem("rn_guest_blessing_ids", JSON.stringify(updatedIds));
          localStorage.removeItem("rn_guest_blessings");
        } catch {}
      }

      setName("");
      setMessage("");
      onNotify?.("Thank you! Your heartfelt wish has been received. 💐");
    } catch {
      setErrorMsg("Could not submit your blessing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectSuggestion(suggestedWish: string) {
    setMessage(suggestedWish);
    setShowModal(false);
    onNotify?.("Wish selected!");
  }

  return (
    <section
      id="guestbook"
      aria-label="Guestbook and Blessings"
      style={{
        position: "relative",
        isolation: "isolate",
        width: "100%",
        marginTop: "calc(0.04 * var(--st-w))",
      }}
    >
      {/* Kolam Accents anchored to screen edges level with GUESTBOOK */}
      <img
        src="/assets/decorations/kolam-decoration.webp"
        alt=""
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "clamp(-44px, -10vw, -34px)",
          top: "clamp(-8px, -1vw, 0px)",
          transform: "scaleX(-1)",
          width: "25%",
          maxWidth: "96px",
          height: "auto",
          objectFit: "contain",
          zIndex: 1,
        }}
        loading="lazy"
        decoding="async"
      />
      <img
        src="/assets/decorations/kolam-decoration.webp"
        alt=""
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          right: "clamp(-44px, -10vw, -34px)",
          top: "clamp(-8px, -1vw, 0px)",
          width: "25%",
          maxWidth: "96px",
          height: "auto",
          objectFit: "contain",
          zIndex: 1,
        }}
        loading="lazy"
        decoding="async"
      />

      <div style={{ paddingInline: "8.503%" }}>
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Section Heading */}
          <h2
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "clamp(20px, 5.2vw, 26px)",
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: "center",
              color: "#f2c06e",
              letterSpacing: "0.06em",
              margin: "18px 0 24px",
            }}
          >
            GUESTBOOK
          </h2>

          {/* Form Container (Full width responsive up to 600px on desktop) */}
          <form
            onSubmit={handleSubmit}
            className="max-w-full md:max-w-[600px]"
            style={{ width: "100%", margin: "0 auto" }}
          >
            <div style={{ width: "100%" }}>
              {/* Name Field */}
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="text"
                  placeholder="Enter your name*"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  className="guestbook-input"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid rgba(242, 192, 110, 0.45)",
                    padding: "12px 14px",
                    color: "#ffdfaf",
                    backgroundColor: "transparent",
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    fontSize: "clamp(12px, 3.4vw, 14px)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Message Field */}
              <div style={{ marginBottom: "14px" }}>
                <textarea
                  placeholder="Enter your wishes*"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  required
                  className="guestbook-input"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid rgba(242, 192, 110, 0.45)",
                    padding: "12px 14px",
                    color: "#ffdfaf",
                    backgroundColor: "transparent",
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    fontSize: "clamp(12px, 3.4vw, 14px)",
                    outline: "none",
                    resize: "none",
                    minHeight: "100px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {errorMsg && (
                <p style={{ fontSize: "0.75rem", color: "#ff9999", marginBottom: "12px" }}>
                  {errorMsg}
                </p>
              )}

              {/* Bottom Actions Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                {/* Magic Wand Suggestion Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  style={{
                    width: "44px",
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: "1px solid rgba(242, 192, 110, 0.35)",
                    backgroundColor: "rgba(242, 192, 110, 0.12)",
                    color: "#f2c06e",
                    cursor: "pointer",
                    padding: 0,
                    transition: "transform 0.2s, background-color 0.2s",
                  }}
                  title="Suggested Wishes"
                  aria-label="Suggested Wishes"
                >
                  <span style={{ fontSize: "18px" }}>🪄</span>
                </button>

                {/* Send Wishes Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "9999px",
                    padding: "10px 28px",
                    textTransform: "uppercase",
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    fontWeight: 700,
                    fontSize: "clamp(13px, 3.6vw, 15px)",
                    letterSpacing: "0.06em",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    backgroundColor: "#f2c06e",
                    color: "#764c4d",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.35)",
                    transition: "transform 0.2s",
                  }}
                >
                  {isSubmitting ? "SENDING..." : "SEND WISHES"}
                </button>
              </div>
            </div>
          </form>

          {/* Blessings List */}
          <div
            className="max-w-full md:max-w-[600px]"
            style={{
              marginTop: "28px",
              width: "100%",
              marginInline: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {blessings
              .filter((b) => b && (b.name || b.message))
              .map((b) => (
                <div
                  key={b.id || b.createdAt}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid rgba(242, 192, 110, 0.35)",
                    backgroundColor: "transparent",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(13px, 3.5vw, 15px)",
                        color: "#f2c06e",
                      }}
                    >
                      {b.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize: "clamp(11px, 2.8vw, 12px)",
                        color: "rgba(242, 192, 110, 0.7)",
                      }}
                    >
                      {formatBlessingDate(b.createdAt)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: "clamp(13px, 3.2vw, 14px)",
                    marginTop: "6px",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    color: "#ffdfaf",
                    margin: "6px 0 0",
                  }}
                >
                  {b.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Wishes Modal */}
      <SuggestedWishesModal
        isOpen={showModal}
        wishes={quickBlessings}
        onSelectWish={handleSelectSuggestion}
        onClose={() => setShowModal(false)}
      />
    </section>
  );
}

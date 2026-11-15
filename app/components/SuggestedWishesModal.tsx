"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, X } from "lucide-react";

interface SuggestedWishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWish: (wish: string) => void;
  wishes?: string[];
}

export function SuggestedWishesModal({
  isOpen,
  onClose,
  onSelectWish,
  wishes = [],
}: SuggestedWishesModalProps) {
  const [mounted, setMounted] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const validWishes = wishes.filter(
    (w): w is string => typeof w === "string" && w.trim().length > 0
  );

  const countToShow = Math.min(5, validWishes.length);
  const currentWishes =
    countToShow > 0
      ? Array.from({ length: countToShow }).map((_, i) => {
          return validWishes[(startIndex + i) % validWishes.length];
        })
      : [];

  function handleGenerateMore() {
    if (validWishes.length > 1) {
      setStartIndex((prev) => (prev + 3) % validWishes.length);
    }
  }

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishes-modal-title"
      onClick={onClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(35, 2, 4, 0.45)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        padding: "16px",
        overscrollBehavior: "contain",
        touchAction: "none",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "430px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#6b0508",
          backgroundImage:
            "linear-gradient(180deg, rgba(120, 10, 16, 0.95) 0%, rgba(85, 4, 8, 0.98) 100%), url('/assets/decorations/background-texture.webp')",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1.5px solid #f2c06e",
          borderRadius: "16px",
          boxShadow:
            "0 20px 50px rgba(0, 0, 0, 0.75), 0 0 25px rgba(242, 192, 110, 0.25)",
          padding: "22px 18px",
          overflowY: "auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>✨</span>
            <h3
              id="wishes-modal-title"
              style={{
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#f2c06e",
                letterSpacing: "0.02em",
                margin: 0,
              }}
            >
              Suggested wishes for you
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close suggestions"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "1px solid rgba(242, 192, 110, 0.4)",
              backgroundColor: "rgba(242, 192, 110, 0.12)",
              color: "#f2c06e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
              transition: "transform 0.2s, background-color 0.2s",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p
          style={{
            fontFamily:
              "var(--font-dm-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "13px",
            color: "rgba(255, 223, 175, 0.85)",
            fontStyle: "italic",
            margin: "0 0 16px 0",
            lineHeight: 1.4,
          }}
        >
          Choose a wish you like or generate more suggestions
        </p>

        {/* Wishes List - Transparent background and typography matching already wished cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          {currentWishes.length > 0 ? (
            currentWishes.map((wish, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectWish(wish);
                  onClose();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(242, 192, 110, 0.12)";
                  e.currentTarget.style.borderColor = "#f2c06e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor =
                    "rgba(242, 192, 110, 0.35)";
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(242, 192, 110, 0.35)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <p
                  style={{
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "clamp(13px, 3.2vw, 14px)",
                    color: "#ffdfaf",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {wish}
                </p>
              </button>
            ))
          ) : (
            <div
              style={{
                padding: "20px 14px",
                textAlign: "center",
                borderRadius: "8px",
                border: "1px dashed rgba(242, 192, 110, 0.35)",
                backgroundColor: "rgba(0, 0, 0, 0.15)",
              }}
            >
              <p
                style={{
                  fontFamily:
                    "var(--font-dm-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "13.5px",
                  color: "#ffdfaf",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                No presets found. You can write your custom blessings directly
                in the guestbook!
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginTop: "auto",
          }}
        >
          <button
            type="button"
            onClick={handleGenerateMore}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "9999px",
              border: "1px solid #f2c06e",
              backgroundColor: "rgba(242, 192, 110, 0.15)",
              color: "#f2c06e",
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "13px",
              fontWeight: 700,
              padding: "8px 16px",
              cursor: "pointer",
              transition: "transform 0.2s, background-color 0.2s",
            }}
          >
            <Sparkles size={14} />
            <span>Generate more</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              borderRadius: "9999px",
              border: "1px solid rgba(242, 192, 110, 0.35)",
              backgroundColor: "transparent",
              color: "#ffdfaf",
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "13px",
              fontWeight: 600,
              padding: "8px 20px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

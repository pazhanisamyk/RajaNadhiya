"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface GiftBoxSectionProps {
  onNotify?: (msg: string) => void;
}

export function GiftBoxSection({ onNotify }: GiftBoxSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const origBody = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;
    const origTouch = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = origBody;
      document.documentElement.style.overflow = origHtml;
      document.body.style.touchAction = origTouch;
      window.removeEventListener("keydown", handleKey);
    };
  }, [modalOpen]);

  return (
    <>
      <section
        id="gift-box"
        aria-label="Gift Box"
        style={{
          position: "relative",
          isolation: "isolate",
          width: "100%",
          marginTop: "calc(0.05215 * var(--st-w))",
          paddingInline: "8.503%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "24px",
            paddingBottom: "24px",
            position: "relative",
            zIndex: 10,
            width: "100%",
          }}
        >
          <h2
            className="text-[20px] md:text-[26px]"
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              marginBottom: "16px",
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: "center",
              color: "#f2c06e",
              letterSpacing: "0.06em",
            }}
          >
            GIFT BOX
          </h2>

          {/* Interactive 3D Gift Box Button */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="Open gift box"
            className="group cursor-pointer"
            style={{
              position: "relative",
              outline: "none",
              border: "none",
              backgroundColor: "transparent",
              width: "260px",
              height: "280px",
              transition: "transform 0.2s",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: "26px",
              }}
            >
              {/* Floating Star Sparkles */}
              <span
                style={{
                  position: "absolute",
                  top: "8%",
                  left: "14%",
                  color: "#ffdfaf",
                  fontSize: "22px",
                  pointerEvents: "none",
                  zIndex: 20,
                }}
                className="igb-sparkle"
              >
                ✦
              </span>
              <span
                style={{
                  position: "absolute",
                  top: "18%",
                  right: "10%",
                  color: "#ffdfaf",
                  fontSize: "16px",
                  pointerEvents: "none",
                  zIndex: 20,
                }}
                className="igb-sparkle-2"
              >
                ✦
              </span>
              <span
                style={{
                  position: "absolute",
                  top: "32%",
                  left: "5%",
                  color: "#ffdfaf",
                  fontSize: "14px",
                  pointerEvents: "none",
                  zIndex: 20,
                }}
                className="igb-sparkle-3"
              >
                ✦
              </span>
              <span
                style={{
                  position: "absolute",
                  top: "26%",
                  right: "5%",
                  color: "#ffdfaf",
                  fontSize: "14px",
                  pointerEvents: "none",
                  zIndex: 20,
                }}
                className="igb-sparkle-4"
              >
                ✦
              </span>

              {/* 3D Box & Floating Mini Gifts Container */}
              <div
                style={{
                  position: "relative",
                  width: "200px",
                  height: "220px",
                }}
                className="igb-bob"
              >
                {/* Breathing Ground Shadow */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "-8px",
                    width: "144px",
                    height: "12px",
                    marginLeft: "-72px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.45)",
                    filter: "blur(4px)",
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                  className="igb-shadow"
                />

                {/* Floating Mini Gifts Around Main Box */}
                <img
                  src="/assets/gifts/crystal_floral_red.webp"
                  alt=""
                  style={{
                    position: "absolute",
                    left: "-20px",
                    top: "10px",
                    width: "34px",
                    zIndex: 1,
                    transform: "rotate(-22deg)",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/gifts/florence_brown.webp"
                  alt=""
                  style={{
                    position: "absolute",
                    left: "168px",
                    top: "2px",
                    width: "38px",
                    zIndex: 1,
                    transform: "rotate(20deg)",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/gifts/riviera_blue.webp"
                  alt=""
                  style={{
                    position: "absolute",
                    left: "-16px",
                    top: "120px",
                    width: "26px",
                    zIndex: 1,
                    transform: "rotate(-18deg)",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/gifts/qasr_green.webp"
                  alt=""
                  style={{
                    position: "absolute",
                    left: "182px",
                    top: "114px",
                    width: "24px",
                    zIndex: 1,
                    transform: "rotate(14deg)",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                  decoding="async"
                />

                {/* Main Mandap Dark Red Royal Gift Box */}
                <img
                  src="/assets/gifts/mandap_darkred.webp"
                  alt="Royal Wedding Gift Box"
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 0,
                    width: "170px",
                    maxHeight: "220px",
                    objectFit: "contain",
                    marginLeft: "-85px",
                    zIndex: 2,
                    filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.4))",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                  decoding="async"
                />

                <img
                  src="/assets/gifts/qasr_blue.webp"
                  alt=""
                  style={{
                    position: "absolute",
                    left: "-8px",
                    top: "172px",
                    width: "44px",
                    zIndex: 3,
                    transform: "rotate(8deg)",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/gifts/boho_floral_green.webp"
                  alt=""
                  style={{
                    position: "absolute",
                    left: "26px",
                    top: "182px",
                    width: "26px",
                    zIndex: 3,
                    transform: "rotate(-10deg)",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/assets/gifts/applique_lace_white.webp"
                  alt=""
                  style={{
                    position: "absolute",
                    left: "118px",
                    top: "176px",
                    width: "40px",
                    zIndex: 3,
                    transform: "rotate(-14deg)",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Bouncing Hint */}
            <p
              className="igb-hint text-xs md:text-sm"
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                fontWeight: 500,
                color: "#ffdfaf",
                margin: 0,
              }}
            >
              <span>Tap to open</span>
            </p>
          </button>
        </div>
      </section>

      {/* Royal Temple Footer with Lamps & Blessing Message */}
      <footer style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 16px",
          }}
        >
          <span
            className="text-[13px] md:text-[16px] md:max-w-[560px]"
            style={{
              whiteSpace: "pre-line",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              margin: "calc(0.04 * var(--st-w)) auto 0",
              color: "#f2c06e",
              letterSpacing: "0.04em",
            }}
          >
            Your loving presence and warm blessings are the greatest gifts we could receive!
          </span>

          <div
            style={{
              marginTop: "calc(0.03 * var(--st-w))",
              marginBottom: "16px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              className="text-[11px] md:text-[13px]"
              style={{ opacity: 0.85, display: "block", color: "#ffdfaf" }}
            >
              Crafted with love by{" "}
              <a
                href="https://devpazhani.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-semibold"
                style={{
                  color: "#f2c06e",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  transition: "color 0.2s",
                }}
              >
                Pazhanisamy K
              </a>{" "}
              &bull;{" "}
              <a
                href="/admin"
                className="hover:underline font-semibold"
                style={{ color: "#f2c06e" }}
              >
                Admin
              </a>
            </span>
            <span
              className="text-[10px] md:text-[12px]"
              style={{
                color: "#f2c06e",
                opacity: 0.75,
                letterSpacing: "0.03em",
                fontWeight: 500,
              }}
            >
              Full Stack Web &amp; Mobile Application Developer
            </span>
          </div>
        </div>

        {/* Temple Architecture Base Footer Image (Lamps, Urli, Garlands) */}
        <div
          style={{
            position: "relative",
            zIndex: 0,
            width: "100%",
            height: "calc(0.59864 * var(--st-w))",
          }}
        >
          <img
            src="/assets/decorations/temple-decoration-footer.webp"
            alt=""
            aria-hidden="true"
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: "-4.195%",
              bottom: "-8%",
              width: "108.390%",
              height: "auto",
              maxWidth: "none",
              objectFit: "contain",
            }}
            loading="eager"
            decoding="async"
          />
        </div>
      </footer>

      {/* Gift Box Dialog / Modal */}
      {modalOpen && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
          onWheel={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            backgroundColor: "rgba(35, 2, 4, 0.45)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            overscrollBehavior: "contain",
            touchAction: "none",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
              maxHeight: "88vh",
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
              borderRadius: "16px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.75), 0 0 25px rgba(242, 192, 110, 0.25)",
              border: "1.5px solid #f2c06e",
              backgroundColor: "#6b0508",
              backgroundImage:
                "linear-gradient(180deg, rgba(120, 10, 16, 0.95) 0%, rgba(85, 4, 8, 0.98) 100%), url('/assets/decorations/background-texture.webp')",
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                position: "relative",
                padding: "16px 24px",
                textAlign: "center",
                backgroundColor: "#f2c06e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "18px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  margin: 0,
                  color: "#764c4d",
                }}
              >
                Gift Box
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#764c4d",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "4px 8px",
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                textAlign: "center",
                color: "#ffdfaf",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "13.5px",
                  lineHeight: 1.5,
                  color: "rgba(255, 223, 175, 0.9)",
                  margin: 0,
                }}
              >
                For beloved friends and family who wish to send their warm blessings and token of love digitally:
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                }}
              >
                {/* Groom's Account Card */}
                <div
                  style={{
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid rgba(242, 192, 110, 0.35)",
                    backgroundColor: "transparent",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', 'Times New Roman', serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "10px",
                      color: "#f2c06e",
                    }}
                  >
                    Groom &bull; Krishnaraja
                  </span>

                  {/* QR Code Graphic Frame */}
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      padding: "8px",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "4px 0",
                    }}
                  >
                    <img
                      src="/assets/qr/groom_upi_qr.jpeg"
                      alt="Groom UPI QR"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>

                  {/* Save QR Button */}
                  <a
                    href="/assets/qr/groom_upi_qr.jpeg"
                    download="krishnarajaraja_engagement_qr.jpeg"
                    onClick={() => onNotify?.("Groom QR code downloaded!")}
                    style={{
                      marginTop: "14px",
                      padding: "8px 22px",
                      borderRadius: "9999px",
                      fontSize: "12.5px",
                      fontFamily: "'Playfair Display', 'Times New Roman', serif",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: "#f2c06e",
                      color: "#764c4d",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      textDecoration: "none",
                      transition: "transform 0.2s, background-color 0.2s",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Save QR
                  </a>
                </div>

                {/* Bride's Account Card */}
                <div
                  style={{
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid rgba(242, 192, 110, 0.35)",
                    backgroundColor: "transparent",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', 'Times New Roman', serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "10px",
                      color: "#f2c06e",
                    }}
                  >
                    Bride &bull; Nadhiya
                  </span>

                  {/* QR Code Graphic Frame */}
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      padding: "8px",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "4px 0",
                    }}
                  >
                    <img
                      src="/assets/qr/bride_upi_qr.jpeg"
                      alt="Bride UPI QR"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>

                  {/* Save QR Button */}
                  <a
                    href="/assets/qr/bride_upi_qr.jpeg"
                    download="nadhiya_engagement_qr.jpeg"
                    onClick={() => onNotify?.("Bride QR code downloaded!")}
                    style={{
                      marginTop: "14px",
                      padding: "8px 22px",
                      borderRadius: "9999px",
                      fontSize: "12.5px",
                      fontFamily: "'Playfair Display', 'Times New Roman', serif",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: "#f2c06e",
                      color: "#764c4d",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      textDecoration: "none",
                      transition: "transform 0.2s, background-color 0.2s",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Save QR
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const GALLERY_IMAGES = [
  "/assets/gallery/gallery_1.webp",
  "/assets/gallery/gallery_2.jpg",
  "/assets/gallery/gallery_3.jpg",
  "/assets/gallery/gallery_4.jpg",
  "/assets/gallery/gallery_5.jpg",
  "/assets/gallery/gallery_6.webp",
];

export function PhotoGallerySection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [lightboxTouchStart, setLightboxTouchStart] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const total = GALLERY_IMAGES.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Lock body scroll and listen for keyboard navigation when lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, handleNext, handlePrev]);

  // Automatic Carousel Rotation (every 3.5 seconds)
  useEffect(() => {
    if (isPaused || lightboxOpen) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % total);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, lightboxOpen, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStart(null);
  };

  // Fullscreen Lightbox Modal rendered via Portal to avoid any container clipping or section overlap
  const lightboxModal =
    lightboxOpen && mounted ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Photo Gallery Lightbox"
        onClick={() => setLightboxOpen(false)}
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
          zIndex: 999999, // Super high z-index strictly above all sections and floating music button (z-index: 9999)
          backgroundColor: "rgba(35, 2, 4, 0.45)", // Soft frosted burgundy backdrop matching Suggested Wishes modal
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 12px 20px",
          touchAction: "none",
          overscrollBehavior: "contain",
        }}
      >
        {/* Lightbox Header with close button & slide counter */}
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            backgroundColor: "rgba(35, 2, 4, 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "14px",
            border: "1px solid rgba(242, 192, 110, 0.28)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "15px",
              fontWeight: 700,
              color: "#f2c06e",
              letterSpacing: "0.08em",
            }}
          >
            {activeIdx + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(242, 192, 110, 0.12)",
              border: "1px solid rgba(242, 192, 110, 0.4)",
              color: "#f2c06e",
              fontSize: "20px",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
              transition: "transform 0.2s, background-color 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Lightbox Center Image with Nav Buttons */}
        <div
          style={{
            position: "relative",
            flex: 1,
            width: "100%",
            maxWidth: "760px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 0",
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => setLightboxTouchStart(e.targetTouches[0].clientX)}
          onTouchEnd={(e) => {
            if (lightboxTouchStart === null) return;
            const diff = lightboxTouchStart - e.changedTouches[0].clientX;
            if (diff > 40) handleNext();
            else if (diff < -40) handlePrev();
            setLightboxTouchStart(null);
          }}
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            style={{
              position: "absolute",
              left: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "rgba(35, 2, 4, 0.8)",
              border: "1.5px solid rgba(242, 192, 110, 0.5)",
              color: "#f2c06e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.6)",
              transition: "transform 0.2s, background-color 0.2s",
            }}
          >
            &#8249;
          </button>

          {/* Active Photo */}
          <img
            src={GALLERY_IMAGES[activeIdx]}
            alt={`Raja & Nadhiya photo ${activeIdx + 1}`}
            style={{
              maxHeight: "min(68vh, 560px)",
              maxWidth: "calc(100% - 20px)",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: "16px",
              border: "1.5px solid rgba(242, 192, 110, 0.4)",
              boxShadow:
                "0 20px 50px rgba(0, 0, 0, 0.85), 0 0 25px rgba(242, 192, 110, 0.2)",
            }}
          />

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            style={{
              position: "absolute",
              right: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "rgba(35, 2, 4, 0.8)",
              border: "1.5px solid rgba(242, 192, 110, 0.5)",
              color: "#f2c06e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.6)",
              transition: "transform 0.2s, background-color 0.2s",
            }}
          >
            &#8250;
          </button>
        </div>

        {/* Lightbox Bottom Thumbnail Strip */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            maxWidth: "100%",
            padding: "8px 14px",
            scrollbarWidth: "none",
            backgroundColor: "rgba(35, 2, 4, 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "14px",
            border: "1px solid rgba(242, 192, 110, 0.28)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {GALLERY_IMAGES.map((thumb, tIdx) => {
            const isActive = tIdx === activeIdx;
            return (
              <button
                key={thumb}
                type="button"
                onClick={() => setActiveIdx(tIdx)}
                aria-label={`Select photo ${tIdx + 1}`}
                style={{
                  width: "56px",
                  height: "56px",
                  flexShrink: 0,
                  borderRadius: "10px",
                  overflow: "hidden",
                  padding: 0,
                  cursor: "pointer",
                  border: isActive
                    ? "2px solid #f2c06e"
                    : "1.5px solid rgba(255, 255, 255, 0.2)",
                  backgroundColor: "#200204",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  opacity: isActive ? 1 : 0.55,
                  transition: "all 0.2s ease",
                  boxShadow: isActive
                    ? "0 0 12px rgba(242, 192, 110, 0.6)"
                    : "none",
                }}
              >
                <img
                  src={thumb}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            );
          })}
        </div>
      </div>
    ) : null;

  return (
    <section
      id="gallery"
      aria-label="Photo Gallery"
      className="relative isolate w-full"
      style={{
        marginTop: "calc(0.015 * var(--st-w))",
        paddingInline: "8.503%",
      }}
    >
      <div className="relative z-10 flex w-full flex-col items-center">
        <h2
          className="uppercase font-bold text-[20px] md:text-[26px] text-center mb-4"
          style={{
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            color: "#f2c06e",
            letterSpacing: "0.06em",
          }}
        >
          PHOTO GALLERY
        </h2>

        {/* 3D Carousel Stage */}
        <div
          className="w-full max-w-[414px] md:max-w-[640px] relative select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="relative h-[340px] md:h-[520px] w-full"
            style={{ touchAction: "pan-y" }}
          >
            {/* Desktop Previous Button */}
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-[250] w-10 h-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-[#f2c06e] transition-transform hover:scale-110 border border-[#f2c06e]/40 shadow-lg cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            {/* Desktop Next Button */}
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-[250] w-10 h-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-[#f2c06e] transition-transform hover:scale-110 border border-[#f2c06e]/40 shadow-lg cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            {/* Perspective Viewport */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                perspective: "1000px",
              }}
            >
              {/* 3D Stack Cards */}
              {GALLERY_IMAGES.map((src, idx) => {
                const diff = (idx - activeIdx + total) % total;
                let transform = "";
                let opacity = 0;
                let zIndex = 0;
                let isVisible = false;

                if (diff === 0) {
                  // Active Center Photo
                  transform = "translateX(0%) translateZ(0px) rotateY(0deg) scale(1)";
                  opacity = 1;
                  zIndex = 100;
                  isVisible = true;
                } else if (diff === 1) {
                  // Right 1
                  transform = "translateX(55%) translateZ(-150px) rotateY(40deg) scale(0.85)";
                  opacity = 0.75;
                  zIndex = 90;
                  isVisible = true;
                } else if (diff === 2) {
                  // Right 2
                  transform = "translateX(110%) translateZ(-300px) rotateY(70deg) scale(0.7)";
                  opacity = 0.45;
                  zIndex = 80;
                  isVisible = true;
                } else if (diff === total - 1) {
                  // Left 1
                  transform = "translateX(-55%) translateZ(-150px) rotateY(-40deg) scale(0.85)";
                  opacity = 0.75;
                  zIndex = 90;
                  isVisible = true;
                } else if (diff === total - 2) {
                  // Left 2
                  transform = "translateX(-110%) translateZ(-300px) rotateY(-70deg) scale(0.7)";
                  opacity = 0.45;
                  zIndex = 80;
                  isVisible = true;
                } else {
                  transform = "translateX(0%) translateZ(-500px) scale(0.5)";
                  opacity = 0;
                  zIndex = 10;
                }

                return (
                  <div
                    key={src}
                    onClick={() => {
                      if (diff === 0) {
                        setLightboxOpen(true);
                      } else if (diff === 1 || diff === 2) {
                        handleNext();
                      } else {
                        handlePrev();
                      }
                    }}
                    className={`absolute rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-700 ease-out ${
                      diff === 0
                        ? "ring-2 ring-[#f2c06e] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                        : "ring-1 ring-white/10"
                    }`}
                    style={{
                      height: "92%",
                      aspectRatio: "0.666667",
                      transform,
                      opacity,
                      zIndex,
                      pointerEvents: isVisible ? "auto" : "none",
                    }}
                  >
                    <img
                      src={src}
                      alt={`Raja & Nadhiya photo ${idx + 1}`}
                      className="h-full w-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              marginTop: "16px",
            }}
          >
            {GALLERY_IMAGES.map((_, dotIdx) => {
              const isActive = dotIdx === activeIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  aria-label={`Go to photo ${dotIdx + 1}`}
                  onClick={() => setActiveIdx(dotIdx)}
                  style={{
                    width: isActive ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: isActive ? "#f2c06e" : "rgba(242, 192, 110, 0.3)",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.35s ease",
                    boxShadow: isActive ? "0 0 6px rgba(242, 192, 110, 0.4)" : "none",
                  }}
                />
              );
            })}
          </div>

          {/* Bottom Spacer Matching Template */}
          <div aria-hidden="true" style={{ height: "calc(0.02 * var(--st-w))" }} />
        </div>
      </div>

      {/* Render Lightbox Modal into document.body */}
      {mounted && lightboxModal && createPortal(lightboxModal, document.body)}
    </section>
  );
}

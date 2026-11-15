"use client";

interface TemplateHeroProps {
  groom: string;
  bride: string;
}

export function TemplateHero({ groom, bride }: TemplateHeroProps) {
  return (
    <section
      id="home"
      aria-label="Save The Date"
      style={{
        position: "relative",
        isolation: "isolate",
        width: "100%",
        marginTop: "calc(0.025 * var(--st-w))",
        height: "calc(1.82 * var(--st-w))",
        overflow: "visible",
      }}
    >
      {/* 1. Mandap Decoration Framing Layer */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "0",
          width: "111.791%",
          height: "calc(1.88 * var(--st-w))",
          zIndex: 0,
        }}
      >
        {/* Bottom Golden Floral Garland (Background shelf behind pillars) */}
        <img
          src="/assets/decorations/goldenfloral-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            left: "5.477%",
            top: "87.5%",
            height: "auto",
            width: "89.249%",
            maxWidth: "none",
            objectFit: "contain",
            zIndex: 1,
          }}
          loading="eager"
          decoding="async"
        />

        {/* Top Scalloped Mandap Arch Frame */}
        <img
          src="/assets/decorations/arch-frame.webp"
          alt=""
          style={{
            position: "absolute",
            left: "1.217%",
            top: "6%",
            height: "auto",
            width: "97.769%",
            maxWidth: "none",
            objectFit: "contain",
            zIndex: 3,
          }}
          loading="eager"
          decoding="async"
        />

        {/* Left Carved Temple Pillar with Banana Leaves & Jasmine Garland */}
        <img
          src="/assets/decorations/column-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            left: "-8.114%",
            top: "18.5%",
            height: "auto",
            width: "59.229%",
            maxWidth: "none",
            objectFit: "contain",
            transform: "scaleX(-1)",
            zIndex: 4,
          }}
          loading="eager"
          decoding="async"
        />

        {/* Right Carved Temple Pillar */}
        <img
          src="/assets/decorations/column-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            left: "48.276%",
            top: "18.5%",
            height: "auto",
            width: "59.229%",
            maxWidth: "none",
            objectFit: "contain",
            zIndex: 4,
          }}
          loading="eager"
          decoding="async"
        />

        {/* Center Kolam Motif */}
        <img
          src="/assets/decorations/kolam-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            left: "39.959%",
            top: "71.5%",
            height: "auto",
            width: "19.878%",
            maxWidth: "none",
            objectFit: "contain",
            zIndex: 5,
          }}
          loading="eager"
          decoding="async"
        />

        {/* Top Left Hanging Bells */}
        <img
          src="/assets/decorations/bell-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            left: "2.231%",
            top: "-5%",
            height: "auto",
            width: "25.355%",
            maxWidth: "none",
            objectFit: "contain",
            transform: "scaleX(-1)",
            zIndex: 6,
          }}
          loading="eager"
          decoding="async"
        />

        {/* Top Right Hanging Bells */}
        <img
          src="/assets/decorations/bell-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            left: "71.602%",
            top: "-5%",
            height: "auto",
            width: "25.355%",
            maxWidth: "none",
            objectFit: "contain",
            zIndex: 6,
          }}
          loading="eager"
          decoding="async"
        />

        {/* Sacred Om Emblem in Mandap Arch Center */}
        <img
          src="/assets/decorations/om-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            left: "41.780%",
            top: "16.5%",
            height: "auto",
            width: "16.440%",
            maxWidth: "none",
            objectFit: "contain",
            zIndex: 5,
          }}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* 2. Central Couple Typography Lockup */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "calc(0.70 * var(--st-w))",
          width: "59.637%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <p
          style={{
            whiteSpace: "pre-line",
            fontSize: "clamp(10px, calc(0.027 * var(--st-w)), 14px)",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontFamily: "'DM Sans', sans-serif",
            color: "#ffdfaf",
            margin: 0,
          }}
        >
          SAVE THE DATE
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            lineHeight: 1,
            marginTop: "calc(0.03628 * var(--st-w))",
            color: "#f2c06e",
          }}
        >
          <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                whiteSpace: "nowrap",
                fontSize: "clamp(26px, calc(0.078 * var(--st-w)), 42px)",
                lineHeight: 1.3,
                fontWeight: 600,
                paddingTop: "0.14em",
              }}
            >
              {groom}
            </span>
          </div>

          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              color: "#f2c06e",
              fontSize: "clamp(18px, calc(0.048 * var(--st-w)), 26px)",
              lineHeight: 1,
              margin: "calc(0.012 * var(--st-w)) 0",
            }}
          >
            &amp;
          </span>

          <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                whiteSpace: "nowrap",
                fontSize: "clamp(26px, calc(0.078 * var(--st-w)), 42px)",
                lineHeight: 1.3,
                fontWeight: 600,
                paddingTop: "0.14em",
              }}
            >
              {bride}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

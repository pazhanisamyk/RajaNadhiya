"use client";

interface CeremonyInfoSectionProps {
  groom: string;
  bride: string;
}

export function CeremonyInfoSection({
  groom,
  bride,
}: CeremonyInfoSectionProps) {
  return (
    <section
      id="ceremony-info"
      aria-label="Ceremony Information"
      style={{
        position: "relative",
        isolation: "isolate",
        width: "100%",
        marginTop: "calc(0.035 * var(--st-w))",
      }}
    >
      {/* Side Decorative Columns (Vibrant temple columns & brass lamps) */}
      <img
        src="/assets/decorations/column-decoration.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-19.388%",
          top: "calc(0.34014 * var(--st-w))",
          width: "48.299%",
          height: "auto",
          maxWidth: "none",
          objectFit: "contain",
          transform: "scaleX(-1)",
          pointerEvents: "none",
          zIndex: 1,
          willChange: "transform",
        }}
        loading="lazy"
        decoding="async"
      />
      <img
        src="/assets/decorations/column-decoration.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "70.975%",
          top: "calc(0.34014 * var(--st-w))",
          width: "48.299%",
          height: "auto",
          maxWidth: "none",
          objectFit: "contain",
          pointerEvents: "none",
          zIndex: 1,
          willChange: "transform",
        }}
        loading="lazy"
        decoding="async"
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          paddingInline: "8.503%",
        }}
      >
        {/* Section Heading */}
        <h2
          style={{
            fontSize: "clamp(20px, calc(0.054 * var(--st-w)), 26px)",
            textTransform: "uppercase",
            fontWeight: 700,
            textAlign: "center",
            color: "#f2c06e",
            letterSpacing: "0.04em",
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            margin: "0 0 10px",
          }}
        >
          CEREMONY INFO
        </h2>

        {/* Parents Grid Lockup */}
        <div
          style={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "1fr auto 1fr",
            columnGap: "12px",
            alignItems: "center",
            justifyContent: "center",
            color: "#f2c06e",
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            marginTop: "calc(0.03175 * var(--st-w))",
          }}
        >
          {/* Groom's Parents */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "clamp(12px, calc(0.032 * var(--st-w)), 16px)",
                color: "#ffdfaf",
              }}
            >
              Mr. &amp; Mrs.
            </span>
            <span
              style={{
                fontSize: "clamp(12px, calc(0.032 * var(--st-w)), 16px)",
                fontWeight: 600,
                color: "#f2c06e",
                marginTop: "2px",
                whiteSpace: "nowrap",
              }}
            >
              Mayavel
            </span>
            <span
              style={{
                fontSize: "clamp(12px, calc(0.032 * var(--st-w)), 16px)",
                fontWeight: 600,
                color: "#f2c06e",
                whiteSpace: "nowrap",
              }}
            >
              Dhatchayani
            </span>
          </div>

          {/* Center Vertical Filigree Divider (Fixed 51px height) */}
          <img
            src="/assets/decorations/line-decoration.webp"
            alt=""
            aria-hidden="true"
            style={{
              height: "51px",
              width: "auto",
              maxWidth: "none",
              alignSelf: "center",
              objectFit: "contain",
              margin: "0 6px",
            }}
          />

          {/* Bride's Parents */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "clamp(12px, calc(0.032 * var(--st-w)), 16px)",
                color: "#ffdfaf",
              }}
            >
              Mr. &amp; Mrs.
            </span>
            <span
              style={{
                fontSize: "clamp(12px, calc(0.032 * var(--st-w)), 16px)",
                fontWeight: 600,
                color: "#f2c06e",
                marginTop: "2px",
                whiteSpace: "nowrap",
              }}
            >
              Kanthavel
            </span>
            <span
              style={{
                fontSize: "clamp(12px, calc(0.032 * var(--st-w)), 16px)",
                fontWeight: 600,
                color: "#f2c06e",
                whiteSpace: "nowrap",
              }}
            >
              Saraswathi
            </span>
          </div>
        </div>

        {/* Joyful Announcement Banner */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            textAlign: "center",
            textTransform: "uppercase",
            margin: "0 auto",
            fontSize: "clamp(14px, calc(0.038 * var(--st-w)), 20px)",
            color: "#f2c06e",
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            letterSpacing: "0.04em",
            marginTop: "calc(0.04535 * var(--st-w))",
          }}
        >
          <span>WE JOYFULLY ANNOUNCE</span>
          <span>THE ENGAGEMENT OF OUR CHILDREN</span>
        </div>

        {/* Couple Names */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: "calc(0.04082 * var(--st-w))",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(30px, calc(0.082 * var(--st-w)), 48px)",
              fontFamily: "'Playfair Display', serif",
              width: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1.25,
              whiteSpace: "nowrap",
              color: "#f2c06e",
              margin: 0,
            }}
          >
            {groom}
          </h3>
          <div
            style={{
              fontSize: "clamp(22px, calc(0.06 * var(--st-w)), 36px)",
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              color: "#f2c06e",
              lineHeight: 1,
              margin: "6px 0",
            }}
          >
            &amp;
          </div>
          <h3
            style={{
              fontSize: "clamp(30px, calc(0.082 * var(--st-w)), 48px)",
              fontFamily: "'Playfair Display', serif",
              width: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1.25,
              whiteSpace: "nowrap",
              color: "#f2c06e",
              margin: 0,
            }}
          >
            {bride}
          </h3>
        </div>

        {/* Traditional Ceremony Details & Date Lockup */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: "calc(0.04535 * var(--st-w))",
            gap: "calc(0.04989 * var(--st-w))",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              textAlign: "center",
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
            }}
          >
            <div
              style={{
                color: "#f2c06e",
                maxWidth: "calc(0.76 * var(--st-w))",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(15px, calc(0.041 * var(--st-w)), 20px)",
                  whiteSpace: "pre-line",
                  textTransform: "uppercase",
                  lineHeight: 1.4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  letterSpacing: "0.03em",
                  fontWeight: 600,
                }}
              >
                TRADITIONAL ENGAGEMENT CEREMONY
                <span
                  style={{
                    fontSize: "clamp(12px, calc(0.031 * var(--st-w)), 15px)",
                    color: "#ffdfaf",
                    fontWeight: 400,
                    letterSpacing: "normal",
                    marginTop: "4px",
                  }}
                >
                  Chinnaiyal Pazhanisami Mahal, Madanagopalapuram
                </span>
              </span>
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                maxWidth: "220px",
                alignItems: "center",
                justifyContent: "space-between",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                fontSize: "clamp(12px, calc(0.031 * var(--st-w)), 16px)",
                color: "#ffdfaf",
                letterSpacing: "0.08em",
                marginTop: "6px",
              }}
            >
              <span>AT 01:30 PM</span>
              <span>SUNDAY</span>
            </div>

            {/* Large 22 November 2026 Display */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#f2c06e",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(52px, calc(0.146 * var(--st-w)), 76px)",
                  lineHeight: 1,
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  color: "#f2c06e",
                }}
              >
                22
              </span>
              <div
                style={{
                  height: "46px",
                  width: "1px",
                  backgroundColor: "#f2c06e",
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  textAlign: "left",
                  gap: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(15px, calc(0.043 * var(--st-w)), 22px)",
                    textTransform: "uppercase",
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    color: "#f2c06e",
                    lineHeight: 1.1,
                  }}
                >
                  NOVEMBER
                </span>
                <span
                  style={{
                    fontSize: "clamp(15px, calc(0.043 * var(--st-w)), 22px)",
                    textTransform: "uppercase",
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    color: "#f2c06e",
                    lineHeight: 1.1,
                  }}
                >
                  2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Proportional Section Spacer */}
        <div
          aria-hidden="true"
          style={{ height: "calc(0.02 * var(--st-w))" }}
        />
      </div>
    </section>
  );
}

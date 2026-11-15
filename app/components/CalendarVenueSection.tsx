"use client";

import { useEffect, useState } from "react";

interface CalendarVenueSectionProps {
  onNotify?: (msg: string) => void;
}

export function CalendarVenueSection({ onNotify }: CalendarVenueSectionProps) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    arrived: false,
  });

  useEffect(() => {
    const target = new Date("2026-11-22T13:30:00+05:30").getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          arrived: true,
        });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, minutes, seconds, arrived: false });
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const googleCalUrl =
    "https://www.google.com/calendar/render?action=TEMPLATE&text=Raja%20%26%20Nadhiya%20Engagement&dates=20261122T080000Z/20261122T110000Z&details=Engagement%20Ceremony%20of%20Raja%20and%20Nadhiya%20at%20Chinnaiyal%20Pazhanisami%20Mahal%2C%20Madanagopalapuram&location=Chinnaiyal%20Pazhanisami%20Mahal%2C%20Madanagopalapuram";

  return (
    <section
      id="reception-info"
      aria-label="Engagement & Venue Information"
      style={{
        position: "relative",
        isolation: "isolate",
        width: "100%",
        marginTop: "calc(0.02 * var(--st-w))",
      }}
    >
      {/* Side Decorative Flower Elements - Framed alongside Countdown & Schedule */}
      <img
        src="/assets/decorations/flower-decoration.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-5%",
          top: "calc(0.48 * var(--st-w))",
          width: "36%",
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
        src="/assets/decorations/flower-decoration.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-5%",
          top: "calc(0.48 * var(--st-w))",
          width: "36%",
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
        {/* Golden Line Divider */}
        <img
          src="/assets/decorations/golden-frame-decoration.webp"
          alt=""
          aria-hidden="true"
          style={{
            pointerEvents: "none",
            display: "block",
            margin: "25px auto 16px",
            width: "calc(0.65986 * var(--st-w))",
            maxWidth: "280px",
            height: "auto",
            objectFit: "contain",
          }}
          loading="lazy"
          decoding="async"
        />

        {/* Section Title */}
        <h2
          className="text-[20px] md:text-[26px]"
          style={{
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            textTransform: "uppercase",
            fontWeight: 700,
            textAlign: "center",
            color: "#f2c06e",
            letterSpacing: "0.06em",
            margin: "0 0 10px",
          }}
        >
          ENGAGEMENT INFO
        </h2>

        {/* Ceremony Subheading & Date Lockup */}
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              textTransform: "uppercase",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "clamp(13px, 3.6vw, 17px)",
              color: "#f2c06e",
              letterSpacing: "0.06em",
              margin: "0 0 14px",
            }}
          >
            The engagement will take place at:
          </h3>

          {/* Row 1: Time and Day */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "clamp(13px, 3.6vw, 16px)",
              color: "#ffdfaf",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "6px",
            }}
          >
            <span style={{ minWidth: "90px", textAlign: "right" }}>01:30 PM</span>
            <span style={{ minWidth: "90px", textAlign: "left" }}>SUNDAY</span>
          </div>

          {/* Row 2: 22 | NOVEMBER 2026 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              color: "#f2c06e",
            }}
          >
            <div style={{ minWidth: "90px", textAlign: "right" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(54px, 15vw, 76px)",
                  fontWeight: 700,
                  lineHeight: 0.95,
                  display: "inline-block",
                  color: "#f2c06e",
                }}
              >
                22
              </span>
            </div>

            <div
              style={{
                width: "1.5px",
                height: "52px",
                backgroundColor: "#f2c06e",
                opacity: 0.75,
              }}
            />

            <div
              style={{
                minWidth: "90px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                textAlign: "left",
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                color: "#f2c06e",
                gap: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(15px, 4.2vw, 20px)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  lineHeight: 1.15,
                }}
              >
                NOVEMBER
              </span>
              <span
                style={{
                  fontSize: "clamp(15px, 4.2vw, 20px)",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  lineHeight: 1.15,
                }}
              >
                2026
              </span>
            </div>
          </div>

          {/* Live Countdown Clock */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              marginTop: "24px",
            }}
          >
            <h4
              style={{
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontSize: "clamp(12px, 3.2vw, 15px)",
                fontWeight: 600,
                color: "#ffdfaf",
                margin: 0,
              }}
            >
              COUNTDOWN
            </h4>
            <div
              style={{
                marginTop: "10px",
                textAlign: "center",
                color: "#ffdfaf",
              }}
            >
              {countdown.arrived ? (
                <p
                  style={{
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(14px, 3.8vw, 18px)",
                    color: "#f2c06e",
                    margin: 0,
                  }}
                >
                  The blessed celebration is today!
                </p>
              ) : (
                <p
                  style={{
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    fontSize: "clamp(13px, 3.6vw, 17px)",
                    color: "#ffdfaf",
                    fontWeight: 500,
                    letterSpacing: "0.03em",
                    margin: 0,
                  }}
                >
                  {countdown.days} days {countdown.hours} hours {countdown.minutes} min {countdown.seconds} sec
                </p>
              )}
            </div>
          </div>

          {/* Key Milestone Times */}
          <div
            className="gap-6 sm:gap-10 md:gap-14"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(11px, 2.8vw, 13px)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#ffdfaf",
                }}
              >
                Welcome
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(16px, 4vw, 22px)",
                  color: "#f2c06e",
                  fontWeight: 600,
                  marginTop: "3px",
                }}
              >
                01:30 PM
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(11px, 2.8vw, 13px)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#ffdfaf",
                }}
              >
                Muhurtham
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(16px, 4vw, 22px)",
                  color: "#f2c06e",
                  fontWeight: 600,
                  marginTop: "3px",
                }}
              >
                01:45 PM
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(11px, 2.8vw, 13px)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#ffdfaf",
                }}
              >
                Virundhu
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(16px, 4vw, 22px)",
                  color: "#f2c06e",
                  fontWeight: 600,
                  marginTop: "3px",
                }}
              >
                02:00 PM
              </span>
            </div>
          </div>

          {/* Golden Filigree Calendar Container */}
          <div
            className="md:mt-12 max-w-[255px] md:max-w-[330px] pt-[48px] pb-[48px] md:pt-[60px] md:pb-[60px]"
            style={{
              position: "relative",
              margin: "60px auto 0",
              width: "100%",
            }}
          >
            {/* Outer Golden Calendar Filigree Artwork */}
            <img
              src="/assets/decorations/calendar-frame.webp"
              aria-hidden="true"
              alt=""
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "calc(100% + 154px)",
                maxWidth: "none",
                height: "auto",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Inner Calendar Grid */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                dir="ltr"
                className="max-w-[280px] md:max-w-[310px]"
                style={{
                  width: "100%",
                  margin: "0 auto",
                  borderRadius: "8px",
                  overflow: "hidden",
                  color: "#f2c06e",
                }}
              >
                {/* Month Heading */}
                <div
                  className="text-[15px] md:text-[19px] font-serif"
                  style={{
                    textAlign: "center",
                    padding: "10px 0",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid rgba(242, 192, 110, 0.3)",
                    color: "#f2c06e",
                  }}
                >
                  November 2026
                </div>

                {/* Weekday Labels (Mo - Su) */}
                <div
                  className="grid-cols-7"
                  style={{
                    display: "grid",
                    borderBottom: "2px solid #f2c06e",
                  }}
                >
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div
                      key={d}
                      className="text-[10px] md:text-[11px]"
                      style={{
                        textAlign: "center",
                        padding: "6px 0",
                        fontWeight: 500,
                        opacity: 0.65,
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div
                  className="grid-cols-7 gap-y-0.5"
                  style={{
                    display: "grid",
                    padding: "8px 4px",
                  }}
                >
                  {/* Blank slots for Mon to Sat (Nov 1 is Sunday) */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="h-[28px] md:h-[34px]"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                    />
                  ))}

                  {/* Days 1 to 30 */}
                  {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    const isDay22 = day === 22;

                    return (
                      <div
                        key={day}
                        className="h-[28px] md:h-[34px]"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        {isDay22 ? (
                          <div
                            style={{
                              position: "relative",
                              width: "28px",
                              height: "26px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                              viewBox="0 0 24 24"
                              fill="#f2c06e"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span
                              className="text-[11px] md:text-[12px]"
                              style={{
                                position: "relative",
                                zIndex: 10,
                                fontWeight: 900,
                                color: "#764c4d",
                              }}
                            >
                              22
                            </span>
                          </div>
                        ) : (
                          <span
                            className="text-[12px] md:text-[13px]"
                            style={{ opacity: 0.9 }}
                          >
                            {day}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Add to Google Calendar Action Link */}
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onNotify?.("Opening Google Calendar...")}
            className="text-[13px] md:text-[15px]"
            style={{
              marginTop: "40px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              color: "#ffdfaf",
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              letterSpacing: "0.04em",
              transition: "opacity 0.2s",
            }}
          >
            Add to Calendar
          </a>
        </div>

        {/* Golden Line Divider */}
        <img
          src="/assets/decorations/goldenline-decoration.webp"
          alt=""
          aria-hidden="true"
          style={{
            pointerEvents: "none",
            display: "block",
            margin: "calc(0.04 * var(--st-w)) auto 0",
            width: "calc(0.65986 * var(--st-w))",
            height: "auto",
            maxWidth: "none",
            objectFit: "contain",
          }}
          loading="lazy"
          decoding="async"
        />

        {/* Venue Section */}
        <div
          className="md:gap-4"
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <div style={{ position: "relative", textAlign: "center" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                fontSize: "clamp(18px, 4.5vw, 24px)",
                textTransform: "uppercase",
                fontWeight: 700,
                textAlign: "center",
                color: "#f2c06e",
                letterSpacing: "0.06em",
                margin: 0,
              }}
            >
              Engagement Ceremony Venue
            </h3>
            <div
              className="max-w-[280px] md:max-w-[440px]"
              style={{
                whiteSpace: "pre-line",
                margin: "6px auto 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(14px, 3.8vw, 18px)",
                  fontWeight: 600,
                  color: "#f2c06e",
                  letterSpacing: "0.03em",
                }}
              >
                Chinnaiyal Pazhanisami Mahal
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', 'Times New Roman', serif",
                  fontSize: "clamp(12px, 3.2vw, 15px)",
                  color: "#ffdfaf",
                  marginTop: "2px",
                  lineHeight: 1.45,
                }}
              >
                Chathiram, Madanagopalapuram, Tamil Nadu
              </span>
            </div>
          </div>

          {/* Google Maps Responsive Frame */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              width: "100%",
            }}
          >
            <iframe
              className="h-[267px] md:h-[380px] max-w-[338px] md:max-w-[560px]"
              style={{
                width: "100%",
                borderRadius: "15px",
                overflow: "hidden",
                border: "1px solid #f2c06e",
              }}
              src="https://maps.google.com/maps?q=Chinnaiyal+Pazhanisami+Mahal+Madanagopalapuram&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Chinnaiyal+Pazhanisami+Mahal+Madanagopalapuram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "9999px",
                padding: "8px 20px",
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                letterSpacing: "0.04em",
                fontWeight: 600,
                color: "#ffdfaf",
                backgroundColor: "rgba(242, 192, 110, 0.12)",
                border: "1px solid rgba(242, 192, 110, 0.35)",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
            >
              <svg
                style={{ width: "16px", height: "16px", flexShrink: 0 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span>Get directions</span>
            </a>
          </div>
        </div>

        {/* Bottom Golden Line Divider */}
        <img
          src="/assets/decorations/goldenline-decoration.webp"
          alt=""
          aria-hidden="true"
          style={{
            pointerEvents: "none",
            display: "block",
            margin: "calc(0.04 * var(--st-w)) auto 0",
            width: "calc(0.65986 * var(--st-w))",
            height: "auto",
            maxWidth: "none",
            objectFit: "contain",
          }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}

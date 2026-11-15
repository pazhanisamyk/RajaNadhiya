"use client";

export function DressCodeScheduleSection() {
  const scheduleItems = [
    {
      time: "11:00 AM",
      text: "Arrival of Families & Guests",
      icon: null,
    },
    {
      time: "11:30 AM",
      text: "Mangala Isai & Traditional Music",
      icon: null,
    },
    {
      time: "12:30 PM",
      text: "Seer Varisai Presentation",
      icon: null,
    },
    {
      time: "01:30 PM",
      text: "Sacred Muhurtham & Ring Exchange",
      icon: {
        src: "/assets/day-schedule/wreath.webp",
        widthMobile: "44px",
        widthDesktop: "56px",
      },
    },
    {
      time: "02:00 PM",
      text: "Grand Virundhu (Traditional Feast)",
      icon: {
        src: "/assets/day-schedule/swan.webp",
        widthMobile: "44px",
        widthDesktop: "56px",
      },
    },
    {
      time: "02:45 PM",
      text: "Family Photographs & Felicitations",
      icon: {
        src: "/assets/day-schedule/chair.webp",
        widthMobile: "52px",
        widthDesktop: "66px",
      },
    },
    {
      time: "03:30 PM",
      text: "Warm Send-off & Return Gifts",
      icon: null,
    },
    {
      time: "04:00 PM",
      text: "Concluding Aarthi & Blessings",
      icon: null,
    },
  ];

  return (
    <section
      id="schedule"
      aria-label="Dress Code and Schedule"
      style={{
        position: "relative",
        isolation: "isolate",
        width: "100%",
        marginTop: "calc(0.04 * var(--st-w))",
      }}
    >
      {/* 1. Dress Code Block with Kolam Accents */}
      <div
        style={{
          position: "relative",
          isolation: "isolate",
          width: "100%",
          paddingInline: "8.503%",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            pointerEvents: "none",
            position: "absolute",
            left: 0,
            right: 0,
            top: "32px",
            height: "36px",
            zIndex: 1,
          }}
        >
          <img
            src="/assets/decorations/kolam-decoration.webp"
            alt=""
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: "-11.224%",
              top: "50%",
              transform: "translateY(-50%)",
              width: "22.222%",
              height: "auto",
              maxWidth: "none",
              objectFit: "contain",
            }}
            loading="lazy"
            decoding="async"
          />
          <img
            src="/assets/decorations/kolam-decoration.webp"
            alt=""
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: "88.776%",
              top: "50%",
              transform: "translateY(-50%)",
              width: "22.222%",
              height: "auto",
              maxWidth: "none",
              objectFit: "contain",
            }}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div
          className="py-8 md:py-10"
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <h2
              className="text-[20px] md:text-[26px]"
              style={{
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                textTransform: "uppercase",
                fontWeight: 700,
                textAlign: "center",
                color: "#f2c06e",
                letterSpacing: "0.06em",
                margin: 0,
              }}
            >
              DRESS CODE
            </h2>
            <p
              className="text-[13px] md:text-[16px] font-serif italic"
              style={{ color: "#ffdfaf", margin: 0 }}
            >
              Traditional / Ethnic Festive Attire
            </p>
          </div>

          {/* Color Palette Swatches */}
          <div
            className="gap-4 md:gap-6"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "4px",
            }}
          >
            <div
              className="w-10 h-10 md:w-12 md:h-12 shadow-md"
              style={{ backgroundColor: "#651212", borderRadius: "50%" }}
              title="Royal Maroon"
            />
            <div
              className="w-10 h-10 md:w-12 md:h-12 shadow-md"
              style={{ backgroundColor: "#8d3a3a", borderRadius: "50%" }}
              title="Wine"
            />
            <div
              className="w-10 h-10 md:w-12 md:h-12 shadow-md"
              style={{
                backgroundColor: "#f2c06e",
                borderRadius: "50%",
                border: "1.5px solid rgba(242, 192, 110, 0.4)",
              }}
              title="Auspicious Gold"
            />
            <div
              className="w-10 h-10 md:w-12 md:h-12 shadow-md"
              style={{
                backgroundColor: "#ffdfaf",
                borderRadius: "50%",
                border: "1.5px solid rgba(242, 192, 110, 0.3)",
              }}
              title="Cream Gold"
            />
          </div>
        </div>
      </div>

      {/* 2. Engagement Day Schedule Timeline */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "28px",
          paddingInline: "4%",
        }}
      >
        <h2
          className="text-[20px] md:text-[26px]"
          style={{
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            textTransform: "uppercase",
            fontWeight: 700,
            textAlign: "center",
            color: "#f2c06e",
            letterSpacing: "0.06em",
            marginBottom: "32px",
          }}
        >
          ENGAGEMENT DAY SCHEDULE
        </h2>

        {/* 50/50 Centered Timeline */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          {/* Continuous Vertical Connecting Line */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: "16px",
              bottom: "16px",
              width: "1px",
              backgroundColor: "rgba(242, 192, 110, 0.4)",
              zIndex: 0,
            }}
          />

          {scheduleItems.map((item) => (
            <div
              key={item.time}
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                width: "100%",
                minHeight: "40px",
              }}
            >
              {/* Left Column (50%): Dedicated Icon Space & Time */}
              <div
                style={{
                  flex: "1 1 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: "16px",
                  position: "relative",
                }}
              >
                {/* Floating Icon cleanly framed on the left */}
                {item.icon && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "50px",
                    }}
                  >
                    <img
                      src={item.icon.src}
                      alt=""
                      aria-hidden="true"
                      style={{
                        width: item.icon.widthMobile,
                        height: "auto",
                        maxWidth: "none",
                        objectFit: "contain",
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <span
                  style={{
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    fontSize: "clamp(13px, 3.4vw, 15px)",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: "#f2c06e",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.time}
                </span>
              </div>

              {/* Center Column: Golden Dot */}
              <div
                aria-hidden="true"
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  backgroundColor: "#f2c06e",
                  boxShadow: "0 0 0 2px rgba(242, 192, 110, 0.25)",
                  flexShrink: 0,
                  zIndex: 2,
                }}
              />

              {/* Right Column (50%): Event Text in Serif */}
              <div
                style={{
                  flex: "1 1 0",
                  paddingLeft: "16px",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    fontSize: "clamp(13px, 3.4vw, 15px)",
                    fontWeight: 400,
                    lineHeight: 1.35,
                    color: "#f2c06e",
                    display: "block",
                  }}
                >
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

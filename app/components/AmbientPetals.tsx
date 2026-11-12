"use client";

type PetalKind = "rose" | "blush" | "ivory" | "gold" | "blossom";

interface ShowerParticle {
  left: string;
  delay: string;
  duration: string;
  size: number;
  kind: PetalKind;
  sway: "left" | "right";
  flutterDuration: string;
  desktopOnly?: boolean;
}

const SHOWER_PARTICLES: ShowerParticle[] = [
  { left: "5%", delay: "-1.5s", duration: "14s", size: 18, kind: "rose", sway: "right", flutterDuration: "3.5s" },
  { left: "13%", delay: "-7.2s", duration: "16.5s", size: 17, kind: "blossom", sway: "left", flutterDuration: "4.2s", desktopOnly: true },
  { left: "21%", delay: "-4.0s", duration: "15s", size: 15, kind: "blush", sway: "right", flutterDuration: "3.1s" },
  { left: "30%", delay: "-11.4s", duration: "17.5s", size: 18, kind: "ivory", sway: "left", flutterDuration: "4.4s", desktopOnly: true },
  { left: "39%", delay: "-2.8s", duration: "13.5s", size: 14, kind: "gold", sway: "right", flutterDuration: "3.0s" },
  { left: "48%", delay: "-8.9s", duration: "16s", size: 20, kind: "blossom", sway: "left", flutterDuration: "4.6s" },
  { left: "58%", delay: "-5.3s", duration: "14.5s", size: 16, kind: "rose", sway: "right", flutterDuration: "3.3s", desktopOnly: true },
  { left: "67%", delay: "-10.5s", duration: "17s", size: 15, kind: "blush", sway: "left", flutterDuration: "3.8s" },
  { left: "76%", delay: "-1.9s", duration: "14s", size: 19, kind: "blossom", sway: "right", flutterDuration: "4.3s", desktopOnly: true },
  { left: "84%", delay: "-9.4s", duration: "16.2s", size: 16, kind: "ivory", sway: "left", flutterDuration: "3.4s" },
  { left: "92%", delay: "-4.6s", duration: "14.8s", size: 15, kind: "gold", sway: "right", flutterDuration: "3.2s" },
  { left: "44%", delay: "-13.5s", duration: "18s", size: 17, kind: "rose", sway: "left", flutterDuration: "4.0s", desktopOnly: true },
];

const PETAL_COLORS: Record<Exclude<PetalKind, "blossom">, { fill: string; vein: string }> = {
  rose: { fill: "#e38c96", vein: "#c26270" },
  blush: { fill: "#f4b9bf", vein: "#df919a" },
  ivory: { fill: "#fff2df", vein: "#e8cdb0" },
  gold: { fill: "#e4bd75", vein: "#c29342" },
};

export function PetalShape({ kind }: { kind: PetalKind }) {
  if (kind === "blossom") {
    return (
      <svg viewBox="0 0 32 32" className="petal-svg" fill="none">
        <g>
          <path
            d="M16 3C18.5 3 20.5 7 18.5 12C17.2 14.5 14.8 14.5 13.5 12C11.5 7 13.5 3 16 3Z"
            fill="#f7c8cd"
          />
          <path
            d="M28.4 12C29.2 14.4 26 17.6 20.6 17.2C17.8 17 17 14.7 18.8 12.6C22.4 8.5 27.6 9.6 28.4 12Z"
            fill="#f3b6bd"
          />
          <path
            d="M23.7 26.6C21.7 28 17.6 26 16.3 20.8C15.6 18 17.4 16.4 20 17.4C25 19.3 25.7 25.1 23.7 26.6Z"
            fill="#f7c8cd"
          />
          <path
            d="M8.3 26.6C6.3 25.1 7 19.3 12 17.4C14.6 16.4 16.4 18 15.7 20.8C14.4 26 10.3 28 8.3 26.6Z"
            fill="#f3b6bd"
          />
          <path
            d="M3.6 12C4.4 9.6 9.6 8.5 13.2 12.6C15 14.7 14.2 17 11.4 17.2C6 17.6 2.8 14.4 3.6 12Z"
            fill="#fae0d8"
          />
          <circle cx="16" cy="15.8" r="3.1" fill="#d9a54c" />
          <circle cx="16" cy="15.8" r="1.4" fill="#fff4d6" />
        </g>
      </svg>
    );
  }

  const palette = PETAL_COLORS[kind];

  return (
    <svg viewBox="0 0 24 28" className="petal-svg" fill="none">
      <path
        d="M12 2C17.5 4.2 21.5 10.2 20.2 16.8C19 22.8 14.5 26 11.8 26.2C9.1 26 4.4 22.4 3.6 16.3C2.8 10.1 6.7 4.2 12 2Z"
        fill={palette.fill}
      />
      <path
        d="M12 5.5C12.3 11 12.1 17.5 11.8 23.5"
        stroke={palette.vein}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
    </svg>
  );
}

export function AmbientPetals() {
  return (
    <div className="ambient-layer" aria-hidden="true">
      {SHOWER_PARTICLES.map((item, idx) => (
        <span
          key={idx}
          className={`shower-item shower-sway-${item.sway} ${item.desktopOnly ? "shower-desktop-only" : ""}`.trim()}
          style={{
            left: item.left,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          <span
            className="shower-flutter"
            style={{ animationDuration: item.flutterDuration }}
          >
            <PetalShape kind={item.kind} />
          </span>
        </span>
      ))}
    </div>
  );
}

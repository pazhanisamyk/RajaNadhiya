"use client";

import { useEffect, useRef, useState } from "react";

interface InvitationCoverProps {
  groom?: string;
  bride?: string;
  dateDisplay?: string;
  onOpen?: () => void;
}

// 48 Celebratory flower shower particles for the ceremonial reveal
interface CelebrationParticle {
  id: number;
  left: number; // percentage (0 - 100)
  size: number; // px (12 - 28)
  delay: number; // seconds (0 - 0.5)
  duration: number; // seconds (1.4 - 2.5)
  type: "jasmine" | "marigold" | "rose" | "sparkle" | "goldPetal";
  swayType: "sway-left" | "sway-right";
  spinDuration: number;
}

const CELEBRATION_PARTICLES: CelebrationParticle[] = [
  { id: 1, left: 3, size: 20, delay: 0.05, duration: 1.8, type: "marigold", swayType: "sway-right", spinDuration: 2.1 },
  { id: 2, left: 8, size: 16, delay: 0.18, duration: 2.1, type: "jasmine", swayType: "sway-left", spinDuration: 2.5 },
  { id: 3, left: 14, size: 14, delay: 0.02, duration: 1.7, type: "sparkle", swayType: "sway-right", spinDuration: 1.8 },
  { id: 4, left: 19, size: 24, delay: 0.25, duration: 2.0, type: "marigold", swayType: "sway-left", spinDuration: 2.3 },
  { id: 5, left: 25, size: 18, delay: 0.12, duration: 1.9, type: "rose", swayType: "sway-right", spinDuration: 2.2 },
  { id: 6, left: 31, size: 22, delay: 0.30, duration: 2.2, type: "jasmine", swayType: "sway-left", spinDuration: 2.6 },
  { id: 7, left: 37, size: 16, delay: 0.08, duration: 1.6, type: "goldPetal", swayType: "sway-right", spinDuration: 1.9 },
  { id: 8, left: 42, size: 26, delay: 0.22, duration: 2.1, type: "marigold", swayType: "sway-left", spinDuration: 2.4 },
  { id: 9, left: 48, size: 15, delay: 0.04, duration: 1.8, type: "sparkle", swayType: "sway-right", spinDuration: 1.7 },
  { id: 10, left: 54, size: 20, delay: 0.16, duration: 1.9, type: "jasmine", swayType: "sway-left", spinDuration: 2.2 },
  { id: 11, left: 60, size: 22, delay: 0.28, duration: 2.0, type: "rose", swayType: "sway-right", spinDuration: 2.5 },
  { id: 12, left: 66, size: 18, delay: 0.10, duration: 1.7, type: "goldPetal", swayType: "sway-left", spinDuration: 2.0 },
  { id: 13, left: 72, size: 24, delay: 0.24, duration: 2.2, type: "marigold", swayType: "sway-right", spinDuration: 2.4 },
  { id: 14, left: 78, size: 16, delay: 0.06, duration: 1.8, type: "jasmine", swayType: "sway-left", spinDuration: 2.1 },
  { id: 15, left: 84, size: 14, delay: 0.32, duration: 2.0, type: "sparkle", swayType: "sway-right", spinDuration: 1.9 },
  { id: 16, left: 91, size: 22, delay: 0.14, duration: 1.9, type: "rose", swayType: "sway-left", spinDuration: 2.3 },
  { id: 17, left: 96, size: 18, delay: 0.20, duration: 2.1, type: "marigold", swayType: "sway-right", spinDuration: 2.5 },
  // Second wave staggered
  { id: 18, left: 5, size: 18, delay: 0.35, duration: 2.0, type: "jasmine", swayType: "sway-left", spinDuration: 2.2 },
  { id: 19, left: 11, size: 22, delay: 0.42, duration: 2.2, type: "goldPetal", swayType: "sway-right", spinDuration: 2.6 },
  { id: 20, left: 17, size: 15, delay: 0.38, duration: 1.8, type: "sparkle", swayType: "sway-left", spinDuration: 1.9 },
  { id: 21, left: 23, size: 25, delay: 0.45, duration: 2.1, type: "marigold", swayType: "sway-right", spinDuration: 2.4 },
  { id: 22, left: 29, size: 16, delay: 0.36, duration: 1.9, type: "rose", swayType: "sway-left", spinDuration: 2.1 },
  { id: 23, left: 35, size: 20, delay: 0.48, duration: 2.3, type: "jasmine", swayType: "sway-right", spinDuration: 2.5 },
  { id: 24, left: 45, size: 24, delay: 0.40, duration: 2.0, type: "marigold", swayType: "sway-left", spinDuration: 2.3 },
  { id: 25, left: 51, size: 18, delay: 0.34, duration: 1.7, type: "goldPetal", swayType: "sway-right", spinDuration: 2.0 },
  { id: 26, left: 57, size: 14, delay: 0.46, duration: 2.1, type: "sparkle", swayType: "sway-left", spinDuration: 1.8 },
  { id: 27, left: 63, size: 22, delay: 0.39, duration: 2.2, type: "rose", swayType: "sway-right", spinDuration: 2.5 },
  { id: 28, left: 69, size: 19, delay: 0.44, duration: 1.9, type: "jasmine", swayType: "sway-left", spinDuration: 2.2 },
  { id: 29, left: 75, size: 25, delay: 0.37, duration: 2.3, type: "marigold", swayType: "sway-right", spinDuration: 2.6 },
  { id: 30, left: 81, size: 16, delay: 0.49, duration: 2.0, type: "goldPetal", swayType: "sway-left", spinDuration: 2.1 },
  { id: 31, left: 88, size: 20, delay: 0.41, duration: 1.8, type: "rose", swayType: "sway-right", spinDuration: 2.3 },
  { id: 32, left: 94, size: 17, delay: 0.47, duration: 2.2, type: "jasmine", swayType: "sway-left", spinDuration: 2.4 },
  // Center celebration cluster
  { id: 33, left: 40, size: 24, delay: 0.15, duration: 1.8, type: "marigold", swayType: "sway-right", spinDuration: 2.2 },
  { id: 34, left: 44, size: 18, delay: 0.26, duration: 2.0, type: "jasmine", swayType: "sway-left", spinDuration: 2.4 },
  { id: 35, left: 49, size: 22, delay: 0.11, duration: 1.7, type: "rose", swayType: "sway-right", spinDuration: 2.0 },
  { id: 36, left: 53, size: 25, delay: 0.29, duration: 2.1, type: "marigold", swayType: "sway-left", spinDuration: 2.5 },
  { id: 37, left: 47, size: 16, delay: 0.08, duration: 1.6, type: "sparkle", swayType: "sway-right", spinDuration: 1.8 },
  { id: 38, left: 52, size: 20, delay: 0.20, duration: 1.9, type: "goldPetal", swayType: "sway-left", spinDuration: 2.3 },
];

interface ExplosionParticle {
  id: number;
  tx: number; // target X offset in px from origin
  ty: number; // target Y offset in px from origin
  fallY: number; // gravity pull downwards in px
  driftX: number; // wind drift X in px
  size: number; // size in px (14 - 30)
  rot: number; // rotation in deg (e.g. 240 - 720)
  delay: number; // seconds (0 - 0.12)
  duration: number; // seconds (1.1 - 1.6)
  scale: number; // peak scale (0.9 - 1.3)
  type: "jasmine" | "marigold" | "rose" | "sparkle" | "goldPetal";
}

const EXPLOSION_PARTICLES: ExplosionParticle[] = [
  // --- UPWARD & HIGH ARC BURST (shooting up across the card & couple names) ---
  { id: 1, tx: -30, ty: -280, fallY: 140, driftX: -20, size: 24, rot: 360, delay: 0.00, duration: 1.35, scale: 1.15, type: "marigold" },
  { id: 2, tx: 25, ty: -310, fallY: 150, driftX: 25, size: 20, rot: -420, delay: 0.02, duration: 1.40, scale: 1.1, type: "jasmine" },
  { id: 3, tx: -80, ty: -240, fallY: 120, driftX: -30, size: 22, rot: 280, delay: 0.03, duration: 1.30, scale: 1.2, type: "rose" },
  { id: 4, tx: 75, ty: -250, fallY: 130, driftX: 35, size: 18, rot: -340, delay: 0.01, duration: 1.28, scale: 1.05, type: "goldPetal" },
  { id: 5, tx: 0, ty: -360, fallY: 170, driftX: 10, size: 26, rot: 540, delay: 0.04, duration: 1.45, scale: 1.25, type: "marigold" },
  { id: 6, tx: -120, ty: -200, fallY: 110, driftX: -40, size: 16, rot: -300, delay: 0.02, duration: 1.25, scale: 1.1, type: "sparkle" },
  { id: 7, tx: 110, ty: -210, fallY: 115, driftX: 40, size: 16, rot: 320, delay: 0.03, duration: 1.25, scale: 1.1, type: "sparkle" },
  { id: 8, tx: -50, ty: -180, fallY: 90, driftX: -15, size: 22, rot: 250, delay: 0.05, duration: 1.20, scale: 1.0, type: "jasmine" },
  { id: 9, tx: 45, ty: -175, fallY: 95, driftX: 20, size: 24, rot: -260, delay: 0.04, duration: 1.20, scale: 1.1, type: "rose" },

  // --- UPPER-LEFT & UPPER-RIGHT WIDE BURST ---
  { id: 10, tx: -180, ty: -220, fallY: 130, driftX: -35, size: 26, rot: 480, delay: 0.01, duration: 1.35, scale: 1.2, type: "marigold" },
  { id: 11, tx: 185, ty: -215, fallY: 125, driftX: 30, size: 22, rot: -440, delay: 0.02, duration: 1.35, scale: 1.15, type: "rose" },
  { id: 12, tx: -230, ty: -160, fallY: 110, driftX: -25, size: 20, rot: 360, delay: 0.03, duration: 1.30, scale: 1.1, type: "goldPetal" },
  { id: 13, tx: 235, ty: -155, fallY: 105, driftX: 25, size: 20, rot: -380, delay: 0.02, duration: 1.30, scale: 1.1, type: "jasmine" },
  { id: 14, tx: -150, ty: -130, fallY: 85, driftX: -20, size: 15, rot: 270, delay: 0.06, duration: 1.15, scale: 1.0, type: "sparkle" },
  { id: 15, tx: 155, ty: -125, fallY: 80, driftX: 20, size: 15, rot: -290, delay: 0.05, duration: 1.15, scale: 1.0, type: "sparkle" },
  { id: 16, tx: -290, ty: -190, fallY: 140, driftX: -30, size: 22, rot: 520, delay: 0.04, duration: 1.45, scale: 1.15, type: "rose" },
  { id: 17, tx: 295, ty: -185, fallY: 135, driftX: 30, size: 25, rot: -500, delay: 0.03, duration: 1.45, scale: 1.2, type: "marigold" },

  // --- HORIZONTAL LEFT & RIGHT OUTWARD EXPLOSION ---
  { id: 18, tx: -220, ty: -40, fallY: 90, driftX: -25, size: 24, rot: 400, delay: 0.01, duration: 1.25, scale: 1.15, type: "marigold" },
  { id: 19, tx: 225, ty: -35, fallY: 85, driftX: 25, size: 22, rot: -420, delay: 0.02, duration: 1.25, scale: 1.1, type: "jasmine" },
  { id: 20, tx: -310, ty: 10, fallY: 100, driftX: -20, size: 20, rot: 500, delay: 0.03, duration: 1.40, scale: 1.1, type: "rose" },
  { id: 21, tx: 315, ty: 15, fallY: 95, driftX: 20, size: 20, rot: -480, delay: 0.02, duration: 1.40, scale: 1.1, type: "goldPetal" },
  { id: 22, tx: -140, ty: -10, fallY: 70, driftX: -15, size: 16, rot: 280, delay: 0.05, duration: 1.10, scale: 1.0, type: "sparkle" },
  { id: 23, tx: 145, ty: -5, fallY: 65, driftX: 15, size: 16, rot: -260, delay: 0.04, duration: 1.10, scale: 1.0, type: "sparkle" },
  { id: 24, tx: -260, ty: 45, fallY: 110, driftX: -30, size: 25, rot: 460, delay: 0.03, duration: 1.35, scale: 1.2, type: "marigold" },
  { id: 25, tx: 265, ty: 40, fallY: 105, driftX: 30, size: 22, rot: -440, delay: 0.04, duration: 1.35, scale: 1.15, type: "jasmine" },

  // --- LOWER-LEFT & LOWER-RIGHT BURST ---
  { id: 26, tx: -190, ty: 120, fallY: 130, driftX: -20, size: 22, rot: 380, delay: 0.02, duration: 1.25, scale: 1.1, type: "goldPetal" },
  { id: 27, tx: 195, ty: 125, fallY: 125, driftX: 20, size: 24, rot: -360, delay: 0.03, duration: 1.25, scale: 1.15, type: "rose" },
  { id: 28, tx: -240, ty: 170, fallY: 150, driftX: -25, size: 25, rot: 450, delay: 0.04, duration: 1.35, scale: 1.2, type: "marigold" },
  { id: 29, tx: 245, ty: 165, fallY: 145, driftX: 25, size: 20, rot: -430, delay: 0.03, duration: 1.35, scale: 1.05, type: "jasmine" },
  { id: 30, tx: -110, ty: 95, fallY: 85, driftX: -15, size: 15, rot: 240, delay: 0.06, duration: 1.10, scale: 1.0, type: "sparkle" },
  { id: 31, tx: 115, ty: 90, fallY: 80, driftX: 15, size: 15, rot: -250, delay: 0.05, duration: 1.10, scale: 1.0, type: "sparkle" },
  { id: 32, tx: -160, ty: 190, fallY: 140, driftX: -20, size: 22, rot: 340, delay: 0.04, duration: 1.30, scale: 1.1, type: "rose" },
  { id: 33, tx: 165, ty: 185, fallY: 135, driftX: 20, size: 22, rot: -350, delay: 0.03, duration: 1.30, scale: 1.1, type: "goldPetal" },

  // --- DOWNWARD CASCADE BURST ---
  { id: 34, tx: -45, ty: 210, fallY: 160, driftX: -15, size: 26, rot: 420, delay: 0.02, duration: 1.30, scale: 1.2, type: "marigold" },
  { id: 35, tx: 40, ty: 215, fallY: 155, driftX: 15, size: 22, rot: -400, delay: 0.03, duration: 1.30, scale: 1.15, type: "jasmine" },
  { id: 36, tx: -85, ty: 250, fallY: 180, driftX: -20, size: 20, rot: 360, delay: 0.04, duration: 1.35, scale: 1.1, type: "rose" },
  { id: 37, tx: 80, ty: 255, fallY: 175, driftX: 20, size: 20, rot: -370, delay: 0.03, duration: 1.35, scale: 1.1, type: "goldPetal" },
  { id: 38, tx: 0, ty: 280, fallY: 190, driftX: 5, size: 25, rot: 480, delay: 0.04, duration: 1.40, scale: 1.2, type: "marigold" },
  { id: 39, tx: -20, ty: 140, fallY: 90, driftX: -10, size: 16, rot: 220, delay: 0.06, duration: 1.15, scale: 1.0, type: "sparkle" },
  { id: 40, tx: 25, ty: 145, fallY: 95, driftX: 10, size: 16, rot: -230, delay: 0.05, duration: 1.15, scale: 1.0, type: "sparkle" },

  // --- CLOSE-IN POP BLOOMS (Right around the button perimeter) ---
  { id: 41, tx: -55, ty: -70, fallY: 60, driftX: -10, size: 22, rot: 280, delay: 0.01, duration: 1.10, scale: 1.15, type: "jasmine" },
  { id: 42, tx: 60, ty: -65, fallY: 65, driftX: 10, size: 24, rot: -290, delay: 0.02, duration: 1.10, scale: 1.2, type: "marigold" },
  { id: 43, tx: -75, ty: 25, fallY: 55, driftX: -10, size: 20, rot: 240, delay: 0.02, duration: 1.05, scale: 1.05, type: "rose" },
  { id: 44, tx: 70, ty: 30, fallY: 50, driftX: 10, size: 20, rot: -250, delay: 0.01, duration: 1.05, scale: 1.05, type: "goldPetal" },
  { id: 45, tx: -40, ty: 75, fallY: 70, driftX: -8, size: 22, rot: 310, delay: 0.03, duration: 1.12, scale: 1.1, type: "marigold" },
  { id: 46, tx: 35, ty: 70, fallY: 75, driftX: 8, size: 20, rot: -300, delay: 0.02, duration: 1.12, scale: 1.1, type: "jasmine" },
  { id: 47, tx: 0, ty: -100, fallY: 80, driftX: 0, size: 18, rot: 360, delay: 0.01, duration: 1.15, scale: 1.1, type: "sparkle" },
  { id: 48, tx: 0, ty: 90, fallY: 85, driftX: 0, size: 18, rot: -360, delay: 0.02, duration: 1.15, scale: 1.1, type: "sparkle" },
];

function FlowerParticleItem({ p }: { p: { type: string; size: number } }) {
  if (p.type === "sparkle") {
    return (
      <span
        style={{
          color: "#f2c06e",
          fontSize: `${p.size}px`,
          lineHeight: 1,
          display: "inline-block",
          filter: "drop-shadow(0 0 6px rgba(242, 192, 110, 0.8))",
        }}
      >
        ✦
      </span>
    );
  }

  if (p.type === "jasmine") {
    return (
      <svg
        viewBox="0 0 24 24"
        width={p.size}
        height={p.size}
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
      >
        <g fill="#fffdf5">
          <circle cx="12" cy="12" r="3" fill="#ffe082" />
          <path d="M12 2C13.5 5 13.5 7 12 9C10.5 7 10.5 5 12 2Z" />
          <path d="M22 12C19 13.5 17 13.5 15 12C17 10.5 19 10.5 22 12Z" />
          <path d="M12 22C10.5 19 10.5 17 12 15C13.5 17 13.5 19 12 22Z" />
          <path d="M2 12C5 10.5 7 10.5 9 12C7 13.5 5 13.5 2 12Z" />
          <path d="M19.07 4.93C17.5 7.5 16 8.5 14.12 7.88C15.5 6 16.5 4.5 19.07 4.93Z" />
          <path d="M19.07 19.07C16.5 17.5 15.5 16 16.12 14.12C18 15.5 19.5 16.5 19.07 19.07Z" />
          <path d="M4.93 19.07C7.5 17.5 8.5 16 7.88 14.12C6 15.5 4.5 16.5 4.93 19.07Z" />
          <path d="M4.93 4.93C6.5 7.5 8 8.5 9.88 7.88C8.5 6 7.5 4.5 4.93 4.93Z" />
        </g>
      </svg>
    );
  }

  if (p.type === "marigold") {
    return (
      <svg
        viewBox="0 0 24 24"
        width={p.size}
        height={p.size}
        style={{ filter: "drop-shadow(0 2px 6px rgba(242, 192, 110, 0.5))" }}
      >
        <circle cx="12" cy="12" r="3.2" fill="#d97706" />
        <path
          d="M12 1.5C13.2 4.5 13.2 6.5 12 8C10.8 6.5 10.8 4.5 12 1.5Z"
          fill="#f59e0b"
        />
        <path
          d="M19.4 4.6C18.6 7.8 17 9.2 15.2 8.8C16.2 7 17.2 5.5 19.4 4.6Z"
          fill="#f2c06e"
        />
        <path
          d="M22.5 12C19.5 13.2 17.5 13.2 16 12C17.5 10.8 19.5 10.8 22.5 12Z"
          fill="#f59e0b"
        />
        <path
          d="M19.4 19.4C16.2 18.6 14.8 17 15.2 15.2C17 16.2 18.5 17.2 19.4 19.4Z"
          fill="#f2c06e"
        />
        <path
          d="M12 22.5C10.8 19.5 10.8 17.5 12 16C13.2 17.5 13.2 19.5 12 22.5Z"
          fill="#f59e0b"
        />
        <path
          d="M4.6 19.4C5.4 16.2 7 14.8 8.8 15.2C7.8 17 6.8 18.5 4.6 19.4Z"
          fill="#f2c06e"
        />
        <path
          d="M1.5 12C4.5 10.8 6.5 10.8 8 12C6.5 13.2 4.5 13.2 1.5 12Z"
          fill="#f59e0b"
        />
        <path
          d="M4.6 4.6C7.8 5.4 9.2 7 8.8 8.8C7 7.8 5.5 6.8 4.6 4.6Z"
          fill="#f2c06e"
        />
      </svg>
    );
  }

  if (p.type === "rose") {
    return (
      <svg
        viewBox="0 0 24 24"
        width={p.size}
        height={p.size}
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
      >
        <path
          d="M12 2C15.5 2 19 6.5 18 12C17 17.5 12 22 12 22C12 22 7 17.5 6 12C5 6.5 8.5 2 12 2Z"
          fill="#f48fb1"
          opacity="0.88"
        />
        <path
          d="M12 4C14.5 4 16.5 7.5 15.8 11.5C15 15.5 12 18 12 18C12 18 9 15.5 8.2 11.5C7.5 7.5 9.5 4 12 4Z"
          fill="#f8bbd0"
          opacity="0.95"
        />
      </svg>
    );
  }

  // goldPetal
  return (
    <svg
      viewBox="0 0 24 24"
      width={p.size}
      height={p.size}
      style={{ filter: "drop-shadow(0 2px 5px rgba(242, 192, 110, 0.6))" }}
    >
      <path
        d="M12 2C16 4 19 8 18 13C17 18 12 22 12 22C12 22 7 18 6 13C5 8 8 4 12 2Z"
        fill="#f2c06e"
        opacity="0.92"
      />
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke="#ffd580"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

export function InvitationCover({
  groom = "Krishnaraja",
  bride = "Nadhiya",
  dateDisplay = "Sunday, 22 November 2026",
  onOpen,
}: InvitationCoverProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [overlayFading, setOverlayFading] = useState(false);
  const [showCelebrationShower, setShowCelebrationShower] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hasTriggeredRef = useRef(false);

  // Disable browser auto-scroll restoration on reload & ensure page starts at top
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  // Lock background scroll completely while cover is active & support keyboard reveal
  useEffect(() => {
    if (isDismissed) return;

    // Reset scroll to top before locking overflow
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        handleOpen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDismissed]);

  const handleOpen = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (hasTriggeredRef.current || isExiting || isDismissed) return;
    hasTriggeredRef.current = true;

    // Ensure scroll is at the very top (Hero section) immediately upon opening
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.getElementById("top")?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    }

    // 1. Immediately trigger music on user interaction
    try {
      onOpen?.();
    } catch (err) {
      console.error("[InvitationCover] onOpen error:", err);
    }

    // 2. Capture Open button center position for the explosive flower burst
    let ox = typeof window !== "undefined" ? window.innerWidth / 2 : 200;
    let oy = typeof window !== "undefined" ? window.innerHeight * 0.65 : 400;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      ox = rect.left + rect.width / 2;
      oy = rect.top + rect.height / 2;
    }
    setBurstOrigin({ x: ox, y: oy });

    // 3. Start exit sequence: triggers staggered disappearing animations & flower explosion
    setIsExiting(true);
    setShowCelebrationShower(true);

    // 4. Stagger overlay fade: smoothly unveils website while petals are flying across the screen
    window.setTimeout(() => {
      setOverlayFading(true);
    }, 450);

    // 5. Complete dismissal and unmount after animation settles
    window.setTimeout(() => {
      setIsDismissed(true);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        document.getElementById("top")?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
      }
    }, 1450);
  };

  if (isDismissed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Invitation Cover"
      className={`invitation-cover-overlay ${overlayFading ? "overlay-fading" : ""}`}
      onClick={handleOpen}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#4a0305",
        background: "radial-gradient(circle at 50% 35%, #5e0508 0%, #360103 100%)",
        opacity: overlayFading ? 0 : 1,
        transition: "opacity 0.45s ease",
        pointerEvents: isExiting ? "none" : "auto",
        touchAction: "manipulation",
        cursor: isExiting ? "default" : "pointer",
      }}
    >
      {/* 1. Background Temple Pillars on Left & Right Sides */}
      <div
        aria-hidden="true"
        className={isExiting ? "cover-exit-pillars" : ""}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          overflow: "hidden",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          opacity: overlayFading ? 0.2 : 1,
        }}
      >
        {/* Left Background Pillar (Mirrored) */}
        <img
          src="/assets/decorations/column-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            left: "-4%",
            top: "-5%",
            height: "115%",
            width: "auto",
            maxWidth: "38vw",
            objectFit: "contain",
            transform: "scaleX(-1)",
            opacity: 0.22,
            filter: "brightness(0.9)",
          }}
          loading="eager"
          decoding="async"
        />

        {/* Right Background Pillar */}
        <img
          src="/assets/decorations/column-decoration.webp"
          alt=""
          style={{
            position: "absolute",
            right: "-4%",
            top: "-5%",
            height: "115%",
            width: "auto",
            maxWidth: "38vw",
            objectFit: "contain",
            opacity: 0.22,
            filter: "brightness(0.9)",
          }}
          loading="eager"
          decoding="async"
        />

        {/* Ambient Subtle Petals (Idle state) */}
        {!showCelebrationShower && (
          <div className="cover-ambient-petals">
            <span className="cover-petal p-1">🌸</span>
            <span className="cover-petal p-2">✿</span>
            <span className="cover-petal p-3">🌸</span>
            <span className="cover-petal p-4">✿</span>
            <span className="cover-petal p-5">🌸</span>
            <span className="cover-petal p-6">✿</span>
          </div>
        )}
      </div>

      {/* 2a. Celebration Flower Shower (Upper Falling Cascade) */}
      {showCelebrationShower && (
        <div
          className="cover-celebration-shower"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 25,
            overflow: "hidden",
          }}
        >
          {CELEBRATION_PARTICLES.map((p) => (
            <div
              key={p.id}
              className={`celebration-flower-item ${p.swayType}`}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: "-40px",
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                animationFillMode: "forwards",
              }}
            >
              <div
                style={{
                  animation: `flowerSpin ${p.spinDuration}s linear infinite`,
                  display: "inline-block",
                }}
              >
                <FlowerParticleItem p={p} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2b. Explosive Flower & Petal Burst Originating from the Open Button */}
      {burstOrigin && (
        <div
          className="cover-flower-explosion-container"
          aria-hidden="true"
          style={{
            position: "fixed",
            left: `${burstOrigin.x}px`,
            top: `${burstOrigin.y}px`,
            width: 0,
            height: 0,
            pointerEvents: "none",
            zIndex: 999999,
          }}
        >
          {/* Shockwave Rings */}
          <div className="cover-shockwave ring-1" />
          <div className="cover-shockwave ring-2" />
          <div className="cover-burst-flash" />

          {/* Exploding Flower & Petal Particles radiating outward from Open button */}
          {EXPLOSION_PARTICLES.map((p) => (
            <div
              key={p.id}
              className="cover-explode-particle"
              style={
                {
                  "--tx": `${p.tx}px`,
                  "--ty": `${p.ty}px`,
                  "--fall-y": `${p.fallY}px`,
                  "--drift-x": `${p.driftX}px`,
                  "--target-scale": p.scale,
                  "--rot": `${p.rot}deg`,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties
              }
            >
              <div
                style={{
                  display: "inline-block",
                  animation: `flowerSpin ${p.duration * 0.9}s linear infinite`,
                }}
              >
                <FlowerParticleItem p={p} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Central Royal Invitation Card */}
      <div
        className={`invitation-cover-card ${isExiting ? "cover-exit-card" : ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        aria-label="Open wedding invitation"
        style={{
          position: "relative",
          zIndex: 10,
          width: "min(88vw, 360px)",
          borderRadius: "16px",
          backgroundColor: "#6b0508",
          border: "1px solid rgba(242, 192, 110, 0.3)",
          boxShadow:
            "0 25px 65px -10px rgba(0, 0, 0, 0.85), 0 0 50px rgba(242, 192, 110, 0.16)",
          padding: "36px 24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          overflow: "hidden",
          cursor: isExiting ? "default" : "pointer",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Inner Card Framing Pillars (Watermark Accents) */}
        <img
          src="/assets/decorations/column-decoration.webp"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-18px",
            top: "-10%",
            height: "125%",
            width: "auto",
            transform: "scaleX(-1)",
            opacity: 0.16,
            pointerEvents: "none",
            zIndex: 0,
          }}
          loading="eager"
          decoding="async"
        />
        <img
          src="/assets/decorations/column-decoration.webp"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-18px",
            top: "-10%",
            height: "125%",
            width: "auto",
            opacity: 0.16,
            pointerEvents: "none",
            zIndex: 0,
          }}
          loading="eager"
          decoding="async"
        />

        {/* Card Content (Relative z-10) */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Golden Seal with Heart */}
          <div
            className={`cover-seal-pulse ${isExiting ? "cover-exit-seal" : ""}`}
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            aria-label="Open wedding invitation"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 35%, #f2c06e 0%, #d4a250 100%)",
              boxShadow:
                "0 4px 20px rgba(242, 192, 110, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              cursor: isExiting ? "default" : "pointer",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{
                width: "24px",
                height: "24px",
                fill: "#764c4d",
              }}
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Couple Names */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#f2c06e",
              lineHeight: 1.2,
              margin: "0 0 4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span
              className={isExiting ? "cover-exit-groom" : ""}
              style={{
                fontSize: "30px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                display: "inline-block",
              }}
            >
              {groom}
            </span>
            <span
              className={isExiting ? "cover-exit-amp" : ""}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "20px",
                margin: "2px 0",
                color: "#f2c06e",
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              &amp;
            </span>
            <span
              className={isExiting ? "cover-exit-bride" : ""}
              style={{
                fontSize: "30px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                display: "inline-block",
              }}
            >
              {bride}
            </span>
          </h1>

          {/* Symmetrical Ornamental Divider */}
          <div
            className={isExiting ? "cover-exit-divider" : ""}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              margin: "12px 0 16px",
              width: "100%",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "42px",
                background: "linear-gradient(to right, transparent, #f2c06e)",
              }}
            />
            <span
              style={{
                color: "#f2c06e",
                opacity: 0.75,
                fontSize: "14px",
                lineHeight: 1,
              }}
            >
              ❦
            </span>
            <div
              style={{
                height: "1px",
                width: "42px",
                background: "linear-gradient(to left, transparent, #f2c06e)",
              }}
            />
          </div>

          {/* Event Date */}
          <div
            className={isExiting ? "cover-exit-date" : ""}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "17px",
              color: "rgba(255, 223, 175, 0.95)",
              fontWeight: 500,
              marginBottom: "8px",
            }}
          >
            {dateDisplay}
          </div>

          {/* Cordially Invites Kicker */}
          <p
            className={isExiting ? "cover-exit-invites" : ""}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "16px",
              color: "rgba(255, 223, 175, 0.9)",
              margin: "0 0 24px",
            }}
          >
            Cordially Invites
          </p>

          {/* Open Button */}
          <button
            ref={buttonRef}
            type="button"
            onClick={handleOpen}
            className={`cover-open-btn ${isExiting ? "cover-exit-btn" : ""}`}
            style={{
              position: "relative",
              padding: "10px 44px",
              borderRadius: "9999px",
              backgroundColor: "#f2c06e",
              color: "#764c4d",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              border: "none",
              cursor: isExiting ? "default" : "pointer",
              boxShadow:
                "0 6px 20px rgba(242, 192, 110, 0.45), 0 2px 6px rgba(0,0,0,0.3)",
              overflow: "hidden",
              transition: isExiting ? "none" : "transform 0.15s, box-shadow 0.15s, filter 0.15s",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
            aria-label="Open wedding invitation"
          >
            <span style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>Open</span>
            {/* Shimmer Light Stripe */}
            <div
              className="cover-open-shine"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "36px",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

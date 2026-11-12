"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Download } from "lucide-react";
import {
  DEFAULT_SITE_SETTINGS,
  buildGoogleCalendarUrl,
  downloadCalendarInvite,
} from "../lib/eventData";
import type { SiteSettings } from "../lib/types";

interface CountdownProps {
  settings?: SiteSettings;
  onNotify?: (msg: string) => void;
}

export function Countdown({
  settings = DEFAULT_SITE_SETTINGS,
  onNotify,
}: CountdownProps) {
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetMs = new Date(settings.eventIso).getTime();

    const update = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setStarted(true);
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setHydrated(true);
        return;
      }
      setStarted(false);
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
      setHydrated(true);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [settings.eventIso]);

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  function handleDownloadIcs() {
    downloadCalendarInvite(settings);
    onNotify?.("Calendar invite downloaded (.ics)");
  }

  return (
    <div className="countdown-wrapper">
      <div className="countdown" aria-live="polite">
        {started ? (
          <div className="countdown-live-card">
            <p className="countdown-live">The celebration day is here!</p>
            <span className="countdown-live-sub">
              See you at {settings.venueName} from {settings.timeDisplay}
            </span>
          </div>
        ) : (
          units.map(({ label, value }, index) => (
            <div
              className="time-unit-card"
              key={label}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="time-card-arch" aria-hidden="true" />
              <span
                key={hydrated ? `${label}-${value}` : `${label}-init`}
                className="time-number digit-tick"
              >
                {hydrated ? String(value).padStart(2, "0") : "--"}
              </span>
              <span className="time-label">{label}</span>
            </div>
          ))
        )}
      </div>

      <p className="countdown-meta">
        {settings.dateDisplay} &middot; {settings.timeShort} IST &middot;{" "}
        {settings.venueName}
      </p>

      <div className="countdown-actions">
        <a
          className="outline-pill-button"
          href={buildGoogleCalendarUrl(settings)}
          target="_blank"
          rel="noreferrer"
        >
          <CalendarPlus size={14} /> Add to Google Calendar
        </a>
        <button
          type="button"
          className="outline-pill-button"
          onClick={handleDownloadIcs}
        >
          <Download size={14} /> Download .ics Invite
        </button>
      </div>
    </div>
  );
}

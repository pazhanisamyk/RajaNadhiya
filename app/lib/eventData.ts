import type { SiteSettings } from "./types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  couple: "Raja & Nadhiya",
  groom: "Raja",
  bride: "Nadhiya",
  title: "Engagement Ceremony — Raja & Nadhiya",
  dateDisplay: "Sunday, 22 November 2026",
  dayDisplay: "Sunday",
  dateShort: "22 November 2026",
  dateNumeric: "22 · 11 · 2026",
  timeDisplay: "1:30 PM onwards",
  timeShort: "1:30 PM",
  eventIso: "2026-11-22T13:30:00+05:30",
  venueName: "Chinnaiyal Pazhanisami Mahal",
  venueLocality: "Chathiram, Madanagopalapuram,",
  venueRegion: "Tamil Nadu 607301",
  showPublicBlessings: true,
  quickBlessings: [
    "Wishing you both a lifetime of love & happiness! 💍✨",
    "May your bond grow stronger with every passing day! 🌸💫",
    "Heartiest congratulations on your beautiful beginning! 💐🤍",
    "May divine blessings always surround you both! 🙏✨",
  ],
};

export const EVENT_DETAILS = {
  ...DEFAULT_SITE_SETTINGS,
  fullVenue:
    "Chinnaiyal Pazhanisami Mahal, Chathiram, Madanagopalapuram, Tamil Nadu 607301",
} as const;

export function getFullVenue(
  settings: Pick<
    SiteSettings,
    "venueName" | "venueLocality" | "venueRegion"
  > = DEFAULT_SITE_SETTINGS
): string {
  const name = settings.venueName.trim().replace(/,+$/, "");
  const locality = settings.venueLocality.trim().replace(/,+$/, "");
  const region = settings.venueRegion.trim();
  return [name, locality, region].filter(Boolean).join(", ");
}

export function buildMapUrl(fullVenue: string): string {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullVenue);
}

export function buildGoogleCalendarUrl(settings: SiteSettings = DEFAULT_SITE_SETTINGS): string {
  const fullVenue = getFullVenue(settings);
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(settings.title)}` +
    "&dates=20261122T080000Z/20261122T113000Z" +
    `&details=${encodeURIComponent(
      `Join us with joyful hearts to celebrate the engagement ceremony of ${settings.couple}.`
    )}` +
    `&location=${encodeURIComponent(fullVenue)}`
  );
}

export const MAP_URL = buildMapUrl(EVENT_DETAILS.fullVenue);
export const GOOGLE_CALENDAR_URL = buildGoogleCalendarUrl(DEFAULT_SITE_SETTINGS);

export function downloadCalendarInvite(settings: SiteSettings = DEFAULT_SITE_SETTINGS): void {
  const fullVenue = getFullVenue(settings).replace(/,/g, "\\,");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Raja and Nadhiya//Engagement//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:raja-nadhiya-engagement-20261122@celebration.local",
    "DTSTAMP:20260101T000000Z",
    "DTSTART:20261122T080000Z",
    "DTEND:20261122T113000Z",
    `SUMMARY:${settings.title}`,
    `LOCATION:${fullVenue}`,
    `DESCRIPTION:Join us to celebrate the engagement of ${settings.couple} on ${settings.dateDisplay} at ${settings.timeDisplay}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Raja-and-Nadhiya-Engagement.ics";
  link.click();
  URL.revokeObjectURL(url);
}

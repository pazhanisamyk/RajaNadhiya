export interface BlessingRecord {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  approved: boolean;
  featured: boolean;
}

export interface SiteSettings {
  couple: string;
  groom: string;
  bride: string;
  title: string;
  dateDisplay: string;
  dayDisplay: string;
  dateShort: string;
  dateNumeric: string;
  timeDisplay: string;
  timeShort: string;
  eventIso: string;
  venueName: string;
  venueLocality: string;
  venueRegion: string;
  showPublicBlessings: boolean;
  quickBlessings: string[];
}


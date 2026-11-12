"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Copy,
  Download,
  MapPin,
  Maximize2,
  QrCode,
  Share2,
} from "lucide-react";
import {
  DEFAULT_SITE_SETTINGS,
  buildGoogleCalendarUrl,
  buildMapUrl,
  downloadCalendarInvite,
  getFullVenue,
} from "../lib/eventData";
import type { SiteSettings } from "../lib/types";
import { Reveal } from "./Reveal";

interface VenueLocationSectionProps {
  settings?: SiteSettings;
  copied: boolean;
  onCopyVenue: () => void;
  onOpenQrModal: () => void;
  onNotify: (msg: string) => void;
}

export function VenueLocationSection({
  settings = DEFAULT_SITE_SETTINGS,
  copied,
  onCopyVenue,
  onOpenQrModal,
  onNotify,
}: VenueLocationSectionProps) {
  const fullVenue = getFullVenue(settings);
  const mapUrl = buildMapUrl(fullVenue);
  const googleCalendarUrl = buildGoogleCalendarUrl(settings);

  function handleIcsDownload() {
    downloadCalendarInvite(settings);
    onNotify("Calendar invite downloaded (.ics)");
  }

  const whatsappVenueHref =
    "https://wa.me/?text=" +
    encodeURIComponent(
      `${settings.couple} Engagement Ceremony\nDate: ${settings.dateDisplay} (${settings.timeDisplay})\nVenue: ${fullVenue}\nDirections: ${mapUrl}`
    );

  return (
    <section className="details-section" id="details">
      <Reveal className="details-heading">
        <p className="section-kicker">Please join us</p>
        <h2>
          A day to <em>remember</em>
        </h2>
        <p className="details-intro">
          Your presence will make our celebration even more meaningful. Everything
          you need to plan your visit is right below.
        </p>
      </Reveal>

      <div className="detail-cards">
        <Reveal delay={40} variant="up">
          <article className="detail-card">
            <div className="detail-icon">
              <CalendarDays size={21} />
            </div>
            <p className="card-label">The date</p>
            <h3>{settings.dayDisplay}</h3>
            <p>{settings.dateShort}</p>
            <p className="card-subnote">Auspicious afternoon gathering</p>
            <div className="card-actions-col">
              <button
                type="button"
                className="text-action"
                onClick={handleIcsDownload}
              >
                Add to calendar <ArrowUpRight size={14} />
              </button>
              <a
                className="text-action text-action-muted"
                href={googleCalendarUrl}
                target="_blank"
                rel="noreferrer"
              >
                Google Calendar <ArrowUpRight size={13} />
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal delay={140} variant="up">
          <article className="detail-card">
            <div className="detail-icon">
              <Clock3 size={21} />
            </div>
            <p className="card-label">The time</p>
            <h3>{settings.timeShort}</h3>
            <p>Onwards</p>
            <p className="card-subnote">Engagement ceremony &amp; celebrations</p>
            <span className="card-footnote">Please arrive a little early</span>
          </article>
        </Reveal>

        <Reveal delay={240} variant="up">
          <article className="detail-card venue-card">
            <div className="detail-icon">
              <MapPin size={21} />
            </div>
            <p className="card-label">The venue</p>
            <h3>{settings.venueName}</h3>
            <p>
              {settings.venueLocality}
              <br />
              {settings.venueRegion}
            </p>
            <div className="venue-actions">
              <a
                className="text-action"
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get directions <ArrowUpRight size={14} />
              </a>
              <button
                type="button"
                className="text-action"
                onClick={onCopyVenue}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy address"}
              </button>
              <a className="text-action" href="#venue-qr">
                <QrCode size={14} /> Location QR
              </a>
            </div>
          </article>
        </Reveal>
      </div>

      {/* Dedicated Venue Guide + Location QR Code Showcase */}
      <Reveal delay={120} variant="scale">
        <div className="venue-qr-showcase" id="venue-qr">
          <div className="venue-qr-copy">
            <div className="venue-qr-kicker">
              <Compass size={14} />
              <span>Venue &amp; Location QR</span>
            </div>
            <h3>
              Navigate effortlessly to <em>the Mahal</em>
            </h3>
            <p className="venue-qr-lead">
              Scan the custom location QR code with any smartphone camera to open
              directions straight to <strong>{settings.venueName}</strong>, or
              use the quick navigation links below.
            </p>

            <div className="venue-address-box">
              <div className="venue-address-pin">
                <MapPin size={18} />
              </div>
              <div>
                <p className="venue-address-title">{settings.venueName}</p>
                <p className="venue-address-lines">
                  {settings.venueLocality} {settings.venueRegion}
                </p>
              </div>
            </div>

            <ul className="venue-tips">
              <li>
                <span className="tip-dot" aria-hidden="true" />
                <span>
                  Ceremony begins at <strong>{settings.timeDisplay}</strong> on{" "}
                  {settings.dateDisplay}
                </span>
              </li>
              <li>
                <span className="tip-dot" aria-hidden="true" />
                <span>
                  Point your phone camera at the QR code on the right for
                  instant map directions
                </span>
              </li>
              <li>
                <span className="tip-dot" aria-hidden="true" />
                <span>
                  Share the venue location directly with family traveling
                  together
                </span>
              </li>
            </ul>

            <div className="venue-qr-buttons">
              <a
                className="primary-button"
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Google Maps <ArrowUpRight size={15} />
              </a>
              <button
                type="button"
                className="secondary-button"
                onClick={onCopyVenue}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Address Copied" : "Copy Address"}
              </button>
              <a
                className="secondary-button"
                href={whatsappVenueHref}
                target="_blank"
                rel="noreferrer"
              >
                <Share2 size={15} /> Share Location
              </a>
            </div>
          </div>

          <div className="venue-qr-plaque-wrap">
            <div
              className="qr-plaque"
              role="button"
              tabIndex={0}
              onClick={onOpenQrModal}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenQrModal();
                }
              }}
              aria-label="Enlarge venue location QR code"
            >
              <span className="qr-bracket qr-tl" aria-hidden="true" />
              <span className="qr-bracket qr-tr" aria-hidden="true" />
              <span className="qr-bracket qr-bl" aria-hidden="true" />
              <span className="qr-bracket qr-br" aria-hidden="true" />

              <div className="qr-plaque-header">
                <Image
                  src="/rn-logo.png"
                  alt="R & N monogram"
                  width={548}
                  height={520}
                  className="qr-mini-logo"
                />
                <span>Scan for Venue Location</span>
              </div>

              <div className="qr-image-box">
                <Image
                  src="/location-qr.jpg"
                  alt="Location QR code for Chinnaiyal Pazhanisami Mahal, Chathiram, Madanagopalapuram"
                  width={433}
                  height={430}
                  className="qr-image"
                />
              </div>

              <p className="qr-plaque-caption">
                {settings.venueName}
              </p>

              <div className="qr-plaque-actions">
                <button
                  type="button"
                  className="qr-action-pill"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQrModal();
                  }}
                >
                  <Maximize2 size={13} /> Enlarge QR
                </button>
                <a
                  className="qr-action-pill"
                  href="/location-qr.jpg"
                  download="Raja-Nadhiya-Location-QR.jpg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNotify("Location QR image saved");
                  }}
                >
                  <Download size={13} /> Save QR
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


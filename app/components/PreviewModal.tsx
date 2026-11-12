"use client";

import Image from "next/image";
import { useEffect } from "react";
import { ArrowUpRight, Download, X } from "lucide-react";
import {
  DEFAULT_SITE_SETTINGS,
  buildMapUrl,
  getFullVenue,
} from "../lib/eventData";
import type { SiteSettings } from "../lib/types";

export type ModalKind = "invitation" | "qr" | null;

interface PreviewModalProps {
  kind: ModalKind;
  settings?: SiteSettings;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export function PreviewModal({
  kind,
  settings = DEFAULT_SITE_SETTINGS,
  onClose,
  onNotify,
}: PreviewModalProps) {
  useEffect(() => {
    if (!kind) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [kind, onClose]);

  if (!kind) return null;

  const isQr = kind === "qr";
  const fullVenue = getFullVenue(settings);
  const mapUrl = buildMapUrl(fullVenue);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={
        isQr ? "Enlarged Venue Location QR Code" : "Full Engagement Invitation"
      }
      onClick={onClose}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X size={18} />
        </button>

        {isQr ? (
          <div className="modal-qr-body">
            <div className="modal-badge">
              <Image
                src="/rn-logo.png"
                alt="R & N monogram"
                width={548}
                height={520}
                className="modal-rn-logo"
              />
              <span>Venue Location QR</span>
            </div>
            <h3>{settings.venueName}</h3>
            <p className="modal-subtitle">{fullVenue}</p>
            <div className="modal-qr-frame">
              <Image
                src="/location-qr.jpg"
                alt="Venue location QR code"
                width={433}
                height={430}
                className="modal-qr-image"
              />
            </div>
            <p className="modal-hint">
              Scan with your phone camera to open directions on Google Maps
            </p>
            <div className="modal-actions">
              <a
                className="primary-button"
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Google Maps <ArrowUpRight size={15} />
              </a>
              <a
                className="secondary-button"
                href="/location-qr.jpg"
                download="Raja-Nadhiya-Location-QR.jpg"
                onClick={() => onNotify("Location QR saved")}
              >
                <Download size={15} /> Save QR
              </a>
            </div>
          </div>
        ) : (
          <div className="modal-invite-body">
            <div className="modal-invite-frame">
              <Image
                src="/engagement-invitation.png"
                alt="Raja and Nadhiya full engagement invitation"
                width={1055}
                height={1491}
                className="modal-invite-image"
              />
            </div>
            <div className="modal-actions">
              <a
                className="primary-button"
                href="/engagement-invitation.png"
                download="Raja-and-Nadhiya-Invitation.png"
                onClick={() => onNotify("Invitation card saved")}
              >
                <Download size={15} /> Download Invitation
              </a>
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

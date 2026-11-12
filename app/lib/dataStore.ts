import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DEFAULT_SITE_SETTINGS } from "./eventData";
import type { BlessingRecord, SiteSettings } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const BLESSINGS_FILE = path.join(DATA_DIR, "blessings.json");
const SETTINGS_FILE = path.join(DATA_DIR, "site-settings.json");

let writeQueue: Promise<void> = Promise.resolve();

function enqueueWrite<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readBlessings(): Promise<BlessingRecord[]> {
  try {
    const raw = await readFile(BLESSINGS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is BlessingRecord =>
          Boolean(item) &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.message === "string"
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        message: item.message,
        createdAt:
          typeof item.createdAt === "string"
            ? item.createdAt
            : new Date().toISOString(),
        approved: item.approved !== false,
        featured: Boolean(item.featured),
      }));
  } catch {
    return [];
  }
}

async function saveBlessings(list: BlessingRecord[]): Promise<void> {
  await ensureDataDir();
  await writeFile(BLESSINGS_FILE, JSON.stringify(list, null, 2) + "\n", "utf8");
}

export async function addBlessing(input: {
  name: string;
  message: string;
  approved?: boolean;
  featured?: boolean;
}): Promise<BlessingRecord> {
  return enqueueWrite(async () => {
    const list = await readBlessings();
    const record: BlessingRecord = {
      id: randomUUID(),
      name: input.name.trim(),
      message: input.message.trim(),
      createdAt: new Date().toISOString(),
      approved: input.approved !== false,
      featured: Boolean(input.featured),
    };
    const updated = [record, ...list];
    await saveBlessings(updated);
    return record;
  });
}

export async function updateBlessing(
  id: string,
  patch: Partial<Pick<BlessingRecord, "name" | "message" | "approved" | "featured">>
): Promise<BlessingRecord | null> {
  return enqueueWrite(async () => {
    const list = await readBlessings();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const next: BlessingRecord = {
      ...current,
      name:
        typeof patch.name === "string" && patch.name.trim()
          ? patch.name.trim().slice(0, 60)
          : current.name,
      message:
        typeof patch.message === "string" && patch.message.trim()
          ? patch.message.trim().slice(0, 280)
          : current.message,
      approved:
        typeof patch.approved === "boolean" ? patch.approved : current.approved,
      featured:
        typeof patch.featured === "boolean" ? patch.featured : current.featured,
    };

    list[idx] = next;
    await saveBlessings(list);
    return next;
  });
}

export async function deleteBlessing(id: string): Promise<boolean> {
  return enqueueWrite(async () => {
    const list = await readBlessings();
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length === list.length) return false;
    await saveBlessings(filtered);
    return true;
  });
}

export async function readSiteSettings(): Promise<SiteSettings> {
  try {
    const raw = await readFile(SETTINGS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    const quick = Array.isArray(parsed.quickBlessings)
      ? parsed.quickBlessings
          .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
          .slice(0, 6)
      : DEFAULT_SITE_SETTINGS.quickBlessings;

    const groom = parsed.groom?.trim() || DEFAULT_SITE_SETTINGS.groom;
    const bride = parsed.bride?.trim() || DEFAULT_SITE_SETTINGS.bride;

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      groom,
      bride,
      couple: parsed.couple?.trim() || `${groom} & ${bride}`,
      title: parsed.title?.trim() || `Engagement Ceremony — ${groom} & ${bride}`,
      showPublicBlessings:
        typeof parsed.showPublicBlessings === "boolean"
          ? parsed.showPublicBlessings
          : DEFAULT_SITE_SETTINGS.showPublicBlessings,
      quickBlessings:
        quick.length > 0 ? quick : DEFAULT_SITE_SETTINGS.quickBlessings,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  return enqueueWrite(async () => {
    const current = await readSiteSettings();
    const groom = patch.groom?.trim() || current.groom;
    const bride = patch.bride?.trim() || current.bride;
    const quickBlessings = Array.isArray(patch.quickBlessings)
      ? patch.quickBlessings
          .map((q) => q.trim())
          .filter(Boolean)
          .slice(0, 6)
      : current.quickBlessings;

    const next: SiteSettings = {
      ...current,
      ...patch,
      groom,
      bride,
      couple: `${groom} & ${bride}`,
      title: `Engagement Ceremony — ${groom} & ${bride}`,
      dateDisplay: patch.dateDisplay?.trim() || current.dateDisplay,
      dayDisplay: patch.dayDisplay?.trim() || current.dayDisplay,
      dateShort: patch.dateShort?.trim() || current.dateShort,
      dateNumeric: patch.dateNumeric?.trim() || current.dateNumeric,
      timeDisplay: patch.timeDisplay?.trim() || current.timeDisplay,
      timeShort: patch.timeShort?.trim() || current.timeShort,
      eventIso: patch.eventIso?.trim() || current.eventIso,
      venueName: patch.venueName?.trim() || current.venueName,
      venueLocality: patch.venueLocality?.trim() || current.venueLocality,
      venueRegion: patch.venueRegion?.trim() || current.venueRegion,
      showPublicBlessings:
        typeof patch.showPublicBlessings === "boolean"
          ? patch.showPublicBlessings
          : current.showPublicBlessings,
      quickBlessings:
        quickBlessings.length > 0 ? quickBlessings : current.quickBlessings,
    };

    await ensureDataDir();
    await writeFile(SETTINGS_FILE, JSON.stringify(next, null, 2) + "\n", "utf8");
    return next;
  });
}


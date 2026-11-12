import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DEFAULT_SITE_SETTINGS } from "./eventData";
import { getMongoDb, getMongoDbName, isMongoAtlasUri } from "./mongodb";
import type { BlessingRecord, SiteSettings } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "site-settings.json");

const BLESSINGS_COLLECTION = "blessings";
const SETTINGS_COLLECTION = "site_settings";

const SETTINGS_DOC_ID = "default";

interface SettingsDoc extends SiteSettings {
  _id: string;
}

export type StorageMode = "mongodb-atlas" | "mongodb-local";

export function getStorageInfo(): { mode: StorageMode; label: string } {
  const dbName = getMongoDbName();
  if (isMongoAtlasUri()) {
    return {
      mode: "mongodb-atlas",
      label: `MongoDB Atlas (${dbName})`,
    };
  }
  return {
    mode: "mongodb-local",
    label: `Local MongoDB (127.0.0.1:27017 / ${dbName})`,
  };
}

function normalizeBlessing(item: unknown): BlessingRecord | null {
  if (!item || typeof item !== "object") return null;
  const candidate = item as Partial<BlessingRecord>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.message !== "string"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    message: candidate.message,
    createdAt:
      typeof candidate.createdAt === "string"
        ? candidate.createdAt
        : new Date().toISOString(),
    approved: candidate.approved !== false,
    featured: Boolean(candidate.featured),
  };
}

function applyBlessingPatch(
  current: BlessingRecord,
  patch: Partial<Pick<BlessingRecord, "name" | "message" | "approved" | "featured">>
): BlessingRecord {
  return {
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
}

function normalizeSiteSettings(parsed: Partial<SiteSettings>): SiteSettings {
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
}

function mergeSiteSettings(
  current: SiteSettings,
  patch: Partial<SiteSettings>
): SiteSettings {
  const groom = patch.groom?.trim() || current.groom;
  const bride = patch.bride?.trim() || current.bride;
  const quickBlessings = Array.isArray(patch.quickBlessings)
    ? patch.quickBlessings
        .map((q) => q.trim())
        .filter(Boolean)
        .slice(0, 6)
    : current.quickBlessings;

  return {
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
}

async function readLocalSeedSettings(): Promise<SiteSettings> {
  try {
    const raw = await readFile(SETTINGS_FILE, "utf8");
    return normalizeSiteSettings(JSON.parse(raw) as Partial<SiteSettings>);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function readBlessings(): Promise<BlessingRecord[]> {
  const db = await getMongoDb();
  const docs = await db
    .collection<BlessingRecord>(BLESSINGS_COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return docs
    .map(normalizeBlessing)
    .filter((item): item is BlessingRecord => item !== null);
}

export async function findBlessingsByIds(
  ids: string[]
): Promise<BlessingRecord[]> {
  const cleaned = ids.map((id) => id.trim()).filter(Boolean).slice(0, 20);
  if (cleaned.length === 0) return [];

  const db = await getMongoDb();
  const docs = await db
    .collection<BlessingRecord>(BLESSINGS_COLLECTION)
    .find({ id: { $in: cleaned } }, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return docs
    .map(normalizeBlessing)
    .filter((item): item is BlessingRecord => item !== null);
}

export async function addBlessing(input: {
  name: string;
  message: string;
  approved?: boolean;
  featured?: boolean;
}): Promise<BlessingRecord> {
  const db = await getMongoDb();
  const record: BlessingRecord = {
    id: randomUUID(),
    name: input.name.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
    approved: input.approved !== false,
    featured: Boolean(input.featured),
  };

  await db.collection<BlessingRecord>(BLESSINGS_COLLECTION).insertOne({ ...record });
  return record;
}

export async function updateBlessing(
  id: string,
  patch: Partial<Pick<BlessingRecord, "name" | "message" | "approved" | "featured">>
): Promise<BlessingRecord | null> {
  const db = await getMongoDb();
  const col = db.collection<BlessingRecord>(BLESSINGS_COLLECTION);

  const existing = await col.findOne({ id }, { projection: { _id: 0 } });
  const current = normalizeBlessing(existing);
  if (!current) return null;

  const next = applyBlessingPatch(current, patch);
  await col.updateOne({ id }, { $set: next });
  return next;
}

export async function deleteBlessing(id: string): Promise<boolean> {
  const db = await getMongoDb();
  const res = await db.collection<BlessingRecord>(BLESSINGS_COLLECTION).deleteOne({ id });
  return res.deletedCount > 0;
}

export async function readSiteSettings(): Promise<SiteSettings> {
  try {
    const db = await getMongoDb();
    const col = db.collection<SettingsDoc>(SETTINGS_COLLECTION);
    const existing = await col.findOne({ _id: SETTINGS_DOC_ID });
    if (existing) {
      const { _id: _omit, ...rest } = existing;
      return normalizeSiteSettings(rest);
    }

    const seed = await readLocalSeedSettings();
    await col.updateOne(
      { _id: SETTINGS_DOC_ID },
      { $set: seed },
      { upsert: true }
    );
    return seed;
  } catch (err) {
    console.error("[dataStore] readSiteSettings MongoDB error:", err);
    return readLocalSeedSettings();
  }
}

export async function updateSiteSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await readSiteSettings();
  const next = mergeSiteSettings(current, patch);
  const db = await getMongoDb();
  await db
    .collection<SettingsDoc>(SETTINGS_COLLECTION)
    .updateOne({ _id: SETTINGS_DOC_ID }, { $set: next }, { upsert: true });
  return next;
}

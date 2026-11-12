import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "rn_admin_session";
const SECRET_FILE = path.join(process.cwd(), "data", ".admin-secret");
const DEFAULT_LOCAL_PASSCODE = "";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const FALLBACK_KEY_DOMAIN = "rn-engagement-admin-session-key-v1";

export function getAdminPasscode(): string {
  return process.env.ADMIN_PASSCODE?.trim() || DEFAULT_LOCAL_PASSCODE;
}

function getStatelessFallbackSecret(): string {
  return createHmac("sha256", FALLBACK_KEY_DOMAIN)
    .update(getAdminPasscode())
    .digest("hex");
}

async function getSigningSecret(): Promise<string> {
  if (process.env.ADMIN_SECRET?.trim()) {
    return process.env.ADMIN_SECRET.trim();
  }

  // Never rely on local disk secrets in production or serverless environments.
  if (
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.NETLIFY) ||
    Boolean(process.env.VERCEL)
  ) {
    return getStatelessFallbackSecret();
  }

  try {
    const existing = (await readFile(SECRET_FILE, "utf8")).trim();
    if (existing.length >= 32) return existing;
  } catch {
    // Generate one on first use locally.
  }

  const generated = randomBytes(32).toString("hex");
  try {
    await mkdir(path.dirname(SECRET_FILE), { recursive: true });
    await writeFile(SECRET_FILE, generated + "\n", "utf8");
    return generated;
  } catch {
    return getStatelessFallbackSecret();
  }
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPasscode(candidate: string): boolean {
  const expected = getAdminPasscode();
  if (!expected) return false;
  return safeEqual(candidate.trim(), expected);
}

export async function createSessionToken(): Promise<string> {
  const secret = await getSigningSecret();
  const payload = String(Date.now() + SESSION_TTL_MS);
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".", 2);
  if (!payload || !sig) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const secret = await getSigningSecret();
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return safeEqual(sig, expected);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<Response | null> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

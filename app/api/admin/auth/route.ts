import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  isAdminAuthenticated,
  verifyPasscode,
} from "@/app/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

function isHttpsRequest(req: Request): boolean {
  const forwardedProto = req.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  if (forwardedProto === "https") return true;
  try {
    return new URL(req.url).protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let body: { passcode?: unknown };
  try {
    body = (await req.json()) as { passcode?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Invalid authentication request." },
      { status: 400 }
    );
  }

  const passcode = typeof body.passcode === "string" ? body.passcode : "";
  if (!passcode || !verifyPasscode(passcode)) {
    return NextResponse.json(
      { error: "Incorrect admin passcode." },
      { status: 401 }
    );
  }

  try {
    const token = await createSessionToken();
    const res = NextResponse.json({ authenticated: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttpsRequest(req),
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error("[api/admin/auth POST]", err);
    return NextResponse.json(
      { error: "Unable to initialize admin session." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttpsRequest(req),
    path: "/",
    maxAge: 0,
  });
  return res;
}

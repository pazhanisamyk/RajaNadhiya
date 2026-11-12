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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { passcode?: unknown };
    const passcode = typeof body.passcode === "string" ? body.passcode : "";

    if (!passcode || !verifyPasscode(passcode)) {
      return NextResponse.json(
        { error: "Incorrect admin passcode." },
        { status: 401 }
      );
    }

    const token = await createSessionToken();
    const isHttps =
      req.headers.get("x-forwarded-proto") === "https" ||
      new URL(req.url).protocol === "https:";
    const res = NextResponse.json({ authenticated: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid authentication request." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/adminAuth";
import { readSiteSettings, updateSiteSettings } from "@/app/lib/dataStore";
import type { SiteSettings } from "@/app/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const settings = await readSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await req.json()) as Partial<SiteSettings>;
    const settings = await updateSiteSettings(body);
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "Unable to save site settings." },
      { status: 500 }
    );
  }
}


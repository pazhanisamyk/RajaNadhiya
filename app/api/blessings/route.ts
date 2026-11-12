import { NextResponse } from "next/server";
import {
  addBlessing,
  findBlessingsByIds,
  readBlessings,
  readSiteSettings,
} from "@/app/lib/dataStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");
    if (idsParam !== null) {
      const ids = idsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      const owned = await findBlessingsByIds(ids);
      return NextResponse.json({ blessings: owned });
    }

    const [blessings, settings] = await Promise.all([
      readBlessings(),
      readSiteSettings(),
    ]);
    const visible = settings.showPublicBlessings
      ? blessings.filter((item) => item.approved)
      : [];
    return NextResponse.json({ blessings: visible });
  } catch (err) {
    console.error("[api/blessings GET]", err);
    return NextResponse.json(
      { error: "Unable to load blessings right now." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: unknown; message?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Your name is required." },
        { status: 400 }
      );
    }
    if (!message) {
      return NextResponse.json(
        { error: "Your blessing message is required." },
        { status: 400 }
      );
    }

    const record = await addBlessing({
      name: name.slice(0, 60),
      message: message.slice(0, 280),
      approved: false,
      featured: false,
    });

    return NextResponse.json({ blessing: record }, { status: 201 });
  } catch (err) {
    console.error("[api/blessings POST]", err);
    return NextResponse.json(
      { error: "Unable to save blessing right now." },
      { status: 500 }
    );
  }
}


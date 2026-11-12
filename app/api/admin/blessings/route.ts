import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/adminAuth";
import { addBlessing, readBlessings } from "@/app/lib/dataStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const blessings = await readBlessings();
    const todayPrefix = new Date().toISOString().slice(0, 10);
    const stats = {
      total: blessings.length,
      approved: blessings.filter((b) => b.approved).length,
      hidden: blessings.filter((b) => !b.approved).length,
      featured: blessings.filter((b) => b.featured).length,
      today: blessings.filter((b) => b.createdAt.startsWith(todayPrefix)).length,
    };

    return NextResponse.json({ blessings, stats });
  } catch (err) {
    console.error("[api/admin/blessings GET]", err);
    return NextResponse.json(
      { error: "Unable to load blessings." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await req.json()) as {
      name?: unknown;
      message?: unknown;
      approved?: unknown;
      featured?: unknown;
    };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and blessing message are both required." },
        { status: 400 }
      );
    }

    const record = await addBlessing({
      name: name.slice(0, 60),
      message: message.slice(0, 280),
      approved: typeof body.approved === "boolean" ? body.approved : true,
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ blessing: record }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create blessing." },
      { status: 500 }
    );
  }
}


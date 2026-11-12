import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/adminAuth";
import { deleteBlessing, updateBlessing } from "@/app/lib/dataStore";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await req.json()) as {
      name?: unknown;
      message?: unknown;
      approved?: unknown;
      featured?: unknown;
    };

    const updated = await updateBlessing(context.params.id, {
      name: typeof body.name === "string" ? body.name : undefined,
      message: typeof body.message === "string" ? body.message : undefined,
      approved: typeof body.approved === "boolean" ? body.approved : undefined,
      featured: typeof body.featured === "boolean" ? body.featured : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Blessing not found." }, { status: 404 });
    }
    return NextResponse.json({ blessing: updated });
  } catch (err) {
    console.error("[api/admin/blessings PATCH]", err);
    return NextResponse.json(
      { error: "Unable to update blessing." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const removed = await deleteBlessing(context.params.id);
    if (!removed) {
      return NextResponse.json({ error: "Blessing not found." }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("[api/admin/blessings DELETE]", err);
    return NextResponse.json(
      { error: "Unable to delete blessing." },
      { status: 500 }
    );
  }
}


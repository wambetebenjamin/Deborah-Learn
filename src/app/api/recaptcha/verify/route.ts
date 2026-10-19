import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  let body: { token?: string; action?: string; version?: "v2" | "v3" };
  try {
    body = (await request.json()) as { token?: string; action?: string; version?: "v2" | "v3" };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.token) {
    return NextResponse.json({ ok: false, error: "A token is required" }, { status: 400 });
  }

  const result = await verifyRecaptcha(body.token, {
    action: body.action,
    version: body.version ?? "v3",
  });

  return NextResponse.json({
    ok: result.success,
    score: result.score,
    requiresV2: result.requiresV2,
    skipped: result.skipped,
  });
}

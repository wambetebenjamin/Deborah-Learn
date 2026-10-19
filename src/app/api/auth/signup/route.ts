import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/store";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  password: z.string().min(8).max(200),
  recaptchaToken: z.string().optional(),
  version: z.enum(["v2", "v3"]).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const verification = await verifyRecaptcha(parsed.data.recaptchaToken, {
    action: "signup",
    version: parsed.data.version ?? "v3",
  });

  if (verification.requiresV2) {
    return NextResponse.json(
      { ok: false, requiresV2: true, error: "Additional verification required" },
      { status: 428 },
    );
  }

  if (!verification.success) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  const user = await createUser({
    email: parsed.data.email,
    name: parsed.data.name,
    password: parsed.data.password,
  });

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } }, { status: 201 });
}

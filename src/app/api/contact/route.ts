import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/mailer";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().min(3).max(160),
  message: z.string().min(15).max(4000),
  recaptchaToken: z.string().optional(),
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
    action: "contact",
    version: parsed.data.recaptchaToken ? "v3" : "v2",
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

  try {
    const result = await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    return NextResponse.json({
      ok: true,
      delivered: result.delivered,
      note:
        result.delivered
          ? "Message sent"
          : "Message received. Email delivery is not configured in this environment.",
    });
  } catch (error) {
    console.error("[contact] send failed", error);
    return NextResponse.json(
      { ok: false, error: "The message could not be sent right now" },
      { status: 500 },
    );
  }
}

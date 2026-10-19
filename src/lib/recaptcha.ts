type RecaptchaResult = {
  success: boolean;
  score: number;
  requiresV2: boolean;
  skipped: boolean;
  errorCodes: string[];
};

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export function recaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
}

export async function verifyRecaptcha(
  token: string | undefined,
  options: { action?: string; version?: "v3" | "v2" } = {},
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const skipped = !secret || !recaptchaSiteKey();

  if (skipped) {
    return { success: true, score: 1, requiresV2: false, skipped: true, errorCodes: [] };
  }

  if (!token) {
    return {
      success: false,
      score: 0,
      requiresV2: options.version !== "v2",
      skipped: false,
      errorCodes: ["missing-token"],
    };
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };
    const score = data.score ?? 1;
    const actionOk = !options.action || !data.action || data.action === options.action;
    const passed = Boolean(data.success) && actionOk && score >= 0.5;
    return {
      success: options.version === "v2" ? Boolean(data.success) : passed,
      score,
      requiresV2: options.version !== "v2" && Boolean(data.success) && score < 0.5,
      skipped: false,
      errorCodes: data["error-codes"] ?? [],
    };
  } catch {
    return {
      success: false,
      score: 0,
      requiresV2: false,
      skipped: false,
      errorCodes: ["verification-unreachable"],
    };
  }
}

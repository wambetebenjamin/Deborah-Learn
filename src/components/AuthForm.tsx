"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { AlertCircle, Loader2, Lock, Mail, User } from "lucide-react";
import { zodResolver } from "@/lib/zod-resolver";
import { useRecaptcha } from "@/lib/recaptcha-client";

function buildSchema(mode: "signin" | "signup") {
  return z
    .object({
      name: z.string().optional(),
      email: z.string().email("Enter a valid email address"),
      password: z.string().min(8, "Use at least 8 characters"),
      confirmPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (mode === "signup") {
        if (!data.name || data.name.trim().length < 2) {
          ctx.addIssue({ code: "custom", path: ["name"], message: "Enter your full name" });
        }
        if (data.confirmPassword !== data.password) {
          ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "The passwords do not match",
          });
        }
      }
    });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export default function AuthForm({
  mode,
  callbackUrl = "/dashboard",
}: {
  mode: "signin" | "signup";
  callbackUrl?: string;
}) {
  const router = useRouter();
  const recaptcha = useRecaptcha(mode);
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState<"form" | "google" | null>(null);

  const schema = buildSchema(mode);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setBusy("form");
    setServerError("");

    try {
      const token = recaptcha.v2Token || (await recaptcha.getToken());

      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            recaptchaToken: token,
            version: recaptcha.v2Token ? "v2" : "v3",
          }),
        });

        const data = (await response.json()) as {
          ok?: boolean;
          requiresV2?: boolean;
          error?: string;
        };

        if (response.status === 428 && data.requiresV2) {
          recaptcha.requireV2();
          setServerError("Please complete the verification check, then submit again.");
          setBusy(null);
          return;
        }

        if (!response.ok) {
          setServerError(data.error ?? "The account could not be created");
          setBusy(null);
          return;
        }
      }

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        recaptchaToken: token,
        recaptchaVersion: recaptcha.v2Token ? "v2" : "v3",
        redirect: false,
      });

      if (!result || result.error) {
        setServerError(
          "We could not sign you in. Check your email and password, or create an account.",
        );
        setBusy(null);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please check your connection and try again.");
      setBusy(null);
    }
  };

  const google = async () => {
    setBusy("google");
    setServerError("");
    try {
      await signIn("google", { callbackUrl });
    } catch {
      setServerError("Google sign in is not available right now. Use your email instead.");
      setBusy(null);
    }
  };

  return (
    <div className="form-box">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
          <p className="mt-1 text-sm text-[#5b6470]">
            {mode === "signin"
              ? "Sign in to continue a course or download a certificate."
              : "It is free to create an account. You only pay when you enrol in a course."}
          </p>
        </div>
      </div>

      {serverError && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#f5c6c1] bg-[#fdf3f2] p-3 text-sm text-[#a5281b]" role="alert">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      )}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {mode === "signup" && (
          <div>
            <label className="field-label" htmlFor="auth-name">
              Full name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a94a0]" aria-hidden="true" />
              <input
                id="auth-name"
                className="field-input pl-9"
                autoComplete="name"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>
        )}

        <div>
          <label className="field-label" htmlFor="auth-email">
            Email address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a94a0]" aria-hidden="true" />
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              className="field-input pl-9"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="auth-password">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a94a0]" aria-hidden="true" />
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="field-input pl-9"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        {mode === "signup" && (
          <div>
            <label className="field-label" htmlFor="auth-confirm">
              Confirm password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a94a0]" aria-hidden="true" />
              <input
                id="auth-confirm"
                type="password"
                autoComplete="new-password"
                className="field-input pl-9"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        {recaptcha.v2Required && (
          <div>
            <p className="mb-2 text-sm text-[#5b6470]">
              Please confirm you are a person before continuing.
            </p>
            <div ref={recaptcha.containerRef} />
            {recaptcha.v2Error && <p className="field-error">{recaptcha.v2Error}</p>}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={busy !== null}>
          {busy === "form" && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-[#8a94a0]">
        <span className="h-px flex-1 bg-[#edf0f5]" />
        or
        <span className="h-px flex-1 bg-[#edf0f5]" />
      </div>

      <button
        type="button"
        className="btn btn-outline w-full"
        onClick={google}
        disabled={busy !== null}
      >
        {busy === "google" ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v8.4h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.6 5.9c4.5-4.2 6.6-10.3 6.6-17.5Z" />
            <path fill="#FBBC05" d="M10.4 28.7A14.6 14.6 0 0 1 9.6 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1Z" />
            <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.9l-7.6-5.9c-2.1 1.4-4.9 2.4-8.4 2.4-6.3 0-11.7-3.7-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
          </svg>
        )}
        Continue with Google
      </button>

      <p className="mt-5 text-center text-sm text-[#5b6470]">
        {mode === "signin" ? (
          <>
            New to Deborah Learn?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#0c6b54]">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-[#0c6b54]">
              Sign in
            </Link>
          </>
        )}
      </p>

      <p className="mt-4 text-center text-xs leading-relaxed text-[#8a94a0]">
        This form is protected by reCAPTCHA. By continuing you agree to our{" "}
        <Link href="/legal/terms" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

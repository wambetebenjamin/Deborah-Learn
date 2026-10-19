"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { useRecaptcha } from "@/lib/recaptcha-client";

const schema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Add a short subject"),
  message: z.string().min(15, "Share a little more detail (at least 15 characters)"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const recaptcha = useRecaptcha("contact");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus("sending");
    setServerError("");

    try {
      const token = recaptcha.v2Token || (await recaptcha.getToken());
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, recaptchaToken: token }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        requiresV2?: boolean;
        error?: string;
      };

      if (response.status === 428 && data.requiresV2) {
        recaptcha.requireV2();
        setStatus("idle");
        return;
      }

      if (!response.ok) {
        setServerError(data.error ?? "The message could not be sent. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
      reset();
    } catch {
      setServerError("The message could not be sent. Please check your connection.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="form-box" role="status">
        <h3 className="text-xl">Message received</h3>
        <p className="mt-2 text-sm text-[#5b6470]">
          Thank you. A member of the Deborah Learn team will reply within one working day.
          For a faster answer, send us a WhatsApp message.
        </p>
        <button
          type="button"
          className="btn btn-outline btn-sm mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="form-box space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contact-name">
            Full name
          </label>
          <input id="contact-name" className="field-input" {...register("name")} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            className="field-input"
            {...register("email")}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contact-phone">
            Phone or WhatsApp (optional)
          </label>
          <input id="contact-phone" className="field-input" {...register("phone")} />
        </div>
        <div>
          <label className="field-label" htmlFor="contact-subject">
            Subject
          </label>
          <input id="contact-subject" className="field-input" {...register("subject")} />
          {errors.subject && <p className="field-error">{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          className="field-input"
          {...register("message")}
        />
        {errors.message && <p className="field-error">{errors.message.message}</p>}
      </div>

      {recaptcha.v2Required && (
        <div>
          <p className="mb-2 text-sm text-[#5b6470]">
            Please confirm you are a person before sending.
          </p>
          <div ref={recaptcha.containerRef} />
          {recaptcha.v2Error && <p className="field-error">{recaptcha.v2Error}</p>}
        </div>
      )}

      {serverError && <p className="field-error">{serverError}</p>}

      <p className="text-xs text-[#8a94a0]">
        This form is protected by reCAPTCHA. Google&apos;s Privacy Policy and Terms of
        Service apply.
      </p>

      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Send size={16} aria-hidden="true" />
        )}
        Send message
      </button>
    </form>
  );
}

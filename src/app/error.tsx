"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, MessageCircle, RotateCcw } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[deborah-learn] page error", error);
  }, [error]);

  return (
    <section className="site-section">
      <div className="container-page max-w-2xl text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#fdf3f2] text-[#a5281b]">
          <AlertTriangle size={40} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <p className="eyebrow mt-6">500, something went wrong</p>
        <h1 className="mt-2 text-3xl md:text-4xl">We could not load this page</h1>
        <p className="section-lede mx-auto">
          The issue is on our side and has been logged. Try again, or reach us on WhatsApp if
          you were in the middle of a lesson or payment.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-primary" onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            Try again
          </button>
          <Link href="/courses" className="btn btn-outline">
            Back to courses
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp {site.whatsappDisplay}
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-[#8a94a0]">Reference: {error.digest}</p>
        )}
      </div>
    </section>
  );
}

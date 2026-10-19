import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Deborah Learn to continue your course and download certificates.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl?.startsWith("/") ? params.callbackUrl : "/dashboard";

  return (
    <section className="site-section">
      <div className="container-page grid max-w-5xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Sign in</span>
          </nav>
          <span className="eyebrow">Welcome back</span>
          <h1 className="mt-2 text-3xl md:text-4xl">Pick up where you left off</h1>
          <p className="section-lede">
            Your lessons, notes, and certificates are waiting. Sign in with the email you used
            when you enrolled, or continue with Google.
          </p>

          <div className="mt-6 rounded-[10px] border border-[#cdeee3] bg-[#f2fbf8] p-4">
            <p className="font-display text-sm font-bold text-[#111315]">
              Preview this template
            </p>
            <p className="mt-1 text-sm text-[#4b5563]">
              Use the demo learner account to see a dashboard with progress and a certificate.
            </p>
            <p className="mt-2 font-mono text-xs text-[#0c6b54]">
              demo@deborahlearn.co.ke
              <br />
              Deborah2026
            </p>
          </div>

          <p className="mt-5 text-xs text-[#8a94a0]">
            Need help signing in? WhatsApp {site.whatsappDisplay}. We never ask for your
            password over the phone.
          </p>
        </div>

        <AuthForm mode="signin" callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}

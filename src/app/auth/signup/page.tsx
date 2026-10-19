import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a free Deborah Learn account and enrol in a course today.",
};

export default function SignUpPage() {
  return (
    <section className="site-section">
      <div className="container-page grid max-w-5xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Create account</span>
          </nav>
          <span className="eyebrow">Start today</span>
          <h1 className="mt-2 text-3xl md:text-4xl">Your next skill starts here</h1>
          <p className="section-lede">
            Create a free account to preview lessons, enrol in a course, and keep your
            progress in one place. No card is needed until you enrol.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-[#4b5563]">
            <li>Study on a phone or a laptop, at your own pace</li>
            <li>Download notes and certificates</li>
            <li>Learn from instructors based across East Africa</li>
            <li>Pay by M-Pesa or card when you enrol</li>
          </ul>
          <p className="mt-6 text-xs text-[#8a94a0]">
            Questions? WhatsApp {site.whatsappDisplay} and a person will reply.
          </p>
        </div>

        <AuthForm mode="signup" callbackUrl="/dashboard" />
      </div>
    </section>
  );
}

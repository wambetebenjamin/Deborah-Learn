import Link from "next/link";
import { legalLinks, site } from "@/lib/site";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export default function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <section className="page-header">
        <div className="container-page">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Legal</span>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </nav>
          <span className="eyebrow">Legal</span>
          <h1 className="mt-2 text-3xl md:text-4xl">{title}</h1>
          <p className="section-lede">{intro}</p>
          <p className="mt-3 text-sm text-[#8a94a0]">Last updated: {updated}</p>
        </div>
      </section>

      <section className="site-section pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <article className="prose-block text-[#3f4854]">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <aside className="card">
            <div className="card-body">
              <h2 className="text-lg">Legal documents</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-semibold text-[#0c6b54] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-[#5b6470]">
                Questions about this policy can be sent to {site.email} or on WhatsApp at{" "}
                {site.whatsappDisplay}.
              </p>
              <p className="mt-3 text-xs text-[#8a94a0]">
                {site.name}, {site.address}. Service area: {site.serviceArea}.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

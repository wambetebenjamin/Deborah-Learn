import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CertificateCard from "@/components/CertificateCard";
import { getCertificate } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Certificate ${id}`,
    description: `Verify a Deborah Learn certificate with ID ${id}.`,
    robots: { index: false, follow: true },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = await getCertificate(id);

  if (!certificate) notFound();

  return (
    <section className="site-section">
      <div className="container-page max-w-4xl">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Certificate</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Certificate verification</span>
            <h1 className="mt-2 text-3xl">Certificate {certificate.id}</h1>
            <p className="section-lede">
              This page confirms that the certificate below was issued by Deborah Learn.
            </p>
          </div>
          <Link href="/dashboard" className="btn btn-outline btn-sm">
            Go to dashboard
          </Link>
        </div>

        <div className="mt-8">
          <CertificateCard
            certificate={{
              id: certificate.id,
              studentName: certificate.studentName,
              courseTitle: certificate.courseTitle,
              courseSlug: certificate.courseSlug,
              issuedAt: certificate.issuedAt,
            }}
          />
        </div>
      </div>
    </section>
  );
}

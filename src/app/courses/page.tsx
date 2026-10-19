import type { Metadata } from "next";
import Link from "next/link";
import CourseCatalogue from "@/components/CourseCatalogue";
import { courses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Course catalogue",
  description:
    "Browse every Deborah Learn course in business, technology, health, education, creative arts, and agriculture. Filter by level, price, and duration.",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; level?: string; price?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <section className="page-header">
        <div className="container-page">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Courses</span>
          </nav>
          <span className="eyebrow">Course catalogue</span>
          <h1 className="mt-2 text-4xl md:text-5xl">Courses built for East African learners</h1>
          <p className="section-lede">
            Twelve courses across six subject areas. Every course is self paced, includes
            downloadable notes, and ends with a certificate you can verify online.
          </p>
        </div>
      </section>

      <section className="site-section pt-10">
        <div className="container-page">
          <CourseCatalogue
            courses={courses}
            initialCategory={params.category ?? "all"}
            initialLevel={params.level ?? "all"}
            initialPrice={params.price ?? "all"}
          />
        </div>
      </section>
    </>
  );
}

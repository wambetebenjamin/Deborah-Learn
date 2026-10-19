import type { Metadata } from "next";
import Link from "next/link";
import InstructorCard from "@/components/InstructorCard";
import { instructors } from "@/lib/data";

export const metadata: Metadata = {
  title: "Instructors",
  description:
    "Meet the Deborah Learn faculty, practitioners in business, technology, health, education, creative arts, and agriculture across East Africa.",
};

export default function InstructorsPage() {
  return (
    <>
      <section className="page-header">
        <div className="container-page">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Instructors</span>
          </nav>
          <span className="eyebrow">Instructor directory</span>
          <h1 className="mt-2 text-4xl md:text-5xl">Practitioners who teach what they do</h1>
          <p className="section-lede">
            Every Deborah Learn instructor works in the field they teach. Hover or focus a card
            to read their background, then open a profile for their courses.
          </p>
        </div>
      </section>

      <section className="site-section pt-10">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.slug} instructor={instructor} detailed />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

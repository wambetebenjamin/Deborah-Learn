import Link from "next/link";
import { ArrowRight, Award, BookOpenCheck, MessageCircle, UserPlus } from "lucide-react";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import CourseCard from "@/components/CourseCard";
import InstructorCard from "@/components/InstructorCard";
import Testimonials from "@/components/Testimonials";
import StatsBar from "@/components/StatsBar";
import ContactForm from "@/components/ContactForm";
import { SectionHeading } from "@/components/ui";
import { courses, instructors } from "@/lib/data";
import { site, whatsappLink } from "@/lib/site";

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    copy: "Sign up with an email address or Google. It takes less than a minute and it is free.",
  },
  {
    icon: BookOpenCheck,
    title: "Enrol in a course",
    copy: "Choose a course, pay with M-Pesa or card, and start the first lesson straight away.",
  },
  {
    icon: Award,
    title: "Learn and earn a certificate",
    copy: "Study at your own pace. Finish every lesson and download a certificate you can verify.",
  },
];

export default function HomePage() {
  const featured = courses.filter((course) => course.featured).slice(0, 4);
  const faculty = instructors.slice(0, 4);

  return (
    <>
      <Hero />

      <section className="site-section" aria-labelledby="categories-title">
        <div className="container-page">
          <SectionHeading
            eyebrow="Course categories"
            title="Find the subject that moves you forward"
            lede="Six practical subject areas, written for learners in Kenya and across East Africa. Every course includes downloadable notes and a verifiable certificate."
            action={
              <Link href="/courses" className="btn btn-outline btn-sm shrink-0">
                All courses
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />
          <h2 id="categories-title" className="sr-only">
            Course categories
          </h2>
          <div className="mt-9">
            <CategoryGrid />
          </div>
        </div>
      </section>

      <section className="site-section section-muted" aria-labelledby="featured-title">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured courses"
            title="Start with a course learners recommend"
            lede="Short lessons, practical assignments, and instructors who know the East African context."
            action={
              <Link href="/courses" className="btn btn-dark btn-sm shrink-0">
                Browse the catalogue
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />
          <h2 id="featured-title" className="sr-only">
            Featured courses
          </h2>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((course, index) => (
              <CourseCard key={course.slug} course={course} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="site-section" id="how-it-works" aria-labelledby="how-title">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from curious to certified"
            lede="No entrance exams and no fixed class times. You decide when to study, and your progress is saved as you go."
            align="center"
          />
          <h2 id="how-title" className="sr-only">
            How it works
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div className="step-card" key={step.title}>
                <div className="flex items-center justify-between">
                  <span className="step-number">{index + 1}</span>
                  <step.icon size={26} className="text-[#16866b]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-[#5b6470]">{step.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/signup" className="btn btn-primary">
              Create a free account
            </Link>
            <Link href="/courses" className="btn btn-outline">
              See course fees
            </Link>
          </div>
        </div>
      </section>

      <section className="site-section section-muted" aria-labelledby="instructors-title">
        <div className="container-page">
          <SectionHeading
            eyebrow="Instructors"
            title="Learn from people who work in the field"
            lede="Our instructors are practitioners in Nairobi, Kisumu, Mombasa, Nyeri and Eldoret. Hover a card to read their background."
            action={
              <Link href="/instructors" className="btn btn-outline btn-sm shrink-0">
                Meet the faculty
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            }
          />
          <h2 id="instructors-title" className="sr-only">
            Instructors
          </h2>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {faculty.map((instructor) => (
              <InstructorCard key={instructor.slug} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      <section className="site-section" aria-labelledby="testimonials-title">
        <div className="container-page">
          <SectionHeading
            eyebrow="Student stories"
            title="Learners across East Africa are finishing what they start"
            lede="Real feedback from students in Kenya and the region."
            align="center"
          />
          <h2 id="testimonials-title" className="sr-only">
            Student testimonials
          </h2>
          <div className="mt-9">
            <Testimonials />
          </div>
        </div>
      </section>

      <StatsBar />

      <section className="site-section" id="contact" aria-labelledby="contact-title">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Talk to us"
              title="Questions before you enrol?"
              lede="Send a message and a member of our team in Nairobi will reply within one working day. If you prefer a quick answer, WhatsApp is the fastest route."
            />
            <h2 id="contact-title" className="sr-only">
              Contact Deborah Learn
            </h2>
            <div className="mt-6 space-y-3 text-sm text-[#4b5563]">
              <p>
                <strong className="text-[#111315]">WhatsApp:</strong>{" "}
                <a className="font-semibold text-[#0c6b54]" href={whatsappLink()}>
                  {site.whatsappDisplay}
                </a>
              </p>
              <p>
                <strong className="text-[#111315]">Email:</strong>{" "}
                <a className="font-semibold text-[#0c6b54]" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
              <p>
                <strong className="text-[#111315]">Service area:</strong> {site.serviceArea}
              </p>
              <p>
                <strong className="text-[#111315]">Study hours:</strong> Monday to Friday,
                8am to 6pm East Africa Time
              </p>
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-6"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

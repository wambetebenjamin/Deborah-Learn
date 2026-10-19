import Link from "next/link";
import {
  BookOpen,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { categories } from "@/lib/data";
import { legalLinks, site, whatsappLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#46ddb0] text-[#06251d]">
                <BookOpen size={20} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-extrabold">{site.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-[#c6cdd4]">
              {site.tagline} An online school for learners in {site.serviceArea}.
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm text-[#c6cdd4]">
              <MapPin size={16} className="mt-1 shrink-0" aria-hidden="true" />
              {site.address}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 flex items-center gap-2 text-sm"
            >
              <Mail size={16} aria-hidden="true" />
              {site.email}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 text-sm"
            >
              <MessageCircle size={16} aria-hidden="true" />
              {site.whatsappDisplay}
            </a>
          </div>

          <div>
            <h4>Course categories</h4>
            <ul className="space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/courses?category=${category.slug}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Learn with us</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/courses">All courses</Link>
              </li>
              <li>
                <Link href="/instructors">Instructors</Link>
              </li>
              <li>
                <Link href="/dashboard">Student dashboard</Link>
              </li>
              <li>
                <Link href="/auth/signup">Create an account</Link>
              </li>
              <li>
                <Link href="/#how-it-works">How it works</Link>
              </li>
            </ul>
            <h4 className="mt-6">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Talk to a person</h4>
            <p className="mb-4 text-sm text-[#c6cdd4]">
              Questions about a course, fees, or group enrolment? Send us a WhatsApp
              message and we will reply during working hours in Nairobi.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Chat on WhatsApp
            </a>
            <div className="mt-6 flex gap-3">
              <a
                href={site.socials.facebook}
                aria-label="Facebook"
                className="social-chip"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={17} aria-hidden="true" />
              </a>
              <a
                href={site.socials.instagram}
                aria-label="Instagram"
                className="social-chip"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={17} aria-hidden="true" />
              </a>
              <a
                href={site.socials.linkedin}
                aria-label="LinkedIn"
                className="social-chip"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={17} aria-hidden="true" />
              </a>
              <a
                href={site.socials.x}
                aria-label="X"
                className="social-chip"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider flex flex-col justify-between gap-3 text-xs text-[#aab3bb] md:flex-row md:items-center">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Registered in Kenya. Serving learners across {site.serviceArea}.
          </p>
        </div>
      </div>
    </footer>
  );
}

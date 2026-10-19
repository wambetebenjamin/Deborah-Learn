import Link from "next/link";
import { BookOpen, MessageCircle } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="site-section">
      <div className="container-page max-w-2xl text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#e7fbf4] text-[#0c6b54]">
          <BookOpen size={42} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <p className="eyebrow mt-6">404, page not found</p>
        <h1 className="mt-2 text-3xl md:text-4xl">This lesson does not exist</h1>
        <p className="section-lede mx-auto">
          The page you asked for may have moved, or it was never published. All our courses are
          still in the catalogue, and your dashboard is one click away.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/courses" className="btn btn-primary">
            Back to courses
          </Link>
          <Link href="/" className="btn btn-outline">
            Go to home
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
      </div>
    </section>
  );
}

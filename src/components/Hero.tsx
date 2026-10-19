"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

const headline = ["Learn a skill.", "Build a future."];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let cleanup: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      const context = gsap.context(() => {
        gsap.from(".hero-word", {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.15,
        });
        gsap.from(".hero-fade", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          delay: 0.7,
        });
      }, root);
      cleanup = () => context.revert();
    });

    return () => cleanup?.();
  }, []);

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero-media">
        <Image
          src="/images/hero-student.jpg"
          alt="A student in Nairobi studying on a laptop beside a window"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="container-page">
        <div className="hero-inner">
          <span className="hero-tagline hero-fade">
            Online school for {site.serviceArea}
          </span>
          <h1 id="hero-title" className="mt-5">
            {headline.map((line, lineIndex) => (
              <span key={line} className="block">
                {line.split(" ").map((word, wordIndex) => (
                  <span className="word-reveal mr-[0.22em]" key={`${lineIndex}-${wordIndex}`}>
                    <span className="hero-word">{word}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-5">
            Deborah Learn is an online school for East African learners who want to grow
            their skills from wherever they are. Study at your own pace and earn a
            certificate you can share and verify.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap gap-3">
            <Link href="/courses" className="btn btn-primary">
              Browse courses
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/auth/signup" className="btn btn-ghost-light">
              Start free trial
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light"
            >
              <MessageCircle size={16} aria-hidden="true" />
              WhatsApp us
            </a>
          </div>
          <div className="hero-facts hero-fade">
            <div>
              <strong>12</strong>
              <span>Courses</span>
            </div>
            <div>
              <strong>14,800+</strong>
              <span>Learners</span>
            </div>
            <div>
              <strong>87%</strong>
              <span>Completion rate</span>
            </div>
            <div>
              <strong>KES 0</strong>
              <span>To start browsing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

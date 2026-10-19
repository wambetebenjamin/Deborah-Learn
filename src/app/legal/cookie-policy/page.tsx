import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Deborah Learn uses cookies and similar technologies, and how you can change your preferences.",
};

const sections: LegalSection[] = [
  {
    heading: "What cookies are",
    paragraphs: [
      "Cookies are small text files stored on your device by your browser. They help a website remember information between pages and visits. We also use localStorage, which works in a similar way but is not sent to our servers automatically.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      "When you first visit Deborah Learn, a banner asks whether you accept optional cookies. You can accept all cookies or open Manage preferences to choose functional, analytics, and marketing cookies separately. Necessary cookies are always on because the site cannot work without them.",
      "Your choice is stored in localStorage under the key deborah_learn_consent. To change your choice, clear site data in your browser settings and reload the page, or use the cookie settings control in the banner.",
    ],
  },
  {
    heading: "The cookies we use",
    bullets: [
      "Necessary: sign in session cookies, security tokens, and your consent record. These cannot be switched off.",
      "Functional: lesson notes saved in your browser, playback preferences, and interface choices.",
      "Analytics: Vercel Analytics and Speed Insights collect aggregate page and performance data. These help us see which lessons are used and where the site is slow.",
      "Marketing: measurement tags for campaigns that introduce new courses. These are off unless you accept marketing cookies.",
      "reCAPTCHA: Google may set cookies when you submit a protected form. These support fraud prevention and security.",
    ],
  },
  {
    heading: "Third parties",
    paragraphs: [
      "Some features use third party services, including Google reCAPTCHA, Google sign in, Vercel hosting and analytics, and WhatsApp links. These providers may set their own cookies when you interact with their features. Their privacy policies apply to that processing.",
    ],
  },
  {
    heading: "Managing cookies in your browser",
    paragraphs: [
      "Every major browser lets you view, delete, and block cookies. Blocking necessary cookies will prevent you from signing in and from saving lesson progress. The help pages for Chrome, Safari, Firefox, and Edge explain the steps for each browser.",
    ],
  },
  {
    heading: "Kenya Data Protection Act 2019",
    paragraphs: [
      "Our approach to consent follows the Kenya Data Protection Act 2019 and its guidance on cookies and similar technologies: optional cookies are off until you choose otherwise, your choice is recorded, and you can withdraw consent at any time.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "If you have a question about cookies, email hello@deborahlearn.co.ke or send a WhatsApp message to +254 112 272 061.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="This policy explains the cookies and local storage keys that Deborah Learn uses, and how you can control them."
      updated="1 October 2026"
      sections={sections}
    />
  );
}

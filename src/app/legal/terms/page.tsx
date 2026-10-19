import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you create a Deborah Learn account, enrol in a course, or use this website.",
};

const sections: LegalSection[] = [
  {
    heading: "Agreement",
    paragraphs: [
      "By creating an account or using this website, you agree to these Terms of Service. If you do not agree, please do not use the service. These terms are governed by the laws of Kenya.",
    ],
  },
  {
    heading: "Your account",
    bullets: [
      "You must provide accurate information and keep your password secure.",
      "You are responsible for activity that happens under your account.",
      "One account is for one learner. Group and institutional access is arranged separately.",
      "We may suspend an account that is used to share course content or to harm other learners.",
    ],
  },
  {
    heading: "Enrolment and fees",
    paragraphs: [
      "Course fees are shown in Kenyan shillings on each course page. Payment is required before full course access is granted, unless the course is marked free. Fees cover access for twelve months from the date of enrolment unless stated otherwise.",
      "Where a payment fails or is reversed, we may suspend access until the matter is resolved. Prices may change, but changes do not affect enrolments already paid for.",
    ],
  },
  {
    heading: "Refunds",
    paragraphs: [
      "You may request a refund within seven days of enrolment if you have completed less than twenty percent of the course. Refunds are made using the original payment method where possible. Free courses and certificate fees are not refundable.",
    ],
  },
  {
    heading: "Course content and licence",
    paragraphs: [
      "Course videos, notes, and assessments are owned by Deborah Learn or licensed to us by the instructor. When you enrol, you receive a personal, non-transferable licence to view the material for your own learning.",
      "You may not record, download, resell, or share course material, or use it to train another person commercially, without written permission.",
    ],
  },
  {
    heading: "Certificates",
    paragraphs: [
      "A certificate is issued when every lesson in a course is marked complete. Certificates carry a unique ID and a public verification page. We may revoke a certificate if it was obtained through misrepresentation or account sharing.",
    ],
  },
  {
    heading: "Acceptable use",
    bullets: [
      "Do not attempt to access another learner's account or our internal systems.",
      "Do not upload malicious code or interfere with the availability of the service.",
      "Do not post abusive, discriminatory, or unlawful material in notes or messages.",
      "Do not misrepresent your identity or your qualifications.",
    ],
  },
  {
    heading: "Instructor content and availability",
    paragraphs: [
      "We work to keep courses available and up to date, but we may update, pause, or retire a course. If a course you paid for is withdrawn within your access period, we will offer an alternative course or a proportionate refund.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "Deborah Learn provides education and training. We do not guarantee employment, income, examination results, or any specific outcome. To the extent permitted by Kenyan law, our liability for any claim is limited to the fee you paid for the course concerned.",
      "Nothing in these terms limits liability that cannot be limited by law, including liability for fraud or death or personal injury caused by negligence.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "We may update these terms. Material changes will be announced on this page with a new date. Continued use of the service after a change means you accept the updated terms.",
      "Questions about these terms can be sent to hello@deborahlearn.co.ke or on WhatsApp to +254 112 272 061.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms set out the agreement between you and Deborah Learn when you create an account, enrol in a course, or use this website."
      updated="1 October 2026"
      sections={sections}
    />
  );
}

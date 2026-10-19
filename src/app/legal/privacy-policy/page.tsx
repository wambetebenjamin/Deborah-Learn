import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Deborah Learn collects, uses, stores, and protects personal data under the Kenya Data Protection Act 2019.",
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "Deborah Learn is an online school serving learners in Kenya and East Africa. For the purposes of the Kenya Data Protection Act 2019, Deborah Learn is the data controller for personal data collected through this website and our learning platform.",
      "You can reach our data protection contact at hello@deborahlearn.co.ke, or by WhatsApp on +254 112 272 061.",
    ],
  },
  {
    heading: "What we collect",
    bullets: [
      "Account data: your name, email address, hashed password, and the date you created your account.",
      "Learning data: courses you enrol in, lessons you complete, notes you choose to write, and certificates issued to you.",
      "Payment data: the amount paid, the course paid for, and a payment reference. We do not store card numbers on our servers.",
      "Communication data: messages you send through the contact form, email, or WhatsApp.",
      "Technical data: device type, browser, and general location derived from your IP address, used for security and to improve the service.",
      "Cookie data: preferences you set in the cookie banner, stored on your device.",
    ],
  },
  {
    heading: "Why we use your data",
    bullets: [
      "To create and secure your account.",
      "To deliver courses, save your progress, and issue certificates.",
      "To respond to enquiries and provide learner support.",
      "To meet tax, accounting, and regulatory obligations in Kenya.",
      "To send service messages about your enrolment. Marketing messages are only sent where you have opted in.",
      "To understand how the site is used, using aggregate analytics data.",
    ],
  },
  {
    heading: "Lawful basis",
    paragraphs: [
      "We rely on the performance of a contract when delivering a course you have enrolled in, on consent for optional cookies and marketing messages, on legal obligation for tax and accounting records, and on legitimate interests for security and service improvement.",
    ],
  },
  {
    heading: "Who we share data with",
    paragraphs: [
      "We share only what is necessary with service providers who help us run the school. These include hosting and storage providers, email delivery providers, payment processors, and analytics providers. Where a provider processes data outside Kenya, we require appropriate safeguards consistent with the Data Protection Act 2019.",
      "We do not sell personal data. We may disclose data where required by law, or to protect the rights and safety of learners and staff.",
    ],
  },
  {
    heading: "How long we keep data",
    paragraphs: [
      "Account and learning records are kept while your account is active and for seven years after a certificate is issued, so that certificates can be verified.",
      "Enquiry messages are kept for two years. Accounting records are kept for seven years as required by Kenyan law.",
      "Optional analytics data is kept in aggregate form and does not identify you individually.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Under the Data Protection Act 2019 you have the right to be informed, to access your data, to correct inaccurate data, to request deletion, to object to processing, to data portability, and to withdraw consent at any time.",
      "To exercise a right, email hello@deborahlearn.co.ke with the subject line Data request. We will respond within a reasonable period, and in any event within the timelines set by the Office of the Data Protection Commissioner. You may also lodge a complaint with the Office of the Data Protection Commissioner in Kenya.",
    ],
  },
  {
    heading: "How we protect data",
    paragraphs: [
      "Passwords are stored as salted hashes and are never stored in plain text. Traffic to this site is encrypted with HTTPS. Access to learner records is limited to staff who need it to provide the service.",
      "If a breach occurs that is likely to result in a risk to your rights, we will notify you and the Office of the Data Protection Commissioner as required by law.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "Learners under 18 should enrol with the consent of a parent or guardian. Where we learn that data has been collected from a child without consent, we will delete it promptly.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "We use necessary cookies to keep you signed in and optional cookies for preferences, analytics, and marketing. You can change your choices at any time by clearing the consent record in your browser and reloading the site. See our Cookie Policy for details.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. The date at the top of the page shows when it last changed. Significant changes will be announced on the site or by email.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what personal data Deborah Learn collects, why we collect it, and the choices you have under the Kenya Data Protection Act 2019."
      updated="1 October 2026"
      sections={sections}
    />
  );
}

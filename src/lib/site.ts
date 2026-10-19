export const site = {
  name: "Deborah Learn",
  shortName: "Deborah Learn",
  tagline: "Knowledge that travels with you.",
  description:
    "Deborah Learn is an online school for Kenya and East Africa. Browse courses, learn at your own pace, and earn a certificate you can share and verify.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254112272061",
  whatsappDisplay: "+254 112 272 061",
  whatsappMessage:
    "Hello Deborah Learn, I would like to enrol in a course or ask about your programmes.",
  email: "hello@deborahlearn.co.ke",
  address: "Westlands, Nairobi, Kenya",
  serviceArea: "Kenya and East Africa",
  socials: {
    facebook: "https://facebook.com/deborahlearn",
    instagram: "https://instagram.com/deborahlearn",
    linkedin: "https://linkedin.com/company/deborahlearn",
    x: "https://x.com/deborahlearn",
  },
  locale: "en-KE",
} as const;

export function whatsappLink(message: string = site.whatsappMessage) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Instructors", href: "/instructors" },
  { label: "Dashboard", href: "/dashboard" },
] as const;

export const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
] as const;

export const stats = [
  { label: "Courses", value: 12, suffix: "" },
  { label: "Students", value: 14800, suffix: "+" },
  { label: "Instructors", value: 6, suffix: "" },
  { label: "Completion rate", value: 87, suffix: "%" },
] as const;

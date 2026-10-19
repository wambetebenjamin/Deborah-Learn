# Deborah Learn

Knowledge that travels with you. An online school for Kenya and East Africa, built on top of the
uploaded `oneschool-master` template without redesigning it.

- Live brand: Deborah Learn
- Service area: Kenya and East Africa
- WhatsApp: +254 112 272 061
- Stack: Next.js 16.4.2 (App Router), React 19.2.0, Tailwind CSS 4.1.10, TypeScript 5.8.3,
  NextAuth 5 beta, Framer Motion, GSAP, Lenis

The full template audit (file tree, CSS custom properties, @font-face rules, missing routes and
components) is in [AUDIT.md](./AUDIT.md).

## Quick start

```bash
npm install          # .npmrc sets legacy-peer-deps for the NextAuth beta peer range
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Production check:

```bash
npm ci
npx tsc --noEmit
npx next build
npm audit --audit-level=high
```

Demo learner account, seeded automatically in development or when KV is not configured:

```text
email:    demo@deborahlearn.co.ke
password: Deborah2026
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage: hero, categories, featured courses, how it works, instructors, testimonials, stats, contact |
| `/courses` | Catalogue with category, level, price, duration and search filters plus pagination |
| `/courses/[slug]` | Course detail with outcomes, curriculum accordion, requirements, reviews and sticky enrol sidebar |
| `/learn/[courseSlug]/[lessonSlug]` | Lesson player (session required), video, notes, prev/next, checklist sidebar, progress bar |
| `/dashboard` | Student dashboard (session required): progress, certificates, recommendations, activity |
| `/certificates/[id]` | Public certificate with QR verification and PDF download (jsPDF + html2canvas) |
| `/instructors`, `/instructors/[slug]` | Instructor directory and profiles |
| `/auth/signin`, `/auth/signup` | Credentials plus Google OAuth, react-hook-form + zod, reCAPTCHA v3 |
| `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy` | Legal pages, Kenya Data Protection Act 2019 |
| `/404`, `/500` | Branded `not-found.tsx` and `error.tsx` |

## API

| Route | Method | Notes |
| --- | --- | --- |
| `/api/courses` | GET | `category`, `level`, `price`, `search`, `page`, `limit` |
| `/api/courses/[slug]` | GET | Full course detail plus instructor profile |
| `/api/enrolment/create` | POST | Session required, `{ courseId }` |
| `/api/progress/update` | POST | Session required, `{ courseId, lessonId, completed }` |
| `/api/certificates/generate` | POST | Session required, `{ courseId }`, only at 100 percent completion |
| `/api/contact` | POST | reCAPTCHA verified, sends mail with nodemailer |
| `/api/recaptcha/verify` | POST | `{ token, action, version }` |
| `/api/auth/*` | GET/POST | NextAuth handlers, plus `/api/auth/signup` for account creation |

## Environment variables

All names are listed in `.env.example`. Nothing is hard coded: WhatsApp number and site URL have
safe fallbacks, every secret is read from the environment only.

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=254112272061
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PEXELS_API_KEY=
KV_REST_API_URL=
KV_REST_API_TOKEN=
BLOB_READ_WRITE_TOKEN=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Optional extras used by the app:

```text
SMTP_TO=                       # inbox for contact form mail
NEXT_PUBLIC_BLOB_BASE_URL=     # public Vercel Blob base URL for lesson videos
```

Behaviour without keys, which is how the preview runs:

- reCAPTCHA is skipped when no site or secret key is set. Add both keys and verification is
  enforced server side; a v3 score below 0.5 returns `428 requiresV2` and the form renders the
  v2 checkbox automatically.
- Google sign in appears only when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- Contact mail is logged instead of sent when SMTP is not configured, and the API still returns
  `ok: true` with `delivered: false`.
- Records fall back to an in process store when KV is not configured. Set `KV_REST_API_URL` and
  `KV_REST_API_TOKEN` for persistence across deploys.
- Lesson videos stream from Vercel Blob when `NEXT_PUBLIC_BLOB_BASE_URL` is set, otherwise from
  the bundled preview clips in `public/videos/`.

## Design and behaviour notes

- Palette, type scale and button shapes come from the template (`#46ddb0` primary, `#7971ea`
  accent, Raleway headings, Muli body, pill buttons, light surfaces). Nothing was redesigned.
- Template assets were copied, not moved: icons fonts in `public/fonts/`, images in
  `public/images/template/`, and the original extraction kept in `oneschool-master/`.
- Ten animations: Lenis smooth scroll, GSAP hero word reveal, Framer category stagger, Framer
  course card lift, Framer curriculum accordion, GSAP dashboard progress fill, count up stats,
  CSS 3D instructor flip, Framer certificate reveal, WhatsApp entrance pulse.
- Accessibility: skip link, visible focus rings, `role="status"` preloader, reduced motion
  fallbacks for every animated component, labelled form fields and progress bars.
- No em dashes anywhere in the project. No stars, sparkles, diamonds, gold or dark theme.

## Assets

Image sources and licences are listed in `public/images/image-credits.md`. The brief asked for
Pexels photography; this build environment could not reach Pexels, so the photographs were
generated for the project and `images.pexels.com` is already allow listed in `next.config.ts`
for when you swap them in.

## Marketing

The social caption from the brief is saved at `marketing/social-media-caption.txt`.

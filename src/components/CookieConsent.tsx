"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "deborah_learn_consent";

type Consent = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: 1;
};

const defaultPrefs = { functional: true, analytics: true, marketing: false };

export default function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else {
      try {
        const parsed = JSON.parse(stored) as Consent;
        setPrefs({
          functional: Boolean(parsed.functional),
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        });
      } catch {
        setVisible(true);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    document.body.dataset.consent = visible ? "open" : "closed";
  }, [visible]);

  const save = (next: typeof defaultPrefs) => {
    const record: Consent = {
      necessary: true,
      functional: next.functional,
      analytics: next.analytics,
      marketing: next.marketing,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent("deborah-consent-updated", { detail: record }));
    setPrefs(next);
    setVisible(false);
    setModalOpen(false);
  };

  if (!ready || !visible) return null;

  return (
    <>
      <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
        <div className="container-page flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e7fbf4] text-[#0c6b54]">
              <Cookie size={18} aria-hidden="true" />
            </span>
            <p className="text-sm text-[#4b5563]">
              We use cookies to keep you signed in, remember your preferences, and
              understand how the school is used. Read our{" "}
              <Link href="/legal/cookie-policy" className="font-semibold text-[#111315] underline">
                Cookie Policy
              </Link>
              . Your choices are stored under the Kenya Data Protection Act 2019.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setModalOpen(true)}
            >
              Manage preferences
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => save({ functional: true, analytics: true, marketing: true })}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="cookie-modal-backdrop" role="presentation">
          <div
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="cookie-preferences-title" className="text-xl">
                  Cookie preferences
                </h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Choose which cookies Deborah Learn may use. Necessary cookies cannot be
                  switched off because the site cannot work without them.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close cookie preferences"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#e5e9ee]"
                onClick={() => setModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-[#edf0f5] pb-4">
                <div>
                  <p className="font-semibold text-[#111315]">Necessary</p>
                  <p className="text-sm text-[#6b7280]">
                    Sign in, security, and your consent record. Always on.
                  </p>
                </div>
                <button type="button" className="switch" data-on="true" disabled aria-label="Necessary cookies, always on">
                  <span className="sr-only">Always on</span>
                </button>
              </div>

              {([
                { key: "functional", title: "Functional", copy: "Remembers your lesson notes and playback preferences." },
                { key: "analytics", title: "Analytics", copy: "Helps us understand which lessons are useful." },
                { key: "marketing", title: "Marketing", copy: "Allows us to measure campaigns about new courses." },
              ] as const).map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 border-b border-[#edf0f5] pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-[#111315]">{item.title}</p>
                    <p className="text-sm text-[#6b7280]">{item.copy}</p>
                  </div>
                  <button
                    type="button"
                    className="switch"
                    data-on={String(prefs[item.key])}
                    aria-label={`${item.title} cookies`}
                    aria-pressed={prefs[item.key]}
                    onClick={() =>
                      setPrefs((current) => ({ ...current, [item.key]: !current[item.key] }))
                    }
                  >
                    <span className="sr-only">
                      {prefs[item.key] ? "On" : "Off"}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => save({ functional: false, analytics: false, marketing: false })}
              >
                Reject optional
              </button>
              <button type="button" className="btn btn-dark btn-sm" onClick={() => save(prefs)}>
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

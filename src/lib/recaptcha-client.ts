"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GrecaptchaV3 = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

type GrecaptchaV2 = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      theme?: "light" | "dark";
    },
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: GrecaptchaV3 & Partial<GrecaptchaV2>;
    __dlRecaptchaV2Loaded?: () => void;
  }
}

const V3_SRC = "https://www.google.com/recaptcha/api.js?render=";
const V2_SRC = "https://www.google.com/recaptcha/api.js?onload=__dlRecaptchaV2Loaded&render=explicit";

function loadScript(id: string, src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export function useRecaptcha(action: string) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
  const [v2Required, setV2Required] = useState(false);
  const [v2Token, setV2Token] = useState("");
  const [v2Error, setV2Error] = useState("");
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    loadScript("recaptcha-v3", `${V3_SRC}${siteKey}`)
      .then(() => setLoaded(true))
      .catch(() => setV2Error("reCAPTCHA could not load. Check your connection and try again."));
  }, [siteKey]);

  useEffect(() => {
    if (!v2Required || !siteKey || !containerRef.current) return;
    let cancelled = false;

    window.__dlRecaptchaV2Loaded = () => {
      if (cancelled || !containerRef.current || !window.grecaptcha?.render) return;
      if (widgetId.current !== null) return;
      widgetId.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        callback: (token: string) => {
          setV2Token(token);
          setV2Error("");
        },
        "expired-callback": () => setV2Token(""),
      });
      setLoaded(true);
    };

    if (window.grecaptcha?.render) {
      window.__dlRecaptchaV2Loaded();
    } else {
      loadScript("recaptcha-v2", V2_SRC).catch(() =>
        setV2Error("reCAPTCHA could not load. Check your connection and try again."),
      );
    }

    return () => {
      cancelled = true;
    };
  }, [v2Required, siteKey]);

  const getToken = useCallback(async () => {
    if (!siteKey || !window.grecaptcha?.execute) return "";
    return new Promise<string>((resolve) => {
      window.grecaptcha?.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(siteKey, { action });
          resolve(token);
        } catch {
          resolve("");
        }
      });
    });
  }, [action, siteKey]);

  const requireV2 = useCallback(() => setV2Required(true), []);

  return {
    siteKey,
    configured: Boolean(siteKey),
    loaded,
    v2Required,
    v2Token,
    v2Error,
    containerRef,
    getToken,
    requireV2,
  };
}

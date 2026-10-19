"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export default function WhatsAppButton() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setPulse(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button floating-action"
      aria-label="Chat with Deborah Learn on WhatsApp"
    >
      {pulse && <span className="pulse-ring" aria-hidden="true" />}
      <MessageCircle size={26} strokeWidth={2} aria-hidden="true" />
      <span className="floating-tooltip" role="tooltip">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}

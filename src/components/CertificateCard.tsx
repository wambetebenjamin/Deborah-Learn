"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Download, Loader2, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";
import { formatDate } from "@/lib/utils";

export type CertificateView = {
  id: string;
  studentName: string;
  courseTitle: string;
  courseSlug: string;
  issuedAt: string;
};

export default function CertificateCard({ certificate }: { certificate: CertificateView }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [qr, setQr] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const verifyUrl =
    typeof window === "undefined"
      ? `/certificates/${certificate.id}`
      : `${window.location.origin}/certificates/${certificate.id}`;

  useEffect(() => {
    QRCode.toDataURL(window.location.href, {
      width: 220,
      margin: 1,
      color: { dark: "#111315", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(""));
  }, []);

  const downloadPdf = async () => {
    if (!sheetRef.current || downloading) return;
    setDownloading(true);
    setError("");

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(sheetRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const image = canvas.toDataURL("image/jpeg", 0.96);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;

      pdf.addImage(image, "JPEG", (pageWidth - width) / 2, (pageHeight - height) / 2, width, height);
      pdf.save(`Deborah-Learn-Certificate-${certificate.id}.pdf`);
    } catch {
      setError("The PDF could not be created. You can print this page instead.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="certificate-frame">
        <div className="certificate-sheet" ref={sheetRef}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[10px] bg-[#46ddb0] text-[#06251d]">
                <Award size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg font-extrabold tracking-tight text-[#111315]">
                  Deborah Learn
                </p>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#8a94a0]">
                  Knowledge that travels with you
                </p>
              </div>
            </div>
            <p className="text-right text-[0.68rem] uppercase tracking-[0.18em] text-[#8a94a0]">
              Certificate ID
              <span className="mt-1 block font-mono text-[0.8rem] font-semibold tracking-normal text-[#111315]">
                {certificate.id}
              </span>
            </p>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#16866b]">
              Certificate of completion
            </p>
            <p className="mt-4 text-sm text-[#5b6470]">This certifies that</p>
            <p className="certificate-name mt-2">{certificate.studentName}</p>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#5b6470]">
              has successfully completed all lessons and assessments in
            </p>
            <p className="mt-2 font-display text-xl font-bold text-[#111315] md:text-2xl">
              {certificate.courseTitle}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-[#8a94a0]">
              Awarded by Deborah Learn, an online school serving learners in Kenya and East
              Africa. This certificate can be verified using the code above or the QR code
              below.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-display text-sm font-bold text-[#111315]">Completion date</p>
              <p className="text-sm text-[#5b6470]">{formatDate(certificate.issuedAt)}</p>
              <div className="mt-6 w-44 border-t border-[#cdd4dc] pt-2">
                <p className="font-display text-sm font-bold text-[#111315]">Deborah Wanjala</p>
                <p className="text-xs text-[#8a94a0]">Academic Director</p>
              </div>
            </div>

            <div className="text-center">
              {qr ? (
                <img src={qr} alt={`QR code verifying certificate ${certificate.id}`} width={92} height={92} />
              ) : (
                <div className="grid h-[92px] w-[92px] place-items-center border border-[#e6ece9] text-[0.6rem] text-[#8a94a0]">
                  QR code
                </div>
              )}
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.12em] text-[#8a94a0]">
                Scan to verify
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-[#0c6b54]">
          <CheckCircle2 size={16} aria-hidden="true" />
          Verified certificate issued by Deborah Learn
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={downloadPdf}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Download size={16} aria-hidden="true" />
            )}
            Download as PDF
          </button>
          <Link href={`/courses/${certificate.courseSlug}`} className="btn btn-outline">
            View course
          </Link>
        </div>
      </div>

      {error && <p className="field-error mt-2">{error}</p>}

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#f8f9fa] p-3 text-xs text-[#5b6470]">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#16866b]" aria-hidden="true" />
        <span>
          Anyone can check this certificate by opening{" "}
          <span className="font-semibold text-[#111315]">{verifyUrl}</span> or scanning the
          QR code. Certificate records are kept for seven years.
        </span>
      </div>
    </motion.div>
  );
}

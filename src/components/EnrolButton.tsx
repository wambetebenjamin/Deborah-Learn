"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatKES } from "@/lib/utils";

export default function EnrolButton({
  courseSlug,
  price,
  firstLessonSlug,
  enrolled = false,
  className = "btn btn-primary w-full",
}: {
  courseSlug: string;
  price: number;
  firstLessonSlug: string;
  enrolled?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setError("");

    if (status !== "authenticated") {
      router.push(`/auth/signin?callbackUrl=/courses/${courseSlug}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/enrolment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseSlug }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        nextLesson?: string | null;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Enrolment could not be created");
        setLoading(false);
        return;
      }

      router.push(`/learn/${courseSlug}/${data.nextLesson ?? firstLessonSlug}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" className={className} onClick={handleClick} disabled={loading}>
        {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {enrolled ? "Continue learning" : `Enrol for ${formatKES(price)}`}
      </button>
      {error && <p className="field-error">{error}</p>}
      <p className="mt-2 text-center text-[0.72rem] text-[#8a94a0]">
        Pay by M-Pesa or card. You keep access for 12 months.
      </p>
    </div>
  );
}

import Image from "next/image";
import { testimonials } from "@/lib/data";
import { Rating } from "./ui";

export default function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {testimonials.map((item) => (
        <figure className="quote-card flex flex-col" key={item.name}>
          <span className="quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="mt-1 flex-1 text-[0.98rem] text-[#3f4854]">
            {item.quote}
          </blockquote>
          <Rating value={5} showValue={false} />
          <figcaption className="mt-5 flex items-center gap-3 border-t border-[#edf0f5] pt-4">
            <Image
              src={item.photo}
              alt={`Portrait of ${item.name}`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-sm font-bold text-[#111315]">{item.name}</p>
              <p className="text-xs text-[#8a94a0]">{item.role}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

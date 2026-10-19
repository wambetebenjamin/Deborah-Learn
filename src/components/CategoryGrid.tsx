"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Code2,
  GraduationCap,
  HeartPulse,
  Palette,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { categories, categoryCount } from "@/lib/data";

const icons: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  code: Code2,
  heart: HeartPulse,
  graduation: GraduationCap,
  palette: Palette,
  sprout: Sprout,
};

export default function CategoryGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => {
        const Icon = icons[category.icon] ?? Briefcase;
        return (
          <motion.div
            key={category.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <Link href={`/courses?category=${category.slug}`} className="category-card">
              <span
                className="category-icon"
                style={{ background: `${category.accent}1f`, color: category.accent }}
              >
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-count">
                {categoryCount(category.slug)} courses
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

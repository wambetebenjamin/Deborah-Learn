import type { MetadataRoute } from "next";
import { courses, instructors } from "@/lib/data";
import { legalLinks, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/courses", "/instructors", "/auth/signin", "/auth/signup"].map(
    (route) => ({
      url: `${site.url}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  const courseRoutes = courses.map((course) => ({
    url: `${site.url}/courses/${course.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const instructorRoutes = instructors.map((instructor) => ({
    url: `${site.url}/instructors/${instructor.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const legalRoutes = legalLinks.map((link) => ({
    url: `${site.url}${link.href}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...courseRoutes, ...instructorRoutes, ...legalRoutes];
}

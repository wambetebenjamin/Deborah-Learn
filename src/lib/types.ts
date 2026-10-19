export type Level = "Beginner" | "Intermediate" | "Advanced";

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  minutes: number;
  freePreview?: boolean;
  videoUrl: string;
  notes: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  level: Level;
  price: number;
  durationHours: number;
  students: number;
  rating: number;
  reviewCount: number;
  instructor: string;
  cover: string;
  summary: string;
  description: string;
  outcomes: string[];
  requirements: string[];
  audience: string[];
  includes: {
    videoHours: number;
    articles: number;
    certificate: boolean;
    downloadable: number;
  };
  modules: Module[];
  reviews: { name: string; location: string; rating: number; quote: string }[];
  featured: boolean;
  updated: string;
};

export type Instructor = {
  slug: string;
  name: string;
  subject: string;
  role: string;
  bio: string;
  longBio: string;
  photo: string;
  students: number;
  rating: number;
  courses: string[];
  location: string;
  socials: { linkedin?: string; x?: string; website?: string };
};

export type Enrolment = {
  id: string;
  userEmail: string;
  courseSlug: string;
  createdAt: string;
  completedLessons: string[];
  lastLessonSlug?: string;
};

export type Certificate = {
  id: string;
  userEmail: string;
  studentName: string;
  courseSlug: string;
  courseTitle: string;
  issuedAt: string;
};

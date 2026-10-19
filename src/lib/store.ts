import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Certificate, Enrolment } from "./types";

type StoredUser = {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

type Activity = {
  id: string;
  userEmail: string;
  type: "enrolled" | "completed" | "certificate";
  message: string;
  createdAt: string;
};

const memory = globalThis as unknown as {
  __deborahStore?: {
    enrolments: Enrolment[];
    certificates: Certificate[];
    users: StoredUser[];
    activity: Activity[];
    seeded: boolean;
  };
};

function fallbackStore() {
  if (!memory.__deborahStore) {
    memory.__deborahStore = {
      enrolments: [],
      certificates: [],
      users: [],
      activity: [],
      seeded: false,
    };
  }
  return memory.__deborahStore;
}

const hasKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function readCollection<T>(key: string, fallback: T[]): Promise<T[]> {
  if (!hasKv) return fallback;
  try {
    const { kv } = await import("@vercel/kv");
    const value = await kv.get<T[]>(key);
    return value ?? [];
  } catch {
    return fallback;
  }
}

async function writeCollection<T>(key: string, value: T[], fallback: T[]) {
  if (!hasKv) return;
  try {
    const { kv } = await import("@vercel/kv");
    await kv.set(key, value);
  } catch {
    // The in memory store remains the source of truth when KV is unavailable.
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

async function seed() {
  const store = fallbackStore();
  if (store.seeded) return;
  store.seeded = true;

  const demoEmail = "demo@deborahlearn.co.ke";
  if (!store.users.some((user) => user.email === demoEmail)) {
    store.users.push({
      email: demoEmail,
      name: "Amina Wambui",
      passwordHash: hashPassword("Deborah2026"),
      createdAt: new Date().toISOString(),
    });
  }

  if (store.enrolments.length === 0) {
    const created = new Date();
    created.setDate(created.getDate() - 21);
    store.enrolments.push({
      id: "enr-demo-1",
      userEmail: demoEmail,
      courseSlug: "web-development-foundations",
      createdAt: created.toISOString(),
      completedLessons: [
        "web-development-foundations-m1-l1",
        "web-development-foundations-m1-l2",
        "web-development-foundations-m1-l3",
        "web-development-foundations-m1-l4",
        "web-development-foundations-m2-l1",
        "web-development-foundations-m2-l2",
      ],
      lastLessonSlug: "working-with-the-page",
    });
    store.activity.push({
      id: "act-demo-1",
      userEmail: demoEmail,
      type: "completed",
      message: "Completed the lesson Working with the page",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    });
    store.activity.push({
      id: "act-demo-2",
      userEmail: demoEmail,
      type: "enrolled",
      message: "Enrolled in Web Development Foundations with JavaScript",
      createdAt: created.toISOString(),
    });
  }

  if (store.certificates.length === 0) {
    const issued = new Date();
    issued.setDate(issued.getDate() - 9);
    store.certificates.push({
      id: "DL-2026-A7F4K2",
      userEmail: demoEmail,
      studentName: "Amina Wambui",
      courseSlug: "community-health-practice",
      courseTitle: "Community Health and Wellness Practice",
      issuedAt: issued.toISOString(),
    });
    store.activity.push({
      id: "act-demo-3",
      userEmail: demoEmail,
      type: "certificate",
      message: "Earned a certificate in Community Health and Wellness Practice",
      createdAt: issued.toISOString(),
    });
  }
}

export async function getUsers() {
  await seed();
  return readCollection<StoredUser>("dl:users", fallbackStore().users);
}

export async function findUser(email: string) {
  const users = await getUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(input: { email: string; name: string; password: string }) {
  await seed();
  const store = fallbackStore();
  const users = await getUsers();
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    return null;
  }
  const user: StoredUser = {
    email: input.email.toLowerCase(),
    name: input.name,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await writeCollection("dl:users", store.users, store.users);
  return user;
}

export async function listEnrolments(userEmail: string) {
  await seed();
  const all = await readCollection<Enrolment>("dl:enrolments", fallbackStore().enrolments);
  return all.filter((item) => item.userEmail === userEmail.toLowerCase());
}

export async function getEnrolment(userEmail: string, courseSlug: string) {
  const enrolments = await listEnrolments(userEmail);
  return enrolments.find((item) => item.courseSlug === courseSlug) ?? null;
}

export async function createEnrolment(userEmail: string, courseSlug: string) {
  await seed();
  const existing = await getEnrolment(userEmail, courseSlug);
  if (existing) return existing;
  const store = fallbackStore();
  const enrolment: Enrolment = {
    id: `enr-${randomBytes(6).toString("hex")}`,
    userEmail: userEmail.toLowerCase(),
    courseSlug,
    createdAt: new Date().toISOString(),
    completedLessons: [],
  };
  store.enrolments.push(enrolment);
  await writeCollection("dl:enrolments", store.enrolments, store.enrolments);
  return enrolment;
}

export async function updateProgress(
  userEmail: string,
  courseSlug: string,
  lessonId: string,
  completed: boolean,
) {
  await seed();
  const store = fallbackStore();
  const enrolment = await createEnrolment(userEmail, courseSlug);
  const set = new Set(enrolment.completedLessons);
  if (completed) set.add(lessonId);
  else set.delete(lessonId);
  enrolment.completedLessons = Array.from(set);
  const index = store.enrolments.findIndex((item) => item.id === enrolment.id);
  if (index >= 0) store.enrolments[index] = enrolment;
  await writeCollection("dl:enrolments", store.enrolments, store.enrolments);
  return enrolment;
}

export async function listCertificates(userEmail?: string) {
  await seed();
  const all = await readCollection<Certificate>("dl:certificates", fallbackStore().certificates);
  if (!userEmail) return all;
  return all.filter((item) => item.userEmail === userEmail.toLowerCase());
}

export async function getCertificate(id: string) {
  const all = await listCertificates();
  return all.find((item) => item.id === id) ?? null;
}

export async function createCertificate(input: {
  userEmail: string;
  studentName: string;
  courseSlug: string;
  courseTitle: string;
}) {
  await seed();
  const store = fallbackStore();
  const existing = (await listCertificates(input.userEmail)).find(
    (item) => item.courseSlug === input.courseSlug,
  );
  if (existing) return existing;
  const year = new Date().getFullYear();
  const certificate: Certificate = {
    id: `DL-${year}-${randomBytes(4).toString("hex").toUpperCase()}`,
    userEmail: input.userEmail.toLowerCase(),
    studentName: input.studentName,
    courseSlug: input.courseSlug,
    courseTitle: input.courseTitle,
    issuedAt: new Date().toISOString(),
  };
  store.certificates.push(certificate);
  await writeCollection("dl:certificates", store.certificates, store.certificates);
  return certificate;
}

export async function listActivity(userEmail: string) {
  await seed();
  const store = fallbackStore();
  const all = await readCollection<Activity>("dl:activity", store.activity);
  return all
    .filter((item) => item.userEmail === userEmail.toLowerCase())
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function recordActivity(input: {
  userEmail: string;
  type: Activity["type"];
  message: string;
}) {
  await seed();
  const store = fallbackStore();
  store.activity.push({
    id: `act-${randomBytes(5).toString("hex")}`,
    userEmail: input.userEmail.toLowerCase(),
    type: input.type,
    message: input.message,
    createdAt: new Date().toISOString(),
  });
  await writeCollection("dl:activity", store.activity, store.activity);
}

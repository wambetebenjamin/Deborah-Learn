import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { findUser, verifyPassword } from "@/lib/store";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  recaptchaToken: z.string().optional(),
  recaptchaVersion: z.enum(["v2", "v3"]).optional(),
});

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;

      const verification = await verifyRecaptcha(parsed.data.recaptchaToken, {
        action: "signin",
        version: parsed.data.recaptchaVersion ?? "v3",
      });
      if (!verification.success) return null;

      const user = await findUser(parsed.data.email);
      if (!user) return null;
      if (!verifyPassword(parsed.data.password, user.passwordHash)) return null;
      return { id: user.email, name: user.name, email: user.email };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "deborah-learn-development-secret",
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? user.email ?? token.sub;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.sub ?? token.email ?? "");
        session.user.email = (token.email as string | undefined) ?? session.user.email;
        session.user.name = (token.name as string | undefined) ?? session.user.name;
      }
      return session;
    },
  },
});

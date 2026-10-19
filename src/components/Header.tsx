"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BookOpen, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={cn("site-header", scrolled && "is-scrolled")}>
      <div className="container-page">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="site-logo" aria-label={`${site.name} home`}>
            <span className="site-logo-mark" aria-hidden="true">
              <BookOpen size={20} strokeWidth={2.2} />
            </span>
            <span>
              {site.name}
              <span className="block text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#7a838d]">
                Online school
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                data-active={pathname === link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" className="btn btn-outline btn-sm">
                  <LayoutDashboard size={15} aria-hidden="true" />
                  {session?.user?.name?.split(" ")[0] ?? "Dashboard"}
                </Link>
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut size={15} aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="btn btn-outline btn-sm">
                  Sign in
                </Link>
                <Link href="/courses" className="btn btn-primary btn-sm">
                  Browse courses
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#dde3e8] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div id="mobile-menu" className="border-t border-[#edf0f5] py-4 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm font-semibold text-[#3f4854] hover:bg-[#f6f8f9]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/auth/signin"
                className="rounded-md px-3 py-2.5 text-sm font-semibold text-[#3f4854] hover:bg-[#f6f8f9]"
              >
                Sign in
              </Link>
            </nav>
            <Link href="/courses" className="btn btn-primary mt-3 w-full">
              Browse courses
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

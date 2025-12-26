"use client";

import { useAuth } from "@/components/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdClose, MdMenu } from "react-icons/md";
import NavLink from "./NavLink";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/guide", label: "가이드" },
  { href: "/doctrine", label: "독트린" },
  { href: "/fitting", label: "피팅" },
  { href: "/market", label: "장터" },
];

const shell = "fixed inset-x-0 top-0 z-50";
const container = "mx-auto max-w-5xl px-4 py-3";
const card = "glass rounded-2xl border border-white/40 bg-white/60 backdrop-blur-2xl";
const row = "flex items-center justify-between px-4 py-3 md:grid md:grid-cols-3";
const mobilePanel = "md:hidden border-t border-white/50";
const linkMobile = "link-underline rounded-xl px-3 py-2 text-base text-[var(--muted)] hover:text-[var(--primary)]";

export default function Header() {
  const pathname = usePathname();
  const { me, loadingMe } = useAuth();

  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showProfileImage = !loadingMe && me?.ok && me?.portrait && !imgError;

  return (
    <header className={shell}>
      <div className={container}>
        <div className={card}>
          <div className={row}>
            {/* Left: Brand / Burger */}
            <div className="flex items-center gap-2">
              <button
                aria-label="메뉴 열기"
                aria-expanded={open}
                aria-controls="mobile-nav"
                className="btn-neu px-3 py-2 md:hidden"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <MdClose size={22} /> : <MdMenu size={22} />}
              </button>

              <Link href="/" className="hidden md:inline-flex items-center">
                <Image src="/favicon-origin.png" alt="CAT4U 로고" width={36} height={36} priority />
              </Link>
            </div>

            {/* Center: Nav */}
            <nav className="hidden md:flex items-center justify-center gap-6 text-[var(--text)]" aria-label="주 메뉴">
              {NAV.map((item) => (
                <NavLink key={item.href} href={item.href} current={pathname === item.href}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Center: 모바일 전용 텍스트 브랜드 */}
            <div className="md:hidden flex justify-center">
              <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--text)]">
                대물캣 커뮤니티
              </Link>
            </div>

            {/* Right: Profile */}
            <div className="flex items-center justify-end gap-2">
              {showProfileImage ? (
                <>
                  <img
                    src={me.portrait}
                    alt={me.name || "profile"}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={() => setImgError(true)}
                  />
                  <span className="hidden text-sm font-medium text-[var(--text)] sm:inline">{me.name}</span>
                </>
              ) : (
                <FaUserCircle className="h-10 w-10 text-[var(--muted)]" />
              )}
            </div>
          </div>

          {/* Mobile sheet */}
          {open && (
            <div id="mobile-nav" className={mobilePanel}>
              <nav className="flex flex-col px-4 py-2" aria-label="모바일 메뉴">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={linkMobile}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

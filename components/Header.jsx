"use client";

import { useAuth } from "@/components/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdClose, MdMenu } from "react-icons/md";
import NavLink from "./NavLink";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/guide", label: "가이드" },
  { href: "/doctrine", label: "독트린" },
  { href: "/fitting", label: "피팅" },
  { href: "/market", label: "장터" },
  { href: "https://buymeacoffee.com/bonsai.game", label: "기부" },
  { href: "https://discord.com/users/378543198953406464", label: "문의" },
];

const shell = "fixed inset-x-0 top-0 z-50";

// ✅ RootLayout과 폭 통일 (데스크탑 확장)
const container = "mx-auto w-full max-w-7xl px-4 py-3";

// ✅ 넓어졌을 때 더 ‘헤더 카드’답게 보이도록 약간 튜닝
const card =
  "glass rounded-2xl md:rounded-3xl border border-white/40 bg-white/60 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]";

// ✅ row는 그대로 두되, 큰 화면에서 좌우 여백이 살짝 더 있으면 안정감 있음
const row = "px-4 py-3 md:px-6 md:py-4 relative md:grid md:grid-cols-[1fr,auto,1fr] items-center";

const mobilePanel = "md:hidden border-t border-white/50";
const linkMobile = "link-underline rounded-xl px-3 py-2 text-base text-[var(--muted)] hover:text-[var(--primary)]";

export default function Header() {
  const pathname = usePathname();
  const { me, loadingMe } = useAuth();

  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const showProfileImage = !loadingMe && me?.ok && me?.portrait && !imgError;

  return (
    <header className={shell}>
      <div className={container}>
        <div ref={wrapRef} className={card}>
          <div className={`${row} relative`}>
            {/* Left */}
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

              <Link href="/" className="hidden md:inline-flex items-center gap-2">
                <Image src="/favicon-origin.png" alt="CAT4U 로고" width={36} height={36} priority />
                <span className="hidden lg:inline text-sm font-semibold tracking-tight text-[var(--text)]">
                  대물캣 커뮤니티
                </span>
              </Link>
            </div>

            {/* Center: Nav (md+) */}
            <nav
              className="hidden md:flex items-center justify-center gap-6 lg:gap-8 text-[var(--text)]"
              aria-label="주 메뉴"
            >
              {NAV.map((item) => (
                <NavLink key={item.href} href={item.href} current={pathname === item.href}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Center: 모바일 전용 텍스트 브랜드 */}
            <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Link
                href="/"
                className="block max-w-[60vw] truncate text-center text-lg font-semibold tracking-tight text-[var(--text)]"
              >
                대물캣 커뮤니티
              </Link>
            </div>

            {/* Right */}
            <div className="flex items-center justify-end gap-2 shrink-0">
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

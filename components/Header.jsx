"use client";

import { useToast } from "@/hooks/useToast";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

function isDowntimeNow() {
  const now = new Date();
  const utcMinutesOfDay = now.getUTCHours() * 60 + now.getUTCMinutes();
  const start = 11 * 60; // 11:00 UTC
  const end = 12 * 60; // 12:00 UTC
  return utcMinutesOfDay >= start && utcMinutesOfDay < end;
}

export default function Header() {
  const pathname = usePathname();
  const { pushToast } = useToast();
  const [open, setOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchWithAuth("/api/esi/me");
        setProfile(data);
      } catch (err) {
        if (err?.status && [502, 503, 504].includes(err.status)) {
          if (isDowntimeNow()) {
            pushToast({
              type: "error",
              message: "현재 EVE 서버 DT일지도?.. 점검 후에도 그러면 알려주세요.",
            });
          } else {
            pushToast({ type: "error", message: "EVE 서버에 일시적 장애가 발생했습니다." });
          }
        } else {
          pushToast({ type: "error", message: "알 수 없는 오류가 발생했습니다." });
        }
      }
    })();
  }, [pushToast]);

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
              {profile?.ok && !imgError ? (
                <>
                  <img
                    src={profile.portrait}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={() => setImgError(true)}
                  />
                  <span className="text-sm font-medium text-[var(--text)] hidden sm:inline">{profile.name}</span>
                </>
              ) : (
                <FaUserCircle className="w-10 h-10 text-[var(--muted)]" />
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

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import NavLink from './NavLink';
import NeumorphicButton from './NeumorphicButton';

const NAV = [
    { href: '/', label: '홈' },
    { href: '/guide', label: '가이드' },
    { href: '/doctrine', label: '독트린' },
    { href: '/fitting', label: '피팅' },
];

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div className="mx-auto max-w-5xl px-4 py-3">
                <div className="glass rounded-2xl border border-white/40 bg-white/60 backdrop-blur-2xl">
                    <div className="flex items-center justify-between px-4 py-3 md:grid md:grid-cols-3">
                        {/* Left: Brand / Burger */}
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="메뉴 열기"
                                className="btn-neu px-3 py-2 md:hidden"
                                onClick={() => setOpen(v => !v)}
                            >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </button>
                            <Link href="/" className="hidden md:inline-flex text-sm font-medium text-black/60">
                                CAT4U
                            </Link>
                        </div>

                        {/* Center: Nav */}
                        <nav className="hidden md:flex items-center justify-center gap-6">
                            {NAV.map(item => (
                                <NavLink key={item.href} href={item.href} current={pathname === item.href}>
                                    {item.label}
                                </NavLink>
                            ))}
                            <NavLink href="/market" current={pathname === '/market'}>
                                장터
                            </NavLink>
                        </nav>

                        {/* Right: Login */}
                        <div className="hidden md:flex items-center justify-end">
                            <NeumorphicButton label="로그인" onClick={() => alert('로그인 준비 중')} />
                        </div>
                    </div>

                    {/* Mobile sheet */}
                    {open && (
                        <div className="md:hidden border-t border-white/50">
                            <nav className="flex flex-col px-4 py-2">
                                {[...NAV, { href: '/market', label: '장터' }].map(item => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-current={pathname === item.href ? 'page' : undefined}
                                        onClick={() => setOpen(false)}
                                        className="link-underline rounded-xl px-3 py-2 text-base text-black/70 hover:text-black"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="mt-2 border-t border-black/10 pt-2">
                                    <NeumorphicButton label="로그인" onClick={() => alert('로그인 준비 중')} />
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

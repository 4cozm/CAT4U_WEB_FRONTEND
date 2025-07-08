"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import EveAuth from "./eve-auth"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/guide", label: "가이드" },
    { href: "/doctrine", label: "독트린" },
    { href: "/fitting", label: "피팅" },
    { href: "/market", label: "장터" },
  ]

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🚀</span>
            </div>
            <span className="text-xl font-bold text-white">대물캣 이브 포털</span>
          </Link>

          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-orange-400",
                  pathname === item.href ? "text-orange-400" : "text-slate-300",
                )}
              >
                {item.label}
              </Link>
            ))}
            <EveAuth />
          </nav>
        </div>
      </div>
    </header>
  )
}

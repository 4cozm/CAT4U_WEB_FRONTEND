"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: "홈", href: "/" },
    { name: "가이드", href: "/guide/" },
    { name: "독트린", href: "/doctrine/" },
    { name: "피팅", href: "/fitting/" },
    { name: "장터", href: "/market/" },
  ]

  // 로그인 버튼 클릭 시 로그인 페이지로 이동
  const handleLogin = () => {
    router.push("/login")
  }

  // 로그아웃은 임시로 상태만 false로 전환
  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <header className="site-header">
      <div className="container flex items-center justify-between py-4">
        {/* 로고 */}
        <Link href="/" className="text-lg font-bold">
          EVE Community
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex gap-4">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 데스크톱 로그인/로그아웃 버튼 */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span>사용자명</span>
              <Button variant="ghost" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={handleLogin}>
              로그인
            </Button>
          )}
        </div>

        {/* 모바일 메뉴 토글 버튼 */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 모바일 네비게이션 드롭다운 */}
      {isMenuOpen && (
        <nav className="md:hidden bg-card py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-border mt-2 pt-2 px-4 flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span>사용자명</span>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setIsMenuOpen(false)
                  handleLogin()
                }}
              >
                로그인
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

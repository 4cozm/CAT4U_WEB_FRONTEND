import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "대물캣 이브 포털 - EVE Online 커뮤니티",
  description: "뉴에덴의 모든 파일럿들을 위한 독트린 공유, 피팅 가이드 및 커뮤니티 포털",
  icons: {
    icon: "/images/logo-cat.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

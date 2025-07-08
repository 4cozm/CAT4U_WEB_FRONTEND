import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 min-h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-900/30 to-slate-900"></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container relative mx-auto px-4 text-center z-10">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg">
          대물캣 이브 포털
          <span className="block text-orange-400">EVE Online Community</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-200 drop-shadow-md">
          뉴에덴의 모든 파일럿들을 위한 독트린 공유, 피팅 가이드, 그리고 커뮤니티 공간입니다. 함께 우주를 정복해나가요!
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          
          
        </div>
      </div>
    </section>
  )
}

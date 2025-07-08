"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import PostCardView from "@/components/post-card-view"
import PostListView from "@/components/post-list-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, BookOpen, Search, Grid3X3, List } from "lucide-react"
import Link from "next/link"

const categories = ["전체", "초보자", "PVP", "PVE", "산업", "탐험", "기타"]

const guidePosts = [
  {
    id: 1,
    title: "초보자를 위한 EVE Online 시작 가이드",
    category: "초보자",
    author: "MentorAlpha",
    likes: 156,
    comments: 43,
    createdAt: "1일 전",
    excerpt: "EVE Online을 처음 시작하는 파일럿들을 위한 완벽한 가이드입니다. 캐릭터 생성부터 첫 미션까지.",
  },
  {
    id: 2,
    title: "PVP 기초: 솔로 파이팅 입문",
    category: "PVP",
    author: "PVPMaster",
    likes: 89,
    comments: 31,
    createdAt: "2일 전",
    excerpt: "솔로 PVP의 기초부터 고급 테크닉까지. 초보자도 쉽게 따라할 수 있는 단계별 가이드.",
  },
  {
    id: 3,
    title: "미션 러닝 완벽 가이드",
    category: "PVE",
    author: "MissionRunner",
    likes: 72,
    comments: 24,
    createdAt: "3일 전",
    excerpt: "레벨 1부터 레벨 4 미션까지, 효율적인 미션 러닝 방법을 상세히 설명합니다.",
  },
  {
    id: 4,
    title: "산업 시작하기: 제조업 기초",
    category: "산업",
    author: "IndustryExpert",
    likes: 64,
    comments: 18,
    createdAt: "4일 전",
    excerpt: "EVE Online에서 제조업을 시작하는 방법. 블루프린트부터 생산까지 모든 과정을 다룹니다.",
  },
  {
    id: 5,
    title: "웜홀 탐험 가이드",
    category: "탐험",
    author: "WormholeExplorer",
    likes: 91,
    comments: 35,
    createdAt: "5일 전",
    excerpt: "위험하지만 수익성 높은 웜홀 탐험. 안전하게 탐험하는 방법과 필수 장비를 소개합니다.",
  },
  {
    id: 6,
    title: "널섹 생존 가이드 2024",
    category: "PVP",
    author: "NullsecVeteran",
    likes: 128,
    comments: 52,
    createdAt: "6일 전",
    excerpt: "널섹에서 살아남기 위한 필수 팁과 전략들. 인텔 채널 활용법부터 도주 테크닉까지.",
  },
  {
    id: 7,
    title: "마이닝 최적화 가이드",
    category: "산업",
    author: "MiningPro",
    likes: 45,
    comments: 16,
    createdAt: "1주일 전",
    excerpt: "마이닝 효율을 극대화하는 방법. 함선 선택부터 스킬 플랜까지 완벽 정리.",
  },
  {
    id: 8,
    title: "코스믹 시그니처 스캐닝 가이드",
    category: "탐험",
    author: "ScannerPro",
    likes: 67,
    comments: 22,
    createdAt: "1주일 전",
    excerpt: "코스믹 시그니처를 효율적으로 스캔하는 방법과 각 사이트별 공략법을 설명합니다.",
  },
]

export default function GuidePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = useMemo(() => {
    let posts =
      selectedCategory === "전체" ? guidePosts : guidePosts.filter((post) => post.category === selectedCategory)

    if (searchQuery.trim()) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return posts
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 opacity-30"></div>
      <Header />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">가이드</h1>
          <p className="text-slate-300 flex items-center justify-center gap-2">
            <BookOpen className="h-4 w-4" />
            EVE Online의 모든 것을 배우는 학습 공간
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="가이드 제목, 내용, 작성자 검색..."
              className="bg-slate-700 border-slate-600 text-white pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-slate-600 overflow-hidden bg-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("card")}
                className={`rounded-none px-4 py-2 border-0 ${
                  viewMode === "card"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">카드</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-none px-4 py-2 border-0 ${
                  viewMode === "list"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">리스트</span>
              </Button>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
              <Link href="/guide/write">
                <Plus className="mr-2 h-4 w-4" />
                가이드 작성
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                  : "border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white bg-slate-800/50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-slate-300 text-sm">
            {searchQuery ? `"${searchQuery}" 검색 결과: ` : ""}총 {filteredPosts.length}개의 가이드
          </p>
        </div>

        {filteredPosts.length > 0 ? (
          viewMode === "card" ? (
            <PostCardView posts={filteredPosts} showDoctrineLogos={false} />
          ) : (
            <PostListView posts={filteredPosts} showDoctrineLogos={false} />
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg mb-2">검색 결과가 없습니다</p>
            <p className="text-slate-400 text-sm">다른 검색어를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}

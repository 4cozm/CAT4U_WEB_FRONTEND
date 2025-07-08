"use client"

import { cn } from "@/lib/utils"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import DoctrineLogo from "@/components/doctrine-logo"
import PostCardView from "@/components/post-card-view"
import PostListView from "@/components/post-list-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Eye, Search, Grid3X3, List } from "lucide-react"
import Link from "next/link"

const categories = ["전체", "캣포유", "대구", "물고기", "외부"]

const doctrinePosts = [
  {
    id: 1,
    title: "하피 플릿 독트린 v2.1",
    category: "캣포유",
    author: "FleetCommander",
    likes: 45,
    comments: 12,
    createdAt: "1일 전",
    excerpt: "업데이트된 하피 플릿 독트린입니다. 새로운 메타에 맞춰 조정되었습니다.",
  },
  {
    id: 2,
    title: "대구 전용 배틀크루저 독트린",
    category: "대구",
    author: "TacticalAlpha",
    likes: 32,
    comments: 8,
    createdAt: "2일 전",
    excerpt: "대구 작전을 위한 특화된 배틀크루저 독트린을 소개합니다.",
  },
  {
    id: 3,
    title: "물고기 스몰갱 가이드",
    category: "물고기",
    author: "SmallGangExpert",
    likes: 28,
    comments: 15,
    createdAt: "3일 전",
    excerpt: "소규모 갱킹을 위한 효과적인 독트린과 전술을 다룹니다.",
  },
  {
    id: 4,
    title: "외부 연합 독트린 분석",
    category: "외부",
    author: "IntelOfficer",
    likes: 19,
    comments: 6,
    createdAt: "4일 전",
    excerpt: "주요 외부 연합들의 독트린을 분석하고 대응 방안을 제시합니다.",
  },
  {
    id: 5,
    title: "캣포유 신규 독트린 테스트",
    category: "캣포유",
    author: "TestPilot",
    likes: 23,
    comments: 9,
    createdAt: "5일 전",
    excerpt: "새로운 캣포유 독트린에 대한 테스트 결과를 공유합니다.",
  },
  {
    id: 6,
    title: "대구 방어 독트린 업데이트",
    category: "대구",
    author: "DefenseExpert",
    likes: 18,
    comments: 7,
    createdAt: "6일 전",
    excerpt: "방어 상황에 특화된 대구 독트린의 최신 업데이트입니다.",
  },
  {
    id: 7,
    title: "물고기 인터셉터 운용법",
    category: "물고기",
    author: "InterceptorPro",
    likes: 35,
    comments: 14,
    createdAt: "1주일 전",
    excerpt: "물고기 작전에서 인터셉터를 효과적으로 운용하는 방법을 설명합니다.",
  },
]

export default function DoctrinePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [searchQuery, setSearchQuery] = useState("")

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    let posts =
      selectedCategory === "전체" ? doctrinePosts : doctrinePosts.filter((post) => post.category === selectedCategory)

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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 opacity-30"></div>
      <Header />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 섹션 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">독트린</h1>
          <p className="text-slate-300 flex items-center justify-center gap-2">
            <Eye className="h-4 w-4" />
            전략적 정보와 플릿 독트린을 공유하는 공간
          </p>
        </div>

        {/* 검색 및 글 작성 버튼 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="독트린 제목, 내용, 작성자 검색..."
              className="bg-slate-700 border-slate-600 text-white pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* 뷰 모드 전환 */}
            <div className="flex rounded-lg border border-slate-600 overflow-hidden bg-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("card")}
                className={`rounded-none px-4 py-2 border-0 ${
                  viewMode === "card"
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
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
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">리스트</span>
              </Button>
            </div>
            <Button asChild className="bg-cyan-600 hover:bg-cyan-700 shadow-lg">
              <Link href="/doctrine/write">
                <Plus className="mr-2 h-4 w-4" />글 작성
              </Link>
            </Button>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "flex items-center gap-2",
                selectedCategory === category
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg"
                  : "border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white bg-slate-800/50",
              )}
            >
              {["캣포유", "대구", "물고기"].includes(category) && <DoctrineLogo category={category} size="sm" />}
              {category}
            </Button>
          ))}
        </div>

        {/* 결과 표시 */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-slate-300 text-sm">
            {searchQuery ? `"${searchQuery}" 검색 결과: ` : ""}총 {filteredPosts.length}개의 독트린
          </p>
        </div>

        {/* 글 리스트 */}
        {filteredPosts.length > 0 ? (
          viewMode === "card" ? (
            <PostCardView posts={filteredPosts} showDoctrineLogos={true} />
          ) : (
            <PostListView posts={filteredPosts} showDoctrineLogos={true} />
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

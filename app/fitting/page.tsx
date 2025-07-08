"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import PostCardView from "@/components/post-card-view"
import PostListView from "@/components/post-list-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Zap, Search, Grid3X3, List } from "lucide-react"
import Link from "next/link"

const categories = ["전체", "PVP", "PVE", "피팅 피드백"]

const fittingPosts = [
  {
    id: 1,
    title: "솔로 PVP 크루저 피팅 가이드",
    category: "PVP",
    author: "PVPMaster",
    likes: 67,
    comments: 23,
    createdAt: "1일 전",
    excerpt: "솔로 PVP에 최적화된 크루저 피팅들을 소개합니다. 비용 대비 효율이 뛰어난 빌드들입니다.",
  },
  {
    id: 2,
    title: "인커션 최적화 피팅",
    category: "PVE",
    author: "IncursionPro",
    likes: 89,
    comments: 31,
    createdAt: "2일 전",
    excerpt: "인커션 사이트에서 최대 DPS와 생존성을 보장하는 피팅 가이드입니다.",
  },
  {
    id: 3,
    title: "초보자 피팅 검토 요청",
    category: "피팅 피드백",
    author: "NewPilot123",
    likes: 12,
    comments: 18,
    createdAt: "3일 전",
    excerpt: "처음 만든 PVE 피팅입니다. 개선점이 있다면 조언 부탁드립니다.",
  },
  {
    id: 4,
    title: "플릿 PVP 로지스틱 피팅",
    category: "PVP",
    author: "LogiBro",
    likes: 45,
    comments: 14,
    createdAt: "4일 전",
    excerpt: "대규모 플릿전에서 사용하는 로지스틱 피팅들을 정리했습니다.",
  },
  {
    id: 5,
    title: "미션 러닝 최적화 피팅",
    category: "PVE",
    author: "MissionRunner",
    likes: 34,
    comments: 11,
    createdAt: "5일 전",
    excerpt: "레벨 4 미션을 효율적으로 클리어하기 위한 피팅 가이드입니다.",
  },
  {
    id: 6,
    title: "FW 프리깃 피팅 모음",
    category: "PVP",
    author: "FWVeteran",
    likes: 52,
    comments: 19,
    createdAt: "6일 전",
    excerpt: "팩션 워페어에서 사용하기 좋은 프리깃 피팅들을 모았습니다.",
  },
  {
    id: 7,
    title: "아비설 데드스페이스 피팅",
    category: "PVE",
    author: "AbyssalExplorer",
    likes: 41,
    comments: 16,
    createdAt: "1주일 전",
    excerpt: "아비설 데드스페이스 탐험을 위한 특화 피팅을 소개합니다.",
  },
  {
    id: 8,
    title: "드레드노트 피팅 피드백",
    category: "피팅 피드백",
    author: "CapitalPilot",
    likes: 28,
    comments: 22,
    createdAt: "1주일 전",
    excerpt: "첫 드레드노트 피팅을 만들어봤습니다. 검토 부탁드립니다.",
  },
]

export default function FittingPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [searchQuery, setSearchQuery] = useState("")

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    let posts =
      selectedCategory === "전체" ? fittingPosts : fittingPosts.filter((post) => post.category === selectedCategory)

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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-900/20 to-slate-900 opacity-30"></div>
      <Header />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 섹션 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">피팅</h1>
          <p className="text-slate-300 flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            전투 피팅과 최적화 가이드를 공유하는 공간
          </p>
        </div>

        {/* 검색 및 글 작성 버튼 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="피팅 제목, 내용, 작성자 검색..."
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
                    ? "bg-violet-600 text-white hover:bg-violet-700"
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
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">리스트</span>
              </Button>
            </div>
            <Button asChild className="bg-violet-600 hover:bg-violet-700 shadow-lg">
              <Link href="/fitting/write">
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
              className={
                selectedCategory === category
                  ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg"
                  : "border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white bg-slate-800/50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* 결과 표시 */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-slate-300 text-sm">
            {searchQuery ? `"${searchQuery}" 검색 결과: ` : ""}총 {filteredPosts.length}개의 피팅
          </p>
        </div>

        {/* 글 리스트 */}
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

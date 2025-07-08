"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import PostCardView from "@/components/post-card-view"
import PostListView from "@/components/post-list-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ShoppingCart, Search, Grid3X3, List } from "lucide-react"
import Link from "next/link"

const categories = ["전체", "함선", "모듈", "스킬북", "블루프린트", "자원", "기타"]

const marketPosts = [
  {
    id: 1,
    title: "[판매] 라틴 급 배틀크루저 완전체",
    category: "함선",
    author: "ShipDealer",
    likes: 45,
    comments: 12,
    createdAt: "30분 전",
    excerpt: "완전히 피팅된 라틴 급 배틀크루저 판매합니다. PVP 최적화 피팅 포함. 가격 협상 가능.",
  },
  {
    id: 2,
    title: "[구매] 대형 방패 부스터 T2 모듈",
    category: "모듈",
    author: "ModuleBuyer",
    likes: 23,
    comments: 8,
    createdAt: "1시간 전",
    excerpt: "대형 방패 부스터 T2 모듈을 구매하고 있습니다. 좋은 가격에 판매하실 분 연락주세요.",
  },
  {
    id: 3,
    title: "[판매] 캐피털 함선 스킬북 패키지",
    category: "스킬북",
    author: "SkillSeller",
    likes: 67,
    comments: 25,
    createdAt: "2시간 전",
    excerpt: "캐피털 함선 관련 스킬북들을 패키지로 판매합니다. 개별 구매보다 20% 할인된 가격.",
  },
  {
    id: 4,
    title: "[판매] 드레드노트 BPO 원본",
    category: "블루프린트",
    author: "BPOTrader",
    likes: 89,
    comments: 34,
    createdAt: "3시간 전",
    excerpt: "드레드노트 블루프린트 원본(BPO) 판매합니다. ME/TE 연구 완료. 희귀 아이템입니다.",
  },
  {
    id: 5,
    title: "[구매] 트리타늄 대량 구매",
    category: "자원",
    author: "ResourceBuyer",
    likes: 31,
    comments: 16,
    createdAt: "4시간 전",
    excerpt: "트리타늄을 대량으로 구매하고 있습니다. 1억 단위 이상 거래 가능하신 분 연락주세요.",
  },
  {
    id: 6,
    title: "[판매] 희귀 임플란트 세트",
    category: "기타",
    author: "ImplantDealer",
    likes: 52,
    comments: 19,
    createdAt: "5시간 전",
    excerpt: "고급 임플란트 세트를 판매합니다. 완전한 세트로만 판매하며, 개별 판매는 하지 않습니다.",
  },
  {
    id: 7,
    title: "[판매] 인터셉터 함선 다수",
    category: "함선",
    author: "FastShipSeller",
    likes: 28,
    comments: 11,
    createdAt: "6시간 전",
    excerpt: "각종 인터셉터 함선들을 판매합니다. 신규 파일럿들에게 좋은 가격으로 제공합니다.",
  },
  {
    id: 8,
    title: "[구매] 팩션 모듈 컬렉션",
    category: "모듈",
    author: "Collector",
    likes: 41,
    comments: 22,
    createdAt: "8시간 전",
    excerpt: "팩션 모듈들을 컬렉션 목적으로 구매하고 있습니다. 희귀한 모듈일수록 좋습니다.",
  },
]

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [searchQuery, setSearchQuery] = useState("")

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    let posts =
      selectedCategory === "전체" ? marketPosts : marketPosts.filter((post) => post.category === selectedCategory)

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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 opacity-30"></div>
      <Header />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 섹션 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">장터</h1>
          <p className="text-slate-300 flex items-center justify-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            파일럿들 간의 안전한 거래와 아이템 교환 공간
          </p>
        </div>

        {/* 검색 및 글 작성 버튼 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="아이템명, 함선명, 판매자 검색..."
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
                    ? "bg-orange-600 text-white hover:bg-orange-700"
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
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">리스트</span>
              </Button>
            </div>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 shadow-lg">
              <Link href="/market/write">
                <Plus className="mr-2 h-4 w-4" />
                거래글 작성
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
                  ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                  : "border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white bg-slate-800/50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* 거래 안내 */}
        <div className="mb-6 bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ShoppingCart className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-orange-400 font-semibold mb-1">안전한 거래를 위한 안내</h3>
              <p className="text-slate-200 text-sm">
                • 거래 시 게임 내 계약 시스템을 이용해주세요.
                <br />• 사기 거래 신고는 관리자에게 연락해주세요.
                <br />• 가격은 시세를 확인 후 결정하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        {/* 결과 표시 */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-slate-300 text-sm">
            {searchQuery ? `"${searchQuery}" 검색 결과: ` : ""}총 {filteredPosts.length}개의 거래글
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

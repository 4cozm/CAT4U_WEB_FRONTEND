import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import PostList from "@/components/post-list"

// 샘플 데이터
const recentPosts = [
  {
    id: 1,
    title: "신규 독트린: 하피 플릿 가이드",
    category: "독트린",
    author: "CommanderAlpha",
    likes: 24,
    comments: 8,
    createdAt: "2시간 전",
    excerpt: "최신 하피 독트린에 대한 완벽한 가이드입니다. 피팅부터 전술까지 모든 것을 다룹니다.",
  },
  {
    id: 2,
    title: "PVP 피팅: 솔로 크루저 빌드",
    category: "피팅",
    author: "PilotBravo",
    likes: 18,
    comments: 12,
    createdAt: "4시간 전",
    excerpt: "솔로 PVP를 위한 크루저 피팅 가이드. 비용 효율적이면서도 강력한 빌드를 소개합니다.",
  },
  {
    id: 3,
    title: "초보자를 위한 EVE Online 시작 가이드",
    category: "가이드",
    author: "MentorDelta",
    likes: 31,
    comments: 15,
    createdAt: "6시간 전",
    excerpt: "EVE Online을 처음 시작하는 파일럿들을 위한 완벽한 가이드입니다.",
  },
]

const popularPosts = [
  {
    id: 4,
    title: "[판매] 라틴 급 배틀크루저 완전체",
    category: "장터",
    author: "ShipDealer",
    likes: 156,
    comments: 43,
    createdAt: "3일 전",
    excerpt: "완전히 피팅된 라틴 급 배틀크루저 판매합니다. PVP 최적화 피팅 포함.",
  },
  {
    id: 5,
    title: "널섹 생존 가이드 2024",
    category: "가이드",
    author: "SurvivalEcho",
    likes: 89,
    comments: 27,
    createdAt: "5일 전",
    excerpt: "널섹에서 살아남기 위한 필수 팁과 전략들을 정리했습니다.",
  },
  {
    id: 6,
    title: "마이닝 최적화: ISK 효율 극대화",
    category: "피팅",
    author: "MinerFoxtrot",
    likes: 72,
    comments: 19,
    createdAt: "1주일 전",
    excerpt: "마이닝 효율을 극대화하여 더 많은 ISK를 벌어보세요.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <HeroSection />
      <PostList posts={recentPosts} title="최근 등록된 글" />
      <PostList posts={popularPosts} title="이번 주 인기 글" />
    </div>
  )
}

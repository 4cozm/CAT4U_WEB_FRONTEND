import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Eye, ArrowLeft, Share2, DollarSign, MapPin, User } from "lucide-react"

// 정적 생성을 위한 함수
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }]
}

const marketItems = {
  "1": {
    id: 1,
    title: "Titan 급매 - Avatar 완전 피팅",
    content: `# Avatar Titan 급매

급하게 ISK가 필요해서 Avatar를 급매합니다.

## 함선 정보
- **함선**: Avatar (Amarr Titan)
- **위치**: Jita 4-4 Trade Hub
- **상태**: 완전 피팅 상태
- **보험**: 플래티넘 보험 적용

## 피팅 정보
- T2 Doomsday Device
- 완전한 탱킹 모듈
- 점프 드라이브 완비
- 모든 모듈 T2 이상

## 가격 및 조건
- **가격**: 85B ISK (협상 가능)
- **결제**: ISK 선입금
- **인도**: Jita 4-4에서 직접 인도

급매이므로 빠른 거래 원합니다. 연락 주세요!`,
    author: "급매왕",
    createdAt: "2024-01-15",
    views: 3200,
    likes: 12,
    comments: 45,
    price: "85B ISK",
    status: "판매중",
    location: "Jita 4-4",
    tags: ["Titan", "급매", "완전피팅"],
  },
  "2": {
    id: 2,
    title: "드레드노트 Naglfar 판매",
    content: `# Naglfar 드레드노트 판매

잘 관리된 Naglfar 드레드노트를 판매합니다.

## 함선 정보
- **함선**: Naglfar (Minmatar Dreadnought)
- **위치**: Null-Sec 스테이션
- **상태**: 양호

## 스킬 요구사항
- 점프 드라이브 캘리브레이션 V
- 캐피털 함선 운용 가능

## 가격
- **가격**: 2.5B ISK`,
    author: "함선딜러",
    createdAt: "2024-01-14",
    views: 1890,
    likes: 8,
    comments: 23,
    price: "2.5B ISK",
    status: "판매중",
    location: "Null-Sec",
    tags: ["드레드노트", "Naglfar", "캐피털"],
  },
}

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  const item = marketItems[params.id as keyof typeof marketItems]

  if (!item) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/market/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            장터 목록으로
          </Button>
        </Link>
      </div>

      {/* Item Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
          <Badge variant={item.status === "판매중" ? "default" : "secondary"} className="text-lg px-3 py-1">
            {item.status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-green-600 font-bold text-xl">
            <DollarSign className="w-5 h-5 mr-2" />
            {item.price}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {item.location}
          </div>
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            {item.author}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span>{item.createdAt}</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {item.views}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {item.likes}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {item.comments}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            관심상품
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            공유
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            구매 문의
          </Button>
        </div>
      </div>

      {/* Item Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            {item.content.split("\n").map((line, index) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={index} className="text-2xl font-bold mt-8 mb-4">
                    {line.substring(2)}
                  </h1>
                )
              } else if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-xl font-semibold mt-6 mb-3">
                    {line.substring(3)}
                  </h2>
                )
              } else if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-lg font-medium mt-4 mb-2">
                    {line.substring(4)}
                  </h3>
                )
              } else if (line.startsWith("- ")) {
                return (
                  <li key={index} className="ml-4">
                    {line.substring(2)}
                  </li>
                )
              } else if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={index} className="font-semibold mb-2">
                    {line.slice(2, -2)}
                  </p>
                )
              } else if (line.trim() === "") {
                return <br key={index} />
              } else {
                return (
                  <p key={index} className="mb-3">
                    {line}
                  </p>
                )
              }
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">댓글 (0)</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Textarea placeholder="구매 문의나 댓글을 작성해주세요..." />
            <Button>댓글 작성</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

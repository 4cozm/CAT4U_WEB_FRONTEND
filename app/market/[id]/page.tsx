"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Clock,
  User,
  Eye,
  MapPin,
  DollarSign,
  AlertTriangle,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import ClipboardSection from "@/components/clipboard-section"

// 샘플 데이터
const sampleMarketPost = {
  id: 1,
  title: "[판매] 라틴 급 배틀크루저 완전체",
  category: "함선",
  tradeType: "판매",
  author: "ShipDealer",
  likes: 45,
  comments: 12,
  views: 189,
  price: "500,000,000 ISK",
  location: "지타 4-4 스테이션",
  createdAt: "2024-01-13T09:15:00Z",
  content: `# 라틴 급 배틀크루저 완전체 판매

## 상품 정보
- **함선**: 라틴 (Raven) 급 배틀쉽
- **상태**: 완전체 (100% 구조/아머/실드)
- **위치**: 지타 4-4 스테이션
- **가격**: 500,000,000 ISK (협상 가능)

## 포함 피팅
완전히 피팅된 상태로 판매합니다:

### 피팅 상세
\`\`\`
[Raven, PVE Missile]
Cruise Missile Launcher II
Cruise Missile Launcher II
Cruise Missile Launcher II
Cruise Missile Launcher II
Cruise Missile Launcher II
Cruise Missile Launcher II
Drone Link Augmentor II
Drone Link Augmentor II

Large Shield Booster II
Adaptive Invulnerability Field II
Adaptive Invulnerability Field II
EM Ward Field II
Thermal Dissipation Field II
10MN Afterburner II

Ballistic Control System II
Ballistic Control System II
Ballistic Control System II
Power Diagnostic System II
Power Diagnostic System II

Large Warhead Calefaction Catalyst I
Large Warhead Calefaction Catalyst I
Large Capacitor Control Circuit I

Scourge Cruise Missile x2000
Mjolnir Cruise Missile x2000
Hobgoblin II x5
Hammerhead II x5
\`\`\`

## 추가 포함 아이템
- Scourge Cruise Missile x2000
- Mjolnir Cruise Missile x2000
- Hobgoblin II x5
- Hammerhead II x5

## 거래 조건
- **결제 방식**: ISK 선불 또는 게임 내 계약
- **인도 방식**: 지타 4-4에서 직거래
- **보증**: 함선 상태 100% 보장
- **연락처**: 게임 내 메일 또는 이 글 댓글

## 주의사항
- 사기 방지를 위해 계약 시스템 이용 권장
- 가격 협상은 게임 내에서만 진행
- 선착순 판매 (재고 1대)`,
}

const marketComments = [
  {
    id: 1,
    author: "BuyerAlpha",
    content: "가격이 합리적이네요. 게임 내 메일 보냈습니다!",
    createdAt: "2024-01-13T10:00:00Z",
    likes: 3,
  },
  {
    id: 2,
    author: "PilotBeta",
    content: "피팅이 정말 좋네요. 아직 판매 가능한가요?",
    createdAt: "2024-01-13T11:30:00Z",
    likes: 2,
  },
]

export default function MarketDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(sampleMarketPost.likes)

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1)
      setIsLiked(false)
    } else {
      setLikeCount((prev) => prev + 1)
      setIsLiked(true)
    }
  }

  const handleContact = () => {
    toast({
      title: "연락처 정보",
      description: "게임 내에서 ShipDealer에게 메일을 보내세요.",
    })
  }

  // 피팅 코드 추출 및 복사 함수
  const extractAndCopyFittings = async () => {
    const content = sampleMarketPost.content
    const fittingRegex = /```\n([\s\S]*?)\n```/g
    const fittings = []
    let match

    while ((match = fittingRegex.exec(content)) !== null) {
      fittings.push(match[1].trim())
    }

    if (fittings.length > 0) {
      const allFittings = fittings.join("\n\n")
      try {
        await navigator.clipboard.writeText(allFittings)
        toast({
          title: "피팅 복사 완료!",
          description: `${fittings.length}개의 피팅이 클립보드에 복사되었습니다.`,
        })
      } catch (err) {
        toast({
          title: "복사 실패",
          description: "피팅 복사에 실패했습니다.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "피팅 없음",
        description: "복사할 피팅이 없습니다.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            asChild
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            <Link href="/market">
              <ArrowLeft className="mr-2 h-4 w-4" />
              장터 목록으로
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        sampleMarketPost.tradeType === "판매"
                          ? "bg-green-600"
                          : sampleMarketPost.tradeType === "구매"
                            ? "bg-blue-600"
                            : "bg-purple-600"
                      }
                    >
                      {sampleMarketPost.tradeType}
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-600/20 text-amber-300">
                      {sampleMarketPost.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {sampleMarketPost.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(sampleMarketPost.createdAt)}
                    </div>
                  </div>
                </div>

                <CardTitle className="text-2xl text-white mb-4">{sampleMarketPost.title}</CardTitle>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="h-4 w-4" />
                    <span>by {sampleMarketPost.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={`border-slate-600 ${
                        isLiked
                          ? "bg-amber-600 text-white hover:bg-amber-700"
                          : "text-slate-300 hover:bg-slate-700 bg-transparent"
                      }`}
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      {likeCount}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={extractAndCopyFittings}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      <Copy className="mr-1 h-4 w-4" />
                      피팅 복사
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Separator className="bg-slate-700" />

              <CardContent className="pt-6">
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{sampleMarketPost.content}</div>
                </div>
              </CardContent>
            </Card>

            {/* 클립보드 섹션 */}
            <ClipboardSection />

            {/* 댓글 섹션 */}
            <Card className="border-slate-700 bg-slate-800/50 mt-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  댓글 ({marketComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketComments.map((comment) => (
                  <div key={comment.id} className="border-b border-slate-700 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300 font-medium">{comment.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {comment.likes}
                        </div>
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-slate-200">{comment.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 거래 정보 */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">거래 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-slate-300 text-sm">가격</p>
                    <p className="text-white font-semibold">{sampleMarketPost.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-slate-300 text-sm">위치</p>
                    <p className="text-white font-semibold">{sampleMarketPost.location}</p>
                  </div>
                </div>

                <Button onClick={handleContact} className="w-full bg-amber-600 hover:bg-amber-700">
                  판매자 연락하기
                </Button>
              </CardContent>
            </Card>

            {/* 안전 거래 안내 */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  안전 거래
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>• 계약 시스템 이용 권장</li>
                  <li>• 선불 거래 주의</li>
                  <li>• 의심스러운 거래 신고</li>
                  <li>• 시세 확인 후 거래</li>
                </ul>
              </CardContent>
            </Card>

            {/* 작성자 정보 */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">판매자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">SD</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{sampleMarketPost.author}</p>
                    <p className="text-slate-400 text-sm">신뢰할 수 있는 거래자</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

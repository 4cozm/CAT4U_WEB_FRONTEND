"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ThumbsUp, MessageCircle, Clock, User, Eye, Copy } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import ClipboardSection from "@/components/clipboard-section"

// 샘플 데이터
const sampleFitting = {
  id: 1,
  title: "솔로 PVP 크루저 피팅 가이드",
  category: "PVP",
  author: "PVPMaster",
  likes: 67,
  comments: 23,
  views: 456,
  createdAt: "2024-01-14T15:20:00Z",
  content: `# 솔로 PVP 크루저 피팅 가이드

## 개요
솔로 PVP에 최적화된 크루저 피팅들을 소개합니다. 비용 대비 효율이 뛰어난 빌드들입니다.

## 추천 피팅 1: 벡서 (Vexor)

### 피팅
\`\`\`
[Vexor, Solo PVP]
Medium Pulse Laser II
Medium Pulse Laser II
Medium Pulse Laser II
Medium Pulse Laser II

10MN Afterburner II
Warp Scrambler II
Stasis Webifier II
Medium Capacitor Booster II

Damage Control II
Energized Adaptive Nano Membrane II
Medium Armor Repairer II
Heat Sink II

Medium Auxiliary Nano Pump I
Medium Nanobot Accelerator I
Medium Anti-Explosive Pump I

Hammerhead II x5
\`\`\`

### 전술
1. **거리 조절**: 8-12km 최적 거리 유지
2. **캐패시터 관리**: 부스터 적절히 사용
3. **드론 컨트롤**: 상황에 맞는 드론 선택

## 추천 피팅 2: 오멘 (Omen)

### 피팅
\`\`\`
[Omen, Solo PVP Kiter]
Focused Pulse Laser II
Focused Pulse Laser II
Focused Pulse Laser II
Focused Pulse Laser II
Focused Pulse Laser II

10MN Afterburner II
Warp Disruptor II
Tracking Computer II

Heat Sink II
Heat Sink II
Energized Adaptive Nano Membrane II
Medium Armor Repairer II

Medium Energy Collision Accelerator I
Medium Energy Burst Aerator I
Medium Auxiliary Nano Pump I
\`\`\`

### 전술
- **카이팅**: 20km+ 거리에서 교전
- **트래킹**: 트래킹 컴퓨터 활용
- **기동성**: AB로 거리 조절

## 추천 피팅 3: 토락스 (Thorax)

### 피팅
\`\`\`
[Thorax, Brawler]
Heavy Neutron Blaster II
Heavy Neutron Blaster II
Heavy Neutron Blaster II
Heavy Neutron Blaster II
Heavy Neutron Blaster II

10MN Afterburner II
Warp Scrambler II
Stasis Webifier II

Magnetic Field Stabilizer II
Magnetic Field Stabilizer II
Energized Adaptive Nano Membrane II
Medium Armor Repairer II

Medium Auxiliary Nano Pump I
Medium Nanobot Accelerator I
Medium Anti-Kinetic Pump I
\`\`\`

## 일반적인 팁
- 상대방 피팅 파악 우선
- 탈출 루트 항상 확보
- 캐패시터 상태 지속 모니터링`,
}

const fittingComments = [
  {
    id: 1,
    author: "SoloPilot",
    content: "벡서 피팅 써봤는데 정말 좋네요! 드론 데미지가 생각보다 강력합니다.",
    createdAt: "2024-01-14T16:00:00Z",
    likes: 8,
  },
  {
    id: 2,
    author: "PVPNewbie",
    content: "초보자도 따라하기 쉽게 설명해주셔서 감사합니다. 오멘 피팅도 시도해볼게요!",
    createdAt: "2024-01-14T17:30:00Z",
    likes: 5,
  },
]

export default function FittingDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(sampleFitting.likes)

  // 피팅 코드 추출 및 복사 함수
  const extractAndCopyFittings = async () => {
    const content = sampleFitting.content
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
            <Link href="/fitting">
              <ArrowLeft className="mr-2 h-4 w-4" />
              피팅 목록으로
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    className={
                      sampleFitting.category === "PVP"
                        ? "bg-red-600/20 text-red-300"
                        : sampleFitting.category === "PVE"
                          ? "bg-green-600/20 text-green-300"
                          : "bg-yellow-600/20 text-yellow-300"
                    }
                  >
                    {sampleFitting.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {sampleFitting.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(sampleFitting.createdAt)}
                    </div>
                  </div>
                </div>

                <CardTitle className="text-2xl text-white mb-4">{sampleFitting.title}</CardTitle>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="h-4 w-4" />
                    <span>by {sampleFitting.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`border-slate-600 ${
                        isLiked
                          ? "bg-purple-600 text-white hover:bg-purple-700"
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
                  <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{sampleFitting.content}</div>
                </div>

                {/* 클립보드 버튼 */}
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <ClipboardSection />
                </div>
              </CardContent>
            </Card>

            {/* 댓글 섹션 */}
            <Card className="border-slate-700 bg-slate-800/50 mt-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  댓글 ({fittingComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fittingComments.map((comment) => (
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
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">작성자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">PVP</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{sampleFitting.author}</p>
                    <p className="text-slate-400 text-sm">PVP 전문가</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">관련 피팅</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/fitting/2"
                  className="block p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <p className="text-white text-sm font-medium">인커션 최적화 피팅</p>
                  <p className="text-slate-400 text-xs">by IncursionPro</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

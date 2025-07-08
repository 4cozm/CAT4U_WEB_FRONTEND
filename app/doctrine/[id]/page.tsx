"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import DoctrineLogo from "@/components/doctrine-logo"
import PostContentRenderer from "@/components/post-content-renderer"
import ClipboardSection from "@/components/clipboard-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ThumbsUp, MessageCircle, Clock, User, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// 샘플 데이터 (실제로는 API에서 가져올 데이터)
const sampleDoctrine = {
  id: 1,
  title: "하피 플릿 독트린 v2.1",
  category: "캣포유",
  author: "FleetCommander",
  likes: 45,
  comments: 12,
  views: 234,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  tags: ["하피", "플릿", "PVP", "소형함선"],
  content: `# 하피 플릿 독트린 v2.1

## 개요
업데이트된 하피 플릿 독트린입니다. 새로운 메타에 맞춰 조정되었으며, **소규모 플릿전**에서 뛰어난 성능을 발휘합니다.

## 함선 구성
- **하피 (Harpy)**: 메인 DPS 함선 - 8~12대
- **그리핀 (Griffin)**: ECM 지원 - 2~3대  
- **버스트 (Burst)**: 로지스틱 지원 - 1~2대

## 피팅 가이드

### 하피 메인 DPS 피팅
\`\`\`
[Harpy, Fleet Doctrine v2.1]
Light Neutron Blaster II
Light Neutron Blaster II
Light Neutron Blaster II
Light Neutron Blaster II

1MN Afterburner II
Warp Scrambler II
Stasis Webifier II

Damage Control II
Magnetic Field Stabilizer II
Adaptive Nano Plating II

Small Hybrid Collision Accelerator I
Small Hybrid Burst Aerator I
\`\`\`

### 그리핀 ECM 지원 피팅
\`\`\`
[Griffin, ECM Support v2.1]
ECM - Ion Field Projector I
ECM - Spatial Destabilizer I
ECM - Phase Inverter I
ECM - White Noise Generator I

1MN Afterburner II
Medium Shield Extender II

Signal Distortion Amplifier II
Signal Distortion Amplifier II

Small Particle Dispersion Projector I
Small Particle Dispersion Augmentor I
\`\`\`

### 버스트 로지스틱 피팅
\`\`\`
[Burst, Logistics Support v2.1]
Small Remote Armor Repairer II
Small Remote Armor Repairer II

1MN Afterburner II
Cap Recharger II

Damage Control II
Small Auxiliary Nano Pump I
Energized Adaptive Nano Membrane II

Small Auxiliary Nano Pump I
Small Nanobot Accelerator I
\`\`\`

## 전술 가이드

### 기본 전술
1. **진형 유지**: FC를 앵커로 하여 8-10km 거리 유지
2. **타겟 우선순위**: 
   - 1순위: 적 로지스틱
   - 2순위: 적 ECM/EWAR
   - 3순위: 적 DPS
3. **거리 조절**: 최적 사거리 8-10km에서 교전

### 고급 전술
> **중요**: ECM 함선은 항상 플릿 후방에 위치시키고, 로지스틱과의 거리를 15km 이내로 유지하세요.

- **스플릿 전술**: 대규모 적 플릿 대응 시 2개 그룹으로 분할
- **카이팅**: 적이 근접할 경우 AB를 이용한 거리 유지
- **포커스 파이어**: 모든 DPS가 동일 타겟 집중 공격

## 소모품 및 탄약

### 권장 탄약
- **주력**: Void S (근거리 고데미지)
- **보조**: Antimatter Charge S (중거리)
- **특수상황**: Null S (장거리 카이팅)

### 필수 소모품
- Cap Booster 200 x50
- Nanite Repair Paste x100
- Mobile Depot x1

## 주의사항
- 로지스틱과의 거리 유지 **필수**
- ECM 함선 보호 **최우선**
- 탄약은 상황에 맞게 교체
- 캐패시터 관리 중요 (부스터 적절히 사용)

## 카운터 대응
이 독트린에 대한 주요 카운터와 대응 방안:

### vs 장거리 카이팅 플릿
- 인터셉터 추가 투입으로 거리 단축
- 워프 디스럽터 장착 함선으로 도주 차단

### vs 대형함선
- 즉시 철수 또는 분산 기동
- ECM으로 캐피털 무력화 시도

*마지막 업데이트: 2024년 1월 15일*`,
}

const comments = [
  {
    id: 1,
    author: "PilotAlpha",
    content: "정말 상세한 가이드네요! 특히 고급 전술 부분이 도움이 많이 됐습니다.",
    createdAt: "2024-01-15T11:00:00Z",
    likes: 5,
  },
  {
    id: 2,
    author: "TacticalBeta",
    content: "하피 피팅에서 리그를 바꿔보는 건 어떨까요? Small Hybrid Locus Coordinator도 고려해볼만 합니다.",
    createdAt: "2024-01-15T12:30:00Z",
    likes: 3,
  },
  {
    id: 3,
    author: "NewPilot123",
    content: "초보자도 이해하기 쉽게 설명해주셔서 감사합니다! 피팅 복사 기능도 정말 편리하네요.",
    createdAt: "2024-01-15T14:15:00Z",
    likes: 8,
  },
]

export default function DoctrineDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(sampleDoctrine.likes)

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1)
      setIsLiked(false)
      toast({
        title: "좋아요 취소",
        description: "좋아요를 취소했습니다.",
      })
    } else {
      setLikeCount((prev) => prev + 1)
      setIsLiked(true)
      toast({
        title: "좋아요!",
        description: "이 독트린을 좋아합니다.",
      })
    }
  }

  const formatDate = (dateString) => {
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
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button
            asChild
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            <Link href="/doctrine">
              <ArrowLeft className="mr-2 h-4 w-4" />
              독트린 목록으로
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {["캣포유", "대구", "물고기"].includes(sampleDoctrine.category) && (
                      <DoctrineLogo category={sampleDoctrine.category} size="md" />
                    )}
                    <Badge className="bg-cyan-600/20 text-cyan-300 border border-cyan-600/30">
                      {sampleDoctrine.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {sampleDoctrine.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(sampleDoctrine.createdAt)}
                    </div>
                  </div>
                </div>

                <CardTitle className="text-2xl text-white mb-4">{sampleDoctrine.title}</CardTitle>

                {/* 태그 */}
                {sampleDoctrine.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {sampleDoctrine.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="h-4 w-4" />
                    <span>by {sampleDoctrine.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={`border-slate-600 ${
                        isLiked
                          ? "bg-cyan-600 text-white hover:bg-cyan-700"
                          : "text-slate-300 hover:bg-slate-700 bg-transparent"
                      }`}
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      {likeCount}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Separator className="bg-slate-700" />

              <CardContent className="pt-6">
                <PostContentRenderer content={sampleDoctrine.content} showFittingCopy={true} />

                {/* 클립보드 섹션 추가 */}
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
                  댓글 ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.map((comment) => (
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
            {/* 작성자 정보 */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">작성자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">FC</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{sampleDoctrine.author}</p>
                    <p className="text-slate-400 text-sm">플릿 커맨더</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div>
                      <p className="text-white font-semibold">15</p>
                      <p className="text-slate-400">독트린</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold">342</p>
                      <p className="text-slate-400">좋아요</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 관련 독트린 */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">관련 독트린</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/doctrine/2"
                  className="block p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <p className="text-white text-sm font-medium">캣포유 신규 독트린 테스트</p>
                  <p className="text-slate-400 text-xs">by TestPilot</p>
                </Link>
                <Link
                  href="/doctrine/3"
                  className="block p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <p className="text-white text-sm font-medium">대구 방어 독트린 업데이트</p>
                  <p className="text-slate-400 text-xs">by DefenseExpert</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

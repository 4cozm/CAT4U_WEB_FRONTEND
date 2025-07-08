"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import PostContentRenderer from "@/components/post-content-renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ThumbsUp, MessageCircle, Clock, User, Eye, BookOpen } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import ClipboardSection from "@/components/clipboard-section"

const sampleGuide = {
  id: 1,
  title: "초보자를 위한 EVE Online 시작 가이드",
  category: "초보자",
  author: "MentorAlpha",
  likes: 156,
  comments: 43,
  views: 1234,
  createdAt: "2024-01-15T10:30:00Z",
  tags: ["초보자", "튜토리얼", "기초", "시작"],
  content: `# 초보자를 위한 EVE Online 시작 가이드

## 개요
EVE Online은 복잡하지만 매우 보람찬 게임입니다. 이 가이드는 새로운 파일럿들이 뉴에덴에서 첫 발을 내딛는 데 도움을 주기 위해 작성되었습니다.

## 캐릭터 생성

### 종족 선택
EVE Online에는 4개의 주요 종족이 있습니다:

- **아마르 (Amarr)**: 레이저 무기와 아머 탱킹에 특화
- **칼다리 (Caldari)**: 미사일과 실드 탱킹에 특화  
- **갈렌테 (Gallente)**: 드론과 하이브리드 무기에 특화
- **민마타 (Minmatar)**: 프로젝타일 무기와 속도에 특화

> **팁**: 종족 선택은 초기 스킬에만 영향을 주며, 나중에 모든 스킬을 배울 수 있습니다.

## 첫 단계

### 1. 튜토리얼 완료
게임을 시작하면 반드시 튜토리얼을 완료하세요:
- 기본 조작법 학습
- 첫 번째 함선 획득
- 기본 장비 사용법

### 2. 에이전트 미션 시작
튜토리얼 완료 후 에이전트 미션을 시작하세요:
- **보안 미션**: 전투 경험과 ISK 획득
- **채굴 미션**: 자원 채취 학습
- **유통 미션**: 운송과 거래 경험

### 3. 스킬 계획 세우기
EVE Online에서 스킬은 실시간으로 훈련됩니다:
- 목표에 맞는 스킬 계획 수립
- 우선순위가 높은 스킬부터 훈련
- 스킬 큐는 항상 가득 채워두기

## 기본 함선과 장비

### 프리깃 (Frigate)
초보자가 가장 먼저 사용하게 될 함선 클래스:
- 빠르고 민첩함
- 저렴한 비용
- 다양한 역할 수행 가능

### 기본 장비
- **무기**: 종족별 기본 무기 시스템
- **방어**: 실드 부스터 또는 아머 리페어러
- **추진**: 애프터버너 또는 마이크로워프드라이브

## ISK 벌기

### 초보자 친화적인 방법
1. **에이전트 미션**: 안정적인 수입원
2. **채굴**: 낮은 위험도, 꾸준한 수익
3. **탐험**: 높은 수익 가능성, 약간의 위험
4. **거래**: 시장 지식 필요, 높은 수익 가능

## 안전 수칙

### 하이섹에서도 주의하세요
- **자살 갱킹**: 비싼 화물을 노린 공격
- **사기**: 너무 좋은 거래는 의심하기
- **전쟁 선포**: 코퍼레이션 가입 시 주의

### 로우섹/널섹 진입 시
- 항상 도주 계획 세우기
- 로컬 채팅 모니터링
- 스캔 프로브 주의
- 값비싼 함선으로 무모한 모험 금지

## 커뮤니티 참여

### 코퍼레이션 가입
- 초보자 친화적인 코퍼레이션 찾기
- 멘토링과 지원 받기
- 그룹 활동 참여

### 유용한 도구들
- **EVE University Wiki**: 포괄적인 정보
- **Dotlan**: 맵과 통계 정보
- **EVE Echoes**: 모바일 버전
- **Pyfa**: 피팅 시뮬레이터

## 다음 단계

### 전문화 방향 선택
경험을 쌓은 후 전문 분야를 선택하세요:
- **PVP**: 플레이어 대 플레이어 전투
- **PVE**: 미션, 인커션, 아비설
- **산업**: 제조, 연구, 채굴
- **탐험**: 웜홀, 유적 탐사
- **거래**: 시장 조작, 운송업

## 마무리
EVE Online은 학습 곡선이 가파르지만, 인내심을 갖고 꾸준히 플레이하면 우주에서 자신만의 길을 찾을 수 있습니다. 

**기억하세요**: 실패는 학습의 기회입니다. 함선을 잃는 것을 두려워하지 말고, 각 경험에서 배우세요.

*Fly safe, pilot! o7*`,
}

const comments = [
  {
    id: 1,
    author: "NewPilot123",
    content: "정말 도움이 많이 됐습니다! 특히 스킬 계획 부분이 유용했어요.",
    createdAt: "2024-01-15T11:00:00Z",
    likes: 12,
  },
  {
    id: 2,
    author: "VeteranPlayer",
    content: "초보자들에게 추천하고 싶은 가이드네요. 잘 정리되어 있습니다.",
    createdAt: "2024-01-15T12:30:00Z",
    likes: 8,
  },
]

export default function GuideDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(sampleGuide.likes)

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1)
      setIsLiked(false)
    } else {
      setLikeCount((prev) => prev + 1)
      setIsLiked(true)
    }

    toast({
      title: isLiked ? "좋아요 취소" : "좋아요!",
      description: isLiked ? "좋아요를 취소했습니다." : "이 가이드를 좋아합니다.",
    })
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
            <Link href="/guide">
              <ArrowLeft className="mr-2 h-4 w-4" />
              가이드 목록으로
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-emerald-400" />
                    <Badge className="bg-emerald-600/20 text-emerald-300 border border-emerald-600/30">
                      {sampleGuide.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {sampleGuide.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(sampleGuide.createdAt)}
                    </div>
                  </div>
                </div>

                <CardTitle className="text-2xl text-white mb-4">{sampleGuide.title}</CardTitle>

                {sampleGuide.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {sampleGuide.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="h-4 w-4" />
                    <span>by {sampleGuide.author}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={`border-slate-600 ${
                      isLiked
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "text-slate-300 hover:bg-slate-700 bg-transparent"
                    }`}
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    {likeCount}
                  </Button>
                </div>
              </CardHeader>

              <Separator className="bg-slate-700" />

              <CardContent className="pt-6">
                <PostContentRenderer content={sampleGuide.content} />

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
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">작성자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">MA</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{sampleGuide.author}</p>
                    <p className="text-slate-400 text-sm">가이드 전문가</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">관련 가이드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/guide/2"
                  className="block p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <p className="text-white text-sm font-medium">PVP 기초: 솔로 파이팅 입문</p>
                  <p className="text-slate-400 text-xs">by PVPMaster</p>
                </Link>
                <Link
                  href="/guide/3"
                  className="block p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <p className="text-white text-sm font-medium">미션 러닝 완벽 가이드</p>
                  <p className="text-slate-400 text-xs">by MissionRunner</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Eye, ArrowLeft, Share2 } from "lucide-react"

// 정적 생성을 위한 함수
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

// 정적 데이터
const guides = {
  "1": {
    id: 1,
    title: "초보자를 위한 EVE Online 시작 가이드",
    content: `# EVE Online 시작하기

EVE Online은 복잡하지만 매우 흥미로운 우주 MMO 게임입니다. 이 가이드는 초보자들이 게임을 시작할 때 알아야 할 기본적인 내용들을 다룹니다.

## 1. 캐릭터 생성

캐릭터를 생성할 때는 다음 사항들을 고려해야 합니다:

- **종족 선택**: 각 종족마다 고유한 특성과 시작 위치가 있습니다
- **혈통 선택**: 초기 스킬과 속성에 영향을 줍니다
- **외모 설정**: 나중에 변경 가능하지만 비용이 듭니다

## 2. 튜토리얼 완주

게임 내 튜토리얼은 반드시 완주하시기 바랍니다:

1. **기본 조작법 익히기**
2. **우주선 조종법**
3. **전투 시스템**
4. **마켓 사용법**

## 3. 첫 번째 목표 설정

초보자에게 추천하는 첫 번째 목표들:

- 에이전트 미션 수행
- 마이닝으로 ISK 벌기
- 스킬 트레이닝 계획 세우기

## 4. 주의사항

- **절대 혼자 Low-Sec이나 Null-Sec에 가지 마세요**
- **값비싼 아이템은 High-Sec에서만 운송하세요**
- **스캠에 주의하세요**

이 가이드가 EVE Online 여정의 시작에 도움이 되기를 바랍니다!`,
    author: "베테랑파일럿",
    createdAt: "2024-01-15",
    views: 1250,
    likes: 45,
    comments: 12,
    tags: ["초보자", "튜토리얼", "기초"],
  },
  "2": {
    id: 2,
    title: "ISK 벌이 완벽 가이드 2024",
    content: `# ISK 벌이 완벽 가이드

EVE Online에서 ISK(게임 내 화폐)를 효율적으로 벌 수 있는 다양한 방법들을 소개합니다.

## 1. 미션 (Mission Running)

### Level 4 미션
- **시간당 수익**: 50-100M ISK
- **필요 스킬**: 배틀쉽 운용 능력
- **추천 함선**: Raven, Dominix, Machariel

### 버너 미션 (Burner Mission)
- **시간당 수익**: 100-200M ISK
- **난이도**: 높음
- **필요사항**: 특화된 피팅과 스킬

## 2. 마이닝 (Mining)

### 하이섹 마이닝
- **시간당 수익**: 20-40M ISK
- **안전도**: 높음
- **추천 함선**: Hulk, Mackinaw

### 가스 하베스팅
- **시간당 수익**: 30-80M ISK
- **위험도**: 중간
- **필요사항**: 가스 하베스터

## 3. 트레이딩

### 스테이션 트레이딩
- **초기 자본**: 최소 1B ISK
- **시간당 수익**: 50-500M ISK
- **필요 스킬**: 트레이딩 관련 스킬

### 지역간 트레이딩
- **위험도**: 높음
- **수익률**: 매우 높음
- **주의사항**: 운송 중 PvP 위험

효율적인 ISK 벌이를 위해서는 자신의 플레이 스타일과 가용 시간을 고려하여 적절한 방법을 선택하는 것이 중요합니다.`,
    author: "억만장자",
    createdAt: "2024-01-14",
    views: 5420,
    likes: 156,
    comments: 34,
    tags: ["ISK", "경제", "트레이딩"],
  },
  "3": {
    id: 3,
    title: "Null-Sec 생존 가이드",
    content: `# Null-Sec 생존 가이드

Null-Sec은 EVE Online에서 가장 위험하지만 보상이 큰 지역입니다. 안전하게 활동하기 위한 필수 지식을 공유합니다.

## 1. 기본 준비사항

### 필수 스킬
- **Cloaking IV**: 은폐 장치 사용
- **Covert Ops**: 은폐 정찰함 운용
- **Interdiction Nullification**: 버블 무시

### 필수 장비
- **Covert Ops Cloak**: 워프 중 은폐 가능
- **Interdiction Nullifier**: 버블 무시 모듈
- **Probe Scanner**: 워프홀 탐지

## 2. 인텔 채널 활용

### Local 채널 모니터링
- 새로운 파일럿 진입 시 즉시 확인
- 중립/적대 세력 식별
- 채팅 내용으로 상황 파악

### 인텔 봇 활용
- 실시간 적 움직임 추적
- 위험 지역 사전 파악
- 안전한 루트 계획

## 3. 안전 수칙

### 절대 규칙
1. **혼자 다니지 말 것**
2. **AFK 상태로 두지 말 것**
3. **예측 가능한 패턴 피하기**
4. **항상 탈출 계획 준비**

### 위험 신호
- Local에 알 수 없는 파일럿
- D-scan에 전투함 감지
- 게이트 캠프 정보

## 4. 응급 상황 대처

### 버블에 걸렸을 때
1. 즉시 MWD 켜기
2. 가장 가까운 천체로 워프
3. 클로킹 장치 활성화

### 추격당할 때
- 예측 불가능한 워프
- 안전한 스테이션으로 도킹
- 필요시 자폭 고려

Null-Sec에서의 생존은 경험과 준비가 전부입니다. 항상 조심하고 팀과 소통하세요!`,
    author: "Null_Survivor",
    createdAt: "2024-01-13",
    views: 890,
    likes: 67,
    comments: 18,
    tags: ["Null-Sec", "생존", "PvP"],
  },
}

const comments = [
  {
    id: 1,
    author: "초보파일럿",
    content: "정말 도움이 되는 가이드네요! 감사합니다.",
    createdAt: "2024-01-16",
    likes: 5,
  },
  {
    id: 2,
    author: "베테랑",
    content: "추가로 스킬 큐 관리에 대한 내용도 있으면 좋겠어요.",
    createdAt: "2024-01-16",
    likes: 3,
  },
]

export default function GuideDetailPage({ params }: { params: { id: string } }) {
  const guide = guides[params.id as keyof typeof guides]

  if (!guide) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/guide/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            가이드 목록으로
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{guide.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          {guide.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <span>작성자: {guide.author}</span>
            <span>{guide.createdAt}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {guide.views}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {guide.likes}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {guide.comments}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            좋아요
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            공유
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            {guide.content.split("\n").map((line, index) => {
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
              } else if (line.match(/^\d+\. /)) {
                return (
                  <li key={index} className="ml-4 list-decimal">
                    {line.substring(line.indexOf(" ") + 1)}
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
          <h3 className="text-lg font-semibold">댓글 ({comments.length})</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          <div className="space-y-4">
            <Textarea placeholder="댓글을 작성해주세요..." />
            <Button>댓글 작성</Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{comment.author}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{comment.createdAt}</span>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-3 h-3 mr-1" />
                      {comment.likes}
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

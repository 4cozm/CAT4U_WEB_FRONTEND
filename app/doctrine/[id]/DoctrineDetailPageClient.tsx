"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Eye, ArrowLeft, Share2, Copy } from "lucide-react"

const doctrines = {
  "1": {
    id: 1,
    title: "Null-Sec 생존 독트린 모음",
    content: `# Null-Sec 생존 독트린

대규모 함대전에서 생존률을 높이기 위한 독트린들을 소개합니다.

## 1. Hurricane Fleet Issue 알파 독트린

빠른 기동성과 강력한 알파 데미지를 바탕으로 한 독트린입니다.

### 주요 특징
- 높은 기동성
- 강력한 알파 스트라이크
- 상대적으로 저렴한 비용

### 운용 방법
1. 적 함대와 거리 유지
2. 알파 스트라이크로 적 함선 제거
3. 필요시 신속한 철수`,
    author: "FC_Commander",
    createdAt: "2024-01-14",
    views: 890,
    likes: 32,
    comments: 8,
    tags: ["Null-Sec", "함대전", "PvP"],
    clipboards: [
      {
        id: 1,
        title: "Hurricane Fleet Issue - 알파 피팅",
        content: `[Hurricane Fleet Issue, Alpha Strike]
720mm Howitzer Artillery II
720mm Howitzer Artillery II
720mm Howitzer Artillery II
720mm Howitzer Artillery II
720mm Howitzer Artillery II
720mm Howitzer Artillery II

Large Shield Extender II
Large Shield Extender II
Adaptive Invulnerability Field II
10MN Afterburner II
Warp Disruptor II

Gyrostabilizer II
Gyrostabilizer II
Tracking Enhancer II
Damage Control II

Medium Core Defense Field Extender I
Medium Core Defense Field Extender I
Medium Anti-EM Screen Reinforcer I`,
      },
    ],
  },
  "2": {
    id: 2,
    title: "대규모 함대전 독트린 분석",
    content: `# 대규모 함대전 독트린 분석

최근 대규모 전투에서 사용된 독트린들을 분석합니다.`,
    author: "Fleet_Analyst",
    createdAt: "2024-01-13",
    views: 3890,
    likes: 134,
    comments: 45,
    tags: ["함대전", "분석", "전략"],
    clipboards: [],
  },
}

export default function DoctrineDetailPageClient({ params }: { params: { id: string } }) {
  const doctrine = doctrines[params.id as keyof typeof doctrines]

  if (!doctrine) {
    notFound()
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    alert("클립보드에 복사되었습니다!")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/doctrine/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            독트린 목록으로
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{doctrine.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          {doctrine.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <span>작성자: {doctrine.author}</span>
            <span>{doctrine.createdAt}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {doctrine.views}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {doctrine.likes}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {doctrine.comments}
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
            {doctrine.content.split("\n").map((line, index) => {
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

      {/* Clipboard Section */}
      {doctrine.clipboards && doctrine.clipboards.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold">클립보드 ({doctrine.clipboards.length})</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {doctrine.clipboards.map((clipboard) => (
              <div key={clipboard.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{clipboard.title}</h4>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(clipboard.content)}>
                    <Copy className="w-4 h-4 mr-2" />
                    복사
                  </Button>
                </div>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{clipboard.content}</code>
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">댓글 (0)</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Textarea placeholder="댓글을 작성해주세요..." />
            <Button>댓글 작성</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Eye, ArrowLeft, Share2, Copy } from "lucide-react"

const fittings = {
  "1": {
    id: 1,
    title: "PvP 프리깃 피팅 추천",
    content: `# PvP 프리깃 피팅 가이드

솔로 PvP에 적합한 프리깃 피팅들을 소개합니다.

## 1. Rifter - 근접 전투형

빠른 속도와 강력한 근접 화력을 바탕으로 한 클래식 피팅입니다.

### 특징
- 높은 기동성
- 강력한 근접 DPS
- 상대적으로 저렴한 비용

## 2. Merlin - 키팅형

거리를 유지하며 지속적인 데미지를 가하는 피팅입니다.`,
    author: "PvP_Master",
    createdAt: "2024-01-13",
    views: 2100,
    likes: 78,
    comments: 25,
    tags: ["PvP", "프리깃", "솔로"],
    clipboards: [
      {
        id: 1,
        title: "Rifter - 근접 전투형",
        content: `[Rifter, Close Combat]
200mm AutoCannon II
200mm AutoCannon II
200mm AutoCannon II
Rocket Launcher II

1MN Afterburner II
Warp Scrambler II
Small Shield Extender II

Damage Control II
Gyrostabilizer II
Small Armor Repairer II

Small Projectile Collision Accelerator I
Small Projectile Burst Aerator I
Small Anti-Explosive Pump I`,
      },
      {
        id: 2,
        title: "Merlin - 키팅형",
        content: `[Merlin, Kiting]
Light Neutron Blaster II
Light Neutron Blaster II
Light Neutron Blaster II

1MN Afterburner II
Warp Scrambler II
Small Shield Extender II

Damage Control II
Magnetic Field Stabilizer II
Small Armor Repairer II

Small Hybrid Collision Accelerator I
Small Hybrid Burst Aerator I
Small Anti-Explosive Pump I`,
      },
    ],
  },
  "2": {
    id: 2,
    title: "미션용 배틀쉽 피팅 모음",
    content: `# 미션용 배틀쉽 피팅

Level 4 미션을 효율적으로 수행할 수 있는 배틀쉽 피팅들입니다.`,
    author: "Mission_Runner",
    createdAt: "2024-01-12",
    views: 1560,
    likes: 45,
    comments: 18,
    tags: ["미션", "배틀쉽", "PvE"],
    clipboards: [],
  },
}

export function FittingDetailPageClient({ params }: { params: { id: string } }) {
  const fitting = fittings[params.id as keyof typeof fittings]

  if (!fitting) {
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
        <Link href="/fitting/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            피팅 목록으로
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{fitting.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          {fitting.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <span>작성자: {fitting.author}</span>
            <span>{fitting.createdAt}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {fitting.views}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {fitting.likes}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {fitting.comments}
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
            {fitting.content.split("\n").map((line, index) => {
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
      {fitting.clipboards && fitting.clipboards.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold">피팅 정보 ({fitting.clipboards.length})</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {fitting.clipboards.map((clipboard) => (
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

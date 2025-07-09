import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageSquare, Eye, Plus, Search, Copy } from "lucide-react"

const doctrines = [
  {
    id: 1,
    title: "Null-Sec 생존 독트린 모음",
    content: "대규모 함대전에서 사용되는 주요 독트린들을 정리했습니다. Hurricane Fleet Issue 기반의 알파 독트린부터...",
    author: "FC_Commander",
    createdAt: "2024-01-14",
    views: 890,
    likes: 32,
    comments: 8,
    clipboards: 5,
    tags: ["Null-Sec", "함대전", "PvP"],
  },
  {
    id: 2,
    title: "대규모 함대전 독트린 분석",
    content: "최근 대규모 전투에서 사용된 독트린들을 분석하고 각각의 장단점을 설명합니다...",
    author: "Fleet_Analyst",
    createdAt: "2024-01-13",
    views: 3890,
    likes: 134,
    comments: 45,
    clipboards: 12,
    tags: ["함대전", "분석", "전략"],
  },
]

export default function DoctrinePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">독트린</h1>
          <p className="text-gray-600">함대전과 PvP를 위한 독트린과 전략을 공유하세요</p>
        </div>
        <Link href="/doctrine/write/">
          <Button className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            독트린 작성
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="독트린 검색..." className="pl-10" />
        </div>
      </div>

      {/* Doctrine List */}
      <div className="space-y-6">
        {doctrines.map((doctrine) => (
          <Card key={doctrine.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div>
                  <Link href={`/doctrine/${doctrine.id}/`}>
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                      {doctrine.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-3 line-clamp-2">{doctrine.content}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {doctrine.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>by {doctrine.author}</span>
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
                    <span className="flex items-center text-blue-600">
                      <Copy className="w-4 h-4 mr-1" />
                      {doctrine.clipboards}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

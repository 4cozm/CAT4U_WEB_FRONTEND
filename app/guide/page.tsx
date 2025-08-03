import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageSquare, Eye, Plus, Search } from "lucide-react"

// 정적 데이터
const guides = [
  {
    id: 1,
    title: "초보자를 위한 EVE Online 시작 가이드",
    content: "EVE Online을 처음 시작하는 분들을 위한 완벽한 가이드입니다. 캐릭터 생성부터 첫 번째 미션까지...",
    author: "베테랑파일럿",
    createdAt: "2024-01-15",
    views: 1250,
    likes: 45,
    comments: 12,
    tags: ["초보자", "튜토리얼", "기초"],
  },
  {
    id: 2,
    title: "ISK 벌이 완벽 가이드 2024",
    content: "효율적인 ISK 획득 방법들을 정리했습니다. 미션, 마이닝, 트레이딩까지 모든 방법을 다룹니다...",
    author: "억만장자",
    createdAt: "2024-01-14",
    views: 5420,
    likes: 156,
    comments: 34,
    tags: ["ISK", "경제", "트레이딩"],
  },
  {
    id: 3,
    title: "Null-Sec 생존 가이드",
    content: "Null-Sec에서 안전하게 활동하는 방법과 주의사항들을 설명합니다...",
    author: "Null_Survivor",
    createdAt: "2024-01-13",
    views: 890,
    likes: 67,
    comments: 18,
    tags: ["Null-Sec", "생존", "PvP"],
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">가이드</h1>
              <p className="text-gray-600">EVE Online 플레이에 도움이 되는 가이드들을 확인하세요</p>
            </div>
            <Link href="/guide/write/">
              <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                가이드 작성
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="가이드 검색..." className="pl-10 bg-white border-gray-200" />
          </div>
        </div>

        {/* Guide List */}
        <div className="space-y-4">
          {guides.map((guide) => (
            <Card key={guide.id} className="card-hover bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <Link href={`/guide/${guide.id}/`}>
                      <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                        {guide.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{guide.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {guide.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">by {guide.author}</span>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button variant="outline" disabled className="border-gray-200 bg-transparent">
              이전
            </Button>
            <Button variant="outline" className="bg-blue-600 text-white border-blue-600">
              1
            </Button>
            <Button variant="outline" className="border-gray-200 bg-transparent">
              2
            </Button>
            <Button variant="outline" className="border-gray-200 bg-transparent">
              3
            </Button>
            <Button variant="outline" className="border-gray-200 bg-transparent">
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageSquare, Eye, Plus, Search, DollarSign } from "lucide-react"

const marketItems = [
  {
    id: 1,
    title: "Titan 급매 - Avatar 완전 피팅",
    content: "급하게 ISK가 필요해서 Avatar를 급매합니다. 완전 피팅 상태이며 Jita 4-4에 위치...",
    author: "급매왕",
    createdAt: "2024-01-15",
    views: 3200,
    likes: 12,
    comments: 45,
    price: "85B ISK",
    status: "판매중",
    tags: ["Titan", "급매", "완전피팅"],
  },
  {
    id: 2,
    title: "드레드노트 Naglfar 판매",
    content: "잘 관리된 Naglfar 드레드노트를 판매합니다. 점프 드라이브 캘리브레이션 V...",
    author: "함선딜러",
    createdAt: "2024-01-14",
    views: 1890,
    likes: 8,
    comments: 23,
    price: "2.5B ISK",
    status: "판매중",
    tags: ["드레드노트", "Naglfar", "캐피털"],
  },
]

export default function MarketPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">장터</h1>
          <p className="text-gray-600">함선, 모듈, 기타 아이템을 사고팔아보세요</p>
        </div>
        <Link href="/market/write/">
          <Button className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            판매글 등록
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="아이템 검색..." className="pl-10" />
        </div>
      </div>

      {/* Market List */}
      <div className="space-y-6">
        {marketItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Link href={`/market/${item.id}/`}>
                      <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {item.title}
                      </h2>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.status === "판매중" ? "default" : "secondary"}>{item.status}</Badge>
                      <div className="flex items-center text-green-600 font-semibold">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {item.price}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{item.content}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>by {item.author}</span>
                    <span>{item.createdAt}</span>
                  </div>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

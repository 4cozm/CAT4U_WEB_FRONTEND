import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Clock, MessageSquare, Heart, Eye } from "lucide-react"

// 정적 데이터
const latestPosts = [
  {
    id: 1,
    title: "초보자를 위한 EVE Online 시작 가이드",
    category: "guide",
    categoryName: "가이드",
    author: "베테랑파일럿",
    createdAt: "2024-01-15",
    views: 1250,
    likes: 45,
    comments: 12,
  },
  {
    id: 2,
    title: "Null-Sec 생존 독트린 모음",
    category: "doctrine",
    categoryName: "독트린",
    author: "FC_Commander",
    createdAt: "2024-01-14",
    views: 890,
    likes: 32,
    comments: 8,
  },
  {
    id: 3,
    title: "PvP 프리깃 피팅 추천",
    category: "fitting",
    categoryName: "피팅",
    author: "PvP_Master",
    createdAt: "2024-01-13",
    views: 2100,
    likes: 78,
    comments: 25,
  },
]

const popularPosts = [
  {
    id: 4,
    title: "ISK 벌이 완벽 가이드 2024",
    category: "guide",
    categoryName: "가이드",
    author: "억만장자",
    likes: 156,
    views: 5420,
  },
  {
    id: 5,
    title: "대규모 함대전 독트린 분석",
    category: "doctrine",
    categoryName: "독트린",
    author: "Fleet_Analyst",
    likes: 134,
    views: 3890,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">EVE Online 한국 커뮤니티</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            가이드, 독트린, 피팅 정보를 공유하고 함께 성장하세요
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/guide/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                가이드 보기
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/doctrine/">
              <Button size="lg" variant="outline" className="border-gray-300 bg-transparent">
                독트린 확인
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Posts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Clock className="mr-3 w-6 h-6 text-blue-600" />
                최신 글
              </h2>
              <Link href="/guide/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                  전체보기 <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {latestPosts.map((post) => (
                <Card key={post.id} className="card-hover border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                            {post.categoryName}
                          </Badge>
                          <span className="text-sm text-gray-500">{post.createdAt}</span>
                        </div>
                        <Link href={`/${post.category}/${post.id}/`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                            {post.title}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="font-medium">by {post.author}</span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Posts */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 w-5 h-5 text-red-500" />
                  인기 글
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularPosts.map((post) => (
                    <div key={post.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {post.categoryName}
                      </Badge>
                      <Link href={`/${post.category}/${post.id}/`}>
                        <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors mb-2 leading-snug">
                          {post.title}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>by {post.author}</span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {post.likes}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">바로가기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/guide/write/" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-200 hover:bg-gray-50 bg-transparent"
                    >
                      가이드 작성
                    </Button>
                  </Link>
                  <Link href="/doctrine/write/" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-200 hover:bg-gray-50 bg-transparent"
                    >
                      독트린 작성
                    </Button>
                  </Link>
                  <Link href="/fitting/write/" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-200 hover:bg-gray-50 bg-transparent"
                    >
                      피팅 공유
                    </Button>
                  </Link>
                  <Link href="/market/write/" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-200 hover:bg-gray-50 bg-transparent"
                    >
                      장터 등록
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

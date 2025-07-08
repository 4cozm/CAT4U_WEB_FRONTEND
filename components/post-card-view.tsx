import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageCircle, Clock } from "lucide-react"
import DoctrineLogo from "./doctrine-logo"
import Link from "next/link"

interface Post {
  id: number
  title: string
  category: string
  author: string
  likes: number
  comments: number
  createdAt: string
  excerpt: string
}

interface PostCardViewProps {
  posts: Post[]
  showDoctrineLogos?: boolean
}

export default function PostCardView({ posts, showDoctrineLogos = false }: PostCardViewProps) {
  const getCategoryColor = (category: string, showDoctrineLogos: boolean) => {
    if (showDoctrineLogos) {
      return "bg-cyan-600/20 text-cyan-300 border-cyan-600/30"
    }

    switch (category) {
      case "PVP":
        return "bg-red-600/20 text-red-300 border-red-600/30"
      case "PVE":
        return "bg-green-600/20 text-green-300 border-green-600/30"
      case "피팅 피드백":
        return "bg-yellow-600/20 text-yellow-300 border-yellow-600/30"
      case "함선":
        return "bg-blue-600/20 text-blue-300 border-blue-600/30"
      case "모듈":
        return "bg-purple-600/20 text-purple-300 border-purple-600/30"
      case "스킬북":
        return "bg-emerald-600/20 text-emerald-300 border-emerald-600/30"
      case "블루프린트":
        return "bg-indigo-600/20 text-indigo-300 border-indigo-600/30"
      case "자원":
        return "bg-amber-600/20 text-amber-300 border-amber-600/30"
      case "가이드":
      case "초보자":
      case "산업":
      case "탐험":
        return "bg-emerald-600/20 text-emerald-300 border-emerald-600/30"
      default:
        return "bg-slate-600/20 text-slate-300 border-slate-600/30"
    }
  }

  const getPagePrefix = (category: string, showDoctrineLogos: boolean) => {
    if (showDoctrineLogos) return "doctrine"
    if (["PVP", "PVE", "피팅 피드백"].includes(category)) return "fitting"
    if (["함선", "모듈", "스킬북", "블루프린트", "자원", "기타"].includes(category)) return "market"
    if (["가이드", "초보자", "산업", "탐험"].includes(category)) return "guide"
    return "doctrine"
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="border-slate-700 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-800/90 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showDoctrineLogos && ["캣포유", "대구", "물고기"].includes(post.category) && (
                  <DoctrineLogo category={post.category} size="sm" />
                )}
                <Badge variant="outline" className={getCategoryColor(post.category, showDoctrineLogos)}>
                  {post.category}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-slate-400">
                <Clock className="mr-1 h-3 w-3" />
                {post.createdAt}
              </div>
            </div>
            <CardTitle className="text-white hover:text-cyan-300 cursor-pointer transition-colors">
              <Link href={`/${getPagePrefix(post.category, showDoctrineLogos)}/${post.id}`}>{post.title}</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-200 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>by {post.author}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center hover:text-cyan-400 transition-colors">
                  <ThumbsUp className="mr-1 h-3 w-3" />
                  {post.likes}
                </div>
                <div className="flex items-center hover:text-cyan-400 transition-colors">
                  <MessageCircle className="mr-1 h-3 w-3" />
                  {post.comments}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageCircle, Clock, User } from "lucide-react"
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

interface PostListViewProps {
  posts: Post[]
  showDoctrineLogos?: boolean
}

export default function PostListView({ posts, showDoctrineLogos = false }: PostListViewProps) {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors rounded-lg p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {showDoctrineLogos && ["캣포유", "대구", "물고기"].includes(post.category) && (
                  <DoctrineLogo category={post.category} size="sm" />
                )}
                <Badge
                  variant="secondary"
                  className={
                    showDoctrineLogos
                      ? "bg-blue-600/20 text-blue-300"
                      : post.category === "PVP"
                        ? "bg-red-600/20 text-red-300"
                        : post.category === "PVE"
                          ? "bg-green-600/20 text-green-300"
                          : post.category === "피팅 피드백"
                            ? "bg-yellow-600/20 text-yellow-300"
                            : post.category === "가이드" ||
                                post.category === "초보자" ||
                                post.category === "산업" ||
                                post.category === "탐험"
                              ? "bg-emerald-600/20 text-emerald-300"
                              : "bg-blue-600/20 text-blue-300"
                  }
                >
                  {post.category}
                </Badge>
                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="mr-1 h-3 w-3" />
                  {post.createdAt}
                </div>
              </div>

              <h3 className="text-white font-semibold hover:text-blue-300 cursor-pointer mb-2 truncate">
                <Link
                  href={`/${
                    showDoctrineLogos
                      ? "doctrine"
                      : post.category === "PVP" || post.category === "PVE" || post.category === "피팅 피드백"
                        ? "fitting"
                        : post.category === "가이드" ||
                            post.category === "초보자" ||
                            post.category === "산업" ||
                            post.category === "탐험"
                          ? "guide"
                          : "market"
                  }/${post.id}`}
                >
                  {post.title}
                </Link>
              </h3>

              <p className="text-sm text-slate-200 line-clamp-2 mb-3">{post.excerpt}</p>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span>by {post.author}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    {post.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="mr-1 h-3 w-3" />
                    {post.comments}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

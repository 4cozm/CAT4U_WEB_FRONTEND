import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageCircle, Clock } from "lucide-react"
import DoctrineLogo from "./doctrine-logo"

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

interface PostListProps {
  posts: Post[]
  title: string
}

export default function PostList({ posts, title }: PostListProps) {
  return (
    <section className="py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="mb-8 text-2xl font-bold text-white">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="border-slate-700 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-800/90 transition-colors"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {["캣포유", "대구", "물고기"].includes(post.category) && (
                      <DoctrineLogo category={post.category} size="sm" />
                    )}
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-slate-400">
                    <Clock className="mr-1 h-3 w-3" />
                    {post.createdAt}
                  </div>
                </div>
                <CardTitle className="text-white hover:text-blue-400 cursor-pointer">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-slate-300 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>by {post.author}</span>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

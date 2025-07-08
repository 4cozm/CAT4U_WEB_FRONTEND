import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-slate-700 bg-slate-800/50 text-center">
        <CardHeader>
          <div className="h-20 w-20 mx-auto rounded-full overflow-hidden border-2 border-orange-500/50 mb-4">
            <img src="/images/logo-cat.png" alt="대물캣 로고" className="h-full w-full object-cover" />
          </div>
          <CardTitle className="text-white text-2xl">페이지를 찾을 수 없습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전 페이지
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

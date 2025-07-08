"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const storedState = localStorage.getItem("eve_auth_state")

        if (!code) {
          throw new Error("인증 코드가 없습니다.")
        }

        if (state !== storedState) {
          throw new Error("상태값이 일치하지 않습니다.")
        }

        // 여기서 실제 EVE Online API 호출
        // const response = await fetch('/api/auth/eve', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code })
        // })

        // 임시 성공 처리
        setStatus("success")
        setMessage("EVE Online 로그인이 완료되었습니다!")

        // 상태값 정리
        localStorage.removeItem("eve_auth_state")

        // 3초 후 홈으로 리다이렉트
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } catch (error) {
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white text-center">EVE Online 로그인</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === "loading" && (
              <>
                <div className="h-16 w-16 mx-auto rounded-full overflow-hidden border-2 border-orange-500/50 mb-4">
                  <img
                    src="/images/logo-cat.png"
                    alt="대물캣 로고"
                    className="h-full w-full object-cover animate-pulse"
                  />
                </div>
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-400" />
                <p className="text-slate-300">로그인 처리 중...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-12 w-12 mx-auto text-green-400" />
                <p className="text-green-400">{message}</p>
                <p className="text-slate-400 text-sm">잠시 후 홈페이지로 이동합니다.</p>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 mx-auto text-red-400" />
                <p className="text-red-400">{message}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const getApiUrl = () => {
    if (typeof window === "undefined") return ""

    const currentUrl = window.location.href
    const hostname = window.location.hostname
    const port = window.location.port

    // 개발 환경 확인
    if (hostname === "127.0.0.1" || hostname === "localhost") {
      const baseUrl = port ? `${hostname}:${port}` : hostname
      return `http://${baseUrl}/api/esi/login`
    }

    // 운영 환경 확인
    if (hostname === "web.cat4u.store") {
      return `https://web.cat4u.store/api/login/esi`
    }

    // 기본값 (현재 도메인 사용)
    return `${window.location.origin}/api/login/esi`
  }

  const handleEveLogin = async () => {
    setIsLoading(true)

    try {
      const apiUrl = getApiUrl()
      console.log("API URL:", apiUrl)

      // GET 요청으로 ESI 로그인 엔드포인트 호출
      window.location.href = apiUrl
    } catch (error) {
      console.error("로그인 오류:", error)
      alert("로그인 중 오류가 발생했습니다.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
          </div>
          <CardTitle className="text-2xl">EVE Community</CardTitle>
          <CardDescription>EVE Online 한국 커뮤니티에 오신 것을 환영합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* EVE Online SSO */}
          <Button
            onClick={handleEveLogin}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                로그인 중...
              </>
            ) : (
              <>
                <div className="w-5 h-5 bg-white rounded mr-2 flex items-center justify-center">
                  <span className="text-orange-600 text-xs font-bold">EVE</span>
                </div>
                EVE Online으로 로그인
              </>
            )}
          </Button>

          {/* 환경 정보 표시 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">로그인 안내</p>
                <p>
                  EVE Online SSO를 통해 안전하게 로그인할 수 있습니다. CCP Games의 공식 인증 시스템을 사용하여
                  개인정보를 보호합니다.
                </p>
                <p className="mt-2 text-xs text-blue-600">
                  현재 환경: {typeof window !== "undefined" ? window.location.hostname : ""}
                </p>
              </div>
            </div>
          </div>

          {/* 개발 정보 */}
          {typeof window !== "undefined" &&
            (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">개발 환경</p>
                    <p>현재 개발 환경에서 실행 중입니다.</p>
                    <p className="text-xs mt-1">API URL: {getApiUrl()}</p>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}

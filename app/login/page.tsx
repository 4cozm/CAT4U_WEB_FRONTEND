"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 정적 사이트이므로 실제 로그인 로직은 없음
    setTimeout(() => {
      setIsLoading(false)
      alert("정적 사이트에서는 실제 로그인이 불가능합니다.")
    }, 1000)
  }

  const handleEveSSO = () => {
    alert("EVE Online SSO 연동은 향후 구현 예정입니다.")
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>EVE Community에 오신 것을 환영합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* EVE Online SSO */}
          <Button onClick={handleEveSSO} className="w-full bg-orange-600 hover:bg-orange-700 text-white" size="lg">
            <div className="w-5 h-5 bg-white rounded mr-2 flex items-center justify-center">
              <span className="text-orange-600 text-xs font-bold">EVE</span>
            </div>
            EVE Online으로 로그인
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Button variant="link" size="sm">
              비밀번호를 잊으셨나요?
            </Button>
            <div className="text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <Button variant="link" size="sm" className="p-0 h-auto">
                회원가입
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">정적 사이트 안내</p>
                <p>
                  현재는 정적 사이트로 구성되어 실제 로그인 기능은 동작하지 않습니다. 향후 백엔드 연동 시 EVE Online
                  SSO를 통한 인증을 지원할 예정입니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

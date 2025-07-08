"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, User, LogOut } from "lucide-react"

interface EveCharacter {
  character_id: number
  character_name: string
  corporation_name: string
  alliance_name?: string
}

export default function EveAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [character, setCharacter] = useState<EveCharacter | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // EVE Online SSO 로그인 시작
  const handleEveLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_EVE_CLIENT_ID || "your-client-id"
    const redirectUri = encodeURIComponent(window.location.origin + "/auth/callback")
    const scopes = encodeURIComponent("publicData")
    const state = Math.random().toString(36).substring(7)

    localStorage.setItem("eve_auth_state", state)

    const authUrl = `https://login.eveonline.com/v2/oauth/authorize/?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&scope=${scopes}&state=${state}`

    window.location.href = authUrl
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCharacter(null)
    setIsDialogOpen(false)
    localStorage.removeItem("eve_access_token")
    localStorage.removeItem("eve_refresh_token")
  }

  // 임시 로그인 상태
  const handleTempLogin = () => {
    setCharacter({
      character_id: 123456789,
      character_name: "대물캣파일럿",
      corporation_name: "대물캣 코퍼레이션",
      alliance_name: "대물캣 얼라이언스",
    })
    setIsLoggedIn(true)
    setIsDialogOpen(false)
  }

  if (isLoggedIn && character) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
            <User className="mr-2 h-4 w-4" />
            {character.character_name}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">파일럿 정보</DialogTitle>
          </DialogHeader>
          <Card className="border-slate-600 bg-slate-700/50">
            <CardHeader>
              <CardTitle className="text-orange-400">{character.character_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-slate-300">
                <span className="font-medium">코퍼레이션:</span> {character.corporation_name}
              </p>
              {character.alliance_name && (
                <p className="text-slate-300">
                  <span className="font-medium">얼라이언스:</span> {character.alliance_name}
                </p>
              )}
              <p className="text-slate-400 text-sm">캐릭터 ID: {character.character_id}</p>
            </CardContent>
          </Card>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
          <LogIn className="mr-2 h-4 w-4" />
          로그인
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">EVE Online 로그인</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="border-slate-600 bg-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <p className="text-slate-300">EVE Online 계정으로 안전하게 로그인하세요</p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleEveLogin} className="w-full bg-orange-600 hover:bg-orange-700">
            <LogIn className="mr-2 h-4 w-4" />
            EVE Online SSO 로그인
          </Button>

          <Button
            onClick={handleTempLogin}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            임시 로그인 (개발용)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import MarkdownEditor from "@/components/markdown-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Save, ShoppingCart, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function MarketWritePage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [tradeType, setTradeType] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")
  const [content, setContent] = useState(`# 거래 상품 정보

## 상품 설명
판매/구매하려는 아이템에 대한 상세한 설명을 작성하세요.

## 거래 조건
- **가격**: ISK 또는 교환 조건
- **위치**: 거래 장소
- **연락처**: 게임 내 메일 또는 연락 방법

## 추가 정보
- 아이템 상태, 수량 등 추가 정보를 기재하세요.
`)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !category || !tradeType || !content.trim()) {
      toast({
        title: "오류",
        description: "필수 필드를 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "성공",
      description: "거래글이 성공적으로 작성되었습니다.",
    })

    setTimeout(() => {
      router.push("/market")
    }, 1500)
  }

  const handleSaveDraft = () => {
    toast({
      title: "임시저장 완료",
      description: "작성 중인 내용이 임시저장되었습니다.",
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              asChild
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent"
            >
              <Link href="/market">
                <ArrowLeft className="mr-2 h-4 w-4" />
                돌아가기
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white">거래글 작성</h1>
          </div>
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent"
          >
            <Save className="mr-2 h-4 w-4" />
            임시저장
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  거래 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">거래 유형 *</label>
                    <Select value={tradeType} onValueChange={setTradeType}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="거래 유형 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="판매" className="text-white">
                          <Badge className="bg-green-600 text-white">판매</Badge>
                        </SelectItem>
                        <SelectItem value="구매" className="text-white">
                          <Badge className="bg-blue-600 text-white">구매</Badge>
                        </SelectItem>
                        <SelectItem value="교환" className="text-white">
                          <Badge className="bg-purple-600 text-white">교환</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">카테고리 *</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="함선" className="text-white">
                          함선
                        </SelectItem>
                        <SelectItem value="모듈" className="text-white">
                          모듈
                        </SelectItem>
                        <SelectItem value="스킬북" className="text-white">
                          스킬북
                        </SelectItem>
                        <SelectItem value="블루프린트" className="text-white">
                          블루프린트
                        </SelectItem>
                        <SelectItem value="자원" className="text-white">
                          자원
                        </SelectItem>
                        <SelectItem value="기타" className="text-white">
                          기타
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">제목 *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: [판매] 라틴 급 배틀크루저 완전체"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">가격 (ISK)</label>
                    <Input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="예: 500,000,000 ISK"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">거래 위치</label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="예: 지타 4-4 스테이션"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="거래 상세 내용을 작성하세요..."
              minHeight="400px"
            />

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-6">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  거래글 작성 완료
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  거래 안내
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-orange-400 font-semibold mb-2">안전한 거래를 위해</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• 게임 내 계약 시스템 이용</li>
                    <li>• 직거래 시 신뢰할 수 있는 중개인 활용</li>
                    <li>• 사기 의심 시 즉시 신고</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-orange-400 font-semibold mb-2">작성 가이드</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• 제목에 거래 유형 명시</li>
                    <li>• 정확한 아이템명과 수량 기재</li>
                    <li>• 현재 시세 확인 후 가격 설정</li>
                    <li>• 연락 방법 명확히 기재</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

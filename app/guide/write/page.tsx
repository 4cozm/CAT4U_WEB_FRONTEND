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
import { ArrowLeft, Send, Save, BookOpen } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function GuideWritePage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState(`# 가이드 제목

## 개요
이 가이드에서 다룰 내용에 대한 간단한 소개를 작성하세요.

## 준비사항
가이드를 따라하기 전에 필요한 준비사항들을 나열하세요:
- 필요한 스킬
- 필요한 장비
- 권장 ISK

## 단계별 가이드

### 1단계: 시작하기
첫 번째 단계에 대한 상세한 설명을 작성하세요.

### 2단계: 진행하기
두 번째 단계에 대한 설명을 작성하세요.

### 3단계: 완료하기
마지막 단계에 대한 설명을 작성하세요.

## 팁과 주의사항
- 유용한 팁들을 나열하세요
- 주의해야 할 점들을 명시하세요

## 결론
가이드의 요약과 추가 학습 방향을 제시하세요.
`)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !category || !content.trim()) {
      toast({
        title: "오류",
        description: "제목, 카테고리, 내용을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "성공",
      description: "가이드가 성공적으로 작성되었습니다.",
    })

    setTimeout(() => {
      router.push("/guide")
    }, 1500)
  }

  const handleSaveDraft = () => {
    toast({
      title: "임시저장 완료",
      description: "작성 중인 내용이 임시저장되었습니다.",
    })
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
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
              <Link href="/guide">
                <ArrowLeft className="mr-2 h-4 w-4" />
                돌아가기
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              가이드 작성
            </h1>
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
                <CardTitle className="text-white">기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">제목 *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="가이드 제목을 입력하세요"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">카테고리 *</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="초보자" className="text-white">
                          초보자
                        </SelectItem>
                        <SelectItem value="PVP" className="text-white">
                          PVP
                        </SelectItem>
                        <SelectItem value="PVE" className="text-white">
                          PVE
                        </SelectItem>
                        <SelectItem value="산업" className="text-white">
                          산업
                        </SelectItem>
                        <SelectItem value="탐험" className="text-white">
                          탐험
                        </SelectItem>
                        <SelectItem value="기타" className="text-white">
                          기타
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">태그 추가</label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="태그 입력"
                        className="bg-slate-700 border-slate-600 text-white"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent"
                        disabled={tags.length >= 5}
                      >
                        추가
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-emerald-600/20 text-emerald-300 cursor-pointer hover:bg-emerald-600/30 border border-emerald-600/30"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="가이드 내용을 마크다운으로 작성하세요..."
              minHeight="500px"
            />

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-6">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  가이드 작성 완료
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">작성 가이드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-emerald-400 font-semibold mb-2">좋은 가이드 작성법</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• 단계별로 명확하게 설명</li>
                    <li>• 스크린샷이나 예시 포함</li>
                    <li>• 초보자도 이해할 수 있게 작성</li>
                    <li>• 주의사항과 팁 제공</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-semibold mb-2">마크다운 문법</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• **굵게** 또는 *기울임*</li>
                    <li>• `인라인 코드`</li>
                    <li>• # 제목 (##, ### 가능)</li>
                    <li>• &gt; 인용문</li>
                    <li>• - 목록 또는 1. 번호목록</li>
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

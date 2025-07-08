"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import ClipboardManager from "@/components/clipboard-manager"
import MarkdownEditor from "@/components/markdown-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function FittingWritePage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState(`# 피팅 제목

## 개요
피팅에 대한 간단한 설명을 작성하세요.

## 추천 피팅

### 메인 피팅
\`\`\`
[함선명, 피팅명]
하이슬롯 모듈
하이슬롯 모듈

미드슬롯 모듈
미드슬롯 모듈

로우슬롯 모듈
로우슬롯 모듈

리그 모듈
리그 모듈

드론 x5
\`\`\`

## 전술 가이드
1. **거리 조절**: 상세 설명
2. **캐패시터 관리**: 상세 설명
3. **타겟 우선순위**: 상세 설명

## 주의사항
- 중요한 주의사항들을 나열하세요
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
      description: "피팅 글이 성공적으로 작성되었습니다.",
    })

    setTimeout(() => {
      router.push("/fitting")
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
              <Link href="/fitting">
                <ArrowLeft className="mr-2 h-4 w-4" />
                돌아가기
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-white">피팅 글 작성</h1>
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
                    placeholder="피팅 글 제목을 입력하세요"
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
                        <SelectItem value="PVP" className="text-white">
                          PVP
                        </SelectItem>
                        <SelectItem value="PVE" className="text-white">
                          PVE
                        </SelectItem>
                        <SelectItem value="피팅 피드백" className="text-white">
                          피팅 피드백
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
                            className="bg-violet-600/20 text-violet-300 cursor-pointer hover:bg-violet-600/30 border border-violet-600/30"
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
              placeholder="피팅 내용을 마크다운으로 작성하세요..."
              minHeight="500px"
            />

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white shadow-lg"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    피팅 글 작성 완료
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">클립보드 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <ClipboardManager />
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">작성 가이드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-violet-400 font-semibold mb-2">피팅 작성 팁</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• 용도와 상황을 명확히 설명</li>
                    <li>• 대안 피팅도 함께 제시</li>
                    <li>• 스킬 요구사항 명시</li>
                    <li>• 예상 비용 정보 포함</li>
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

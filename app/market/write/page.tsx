"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X } from "lucide-react"

export default function MarketWritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isPreview, setIsPreview] = useState(false)

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("정적 사이트에서는 실제 저장이 불가능합니다.")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/market/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            장터 목록으로
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">판매글 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="판매할 아이템의 제목을 입력하세요"
                required
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>카테고리</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ship">함선</SelectItem>
                    <SelectItem value="module">모듈</SelectItem>
                    <SelectItem value="blueprint">블루프린트</SelectItem>
                    <SelectItem value="skill">스킬북</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">가격</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="예: 1.5B ISK"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">위치</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: Jita 4-4, Amarr Trade Hub"
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>태그 (최대 5개)</Label>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="태그 입력"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} disabled={tags.length >= 5}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">상세 설명</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={!isPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPreview(false)}
                  >
                    편집
                  </Button>
                  <Button
                    type="button"
                    variant={isPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPreview(true)}
                  >
                    미리보기
                  </Button>
                </div>
              </div>

              {!isPreview ? (
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="판매할 아이템에 대한 상세한 설명을 마크다운 형식으로 작성하세요..."
                  className="min-h-[400px]"
                  required
                />
              ) : (
                <div className="min-h-[400px] p-4 border rounded-md bg-gray-50">
                  <div className="prose max-w-none">
                    {content ? (
                      content.split("\n").map((line, index) => {
                        if (line.startsWith("# ")) {
                          return (
                            <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
                              {line.substring(2)}
                            </h1>
                          )
                        } else if (line.startsWith("## ")) {
                          return (
                            <h2 key={index} className="text-xl font-semibold mt-4 mb-3">
                              {line.substring(3)}
                            </h2>
                          )
                        } else if (line.startsWith("### ")) {
                          return (
                            <h3 key={index} className="text-lg font-medium mt-3 mb-2">
                              {line.substring(4)}
                            </h3>
                          )
                        } else if (line.startsWith("- ")) {
                          return (
                            <li key={index} className="ml-4">
                              {line.substring(2)}
                            </li>
                          )
                        } else if (line.startsWith("**") && line.endsWith("**")) {
                          return (
                            <p key={index} className="font-semibold mb-2">
                              {line.slice(2, -2)}
                            </p>
                          )
                        } else if (line.trim() === "") {
                          return <br key={index} />
                        } else {
                          return (
                            <p key={index} className="mb-2">
                              {line}
                            </p>
                          )
                        }
                      })
                    ) : (
                      <p className="text-gray-500">미리보기할 내용이 없습니다.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">판매글 작성 가이드</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 아이템의 상태와 특징을 정확히 기술하세요</p>
                <p>• 가격은 현재 시세를 반영하여 책정하세요</p>
                <p>• 거래 조건과 결제 방법을 명시하세요</p>
                <p>• 스크린샷이나 증빙 자료가 있으면 더 좋습니다</p>
                <p>• 사기 거래 방지를 위해 안전한 거래를 권장합니다</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                판매글 등록
              </Button>
              <Button type="button" variant="outline">
                임시저장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

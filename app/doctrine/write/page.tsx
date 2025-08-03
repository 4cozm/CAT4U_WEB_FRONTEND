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
import { ArrowLeft, Plus, X, Copy } from "lucide-react"

interface Clipboard {
  id: number
  title: string
  content: string
}

export default function DoctrineWritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [clipboards, setClipboards] = useState<Clipboard[]>([])
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

  const addClipboard = () => {
    if (clipboards.length < 10) {
      const newClipboard: Clipboard = {
        id: Date.now(),
        title: "",
        content: "",
      }
      setClipboards([...clipboards, newClipboard])
    }
  }

  const updateClipboard = (id: number, field: keyof Clipboard, value: string) => {
    setClipboards(clipboards.map((cb) => (cb.id === id ? { ...cb, [field]: value } : cb)))
  }

  const removeClipboard = (id: number) => {
    setClipboards(clipboards.filter((cb) => cb.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("정적 사이트에서는 실제 저장이 불가능합니다.")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/doctrine/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            독트린 목록으로
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">독트린 작성</CardTitle>
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
                placeholder="독트린 제목을 입력하세요"
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
                <Label htmlFor="content">내용</Label>
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
                  placeholder="독트린에 대한 설명을 마크다운 형식으로 작성하세요..."
                  className="min-h-[300px]"
                  required
                />
              ) : (
                <div className="min-h-[300px] p-4 border rounded-md bg-gray-50">
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

            {/* Clipboards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>클립보드 (최대 10개)</Label>
                <Button type="button" onClick={addClipboard} disabled={clipboards.length >= 10} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  클립보드 추가
                </Button>
              </div>

              {clipboards.map((clipboard, index) => (
                <Card key={clipboard.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">클립보드 {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeClipboard(clipboard.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <Input
                      placeholder="피팅 이름 (예: Hurricane Fleet Issue - 알파 피팅)"
                      value={clipboard.title}
                      onChange={(e) => updateClipboard(clipboard.id, "title", e.target.value)}
                    />

                    <div className="relative">
                      <Textarea
                        placeholder="EVE 게임 내 피팅 정보를 붙여넣으세요..."
                        value={clipboard.content}
                        onChange={(e) => updateClipboard(clipboard.id, "content", e.target.value)}
                        className="min-h-[150px] font-mono text-sm"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={() => navigator.clipboard.writeText(clipboard.content)}
                        disabled={!clipboard.content}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {clipboards.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>클립보드가 없습니다.</p>
                  <p className="text-sm">피팅 정보를 공유하려면 클립보드를 추가하세요.</p>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">독트린 작성 가이드</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 독트린의 목적과 사용 상황을 명확히 설명하세요</p>
                <p>• 함선별 역할과 피팅을 클립보드에 추가하세요</p>
                <p>• 운용 방법과 주의사항을 포함하세요</p>
                <p>• 관련 태그를 추가하여 검색이 쉽도록 하세요</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                독트린 발행
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

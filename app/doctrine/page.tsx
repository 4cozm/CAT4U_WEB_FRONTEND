"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageSquare, Eye, Plus, Search, Copy } from 'lucide-react'

const categories = [
  { id: "all", name: "전체" },
  { id: "catfood", name: "캣포유" },
  { id: "daegu", name: "대구" },
  { id: "fish", name: "물고기" },
  { id: "external", name: "외부" },
]

const doctrines = [
  {
    id: 1,
    title: "Null-Sec 생존 독트린 모음",
    content: "대규모 함대전에서 사용되는 주요 독트린들을 정리했습니다. Hurricane Fleet Issue 기반의 알파 독트린부터...",
    author: "FC_Commander",
    createdAt: "2024-01-14",
    views: 890,
    likes: 32,
    comments: 8,
    clipboards: 5,
    tags: ["Null-Sec", "함대전", "PvP"],
    category: "catfood",
  },
  {
    id: 2,
    title: "대규모 함대전 독트린 분석",
    content: "최근 대규모 전투에서 사용된 독트린들을 분석하고 각각의 장단점을 설명합니다...",
    author: "Fleet_Analyst",
    createdAt: "2024-01-13",
    views: 3890,
    likes: 134,
    comments: 45,
    clipboards: 12,
    tags: ["함대전", "분석", "전략"],
    category: "daegu",
  },
  {
    id: 3,
    title: "물고기 연합 독트린",
    content: "물고기 연합에서 사용하는 독트린들을 소개합니다...",
    author: "Fish_FC",
    createdAt: "2024-01-12",
    views: 1200,
    likes: 45,
    comments: 15,
    clipboards: 8,
    tags: ["물고기", "연합", "독트린"],
    category: "fish",
  },
  {
    id: 4,
    title: "외부 연합 독트린 정보",
    content: "외부 연합들의 독트린 정보를 분석한 자료입니다...",
    author: "Intel_Officer",
    createdAt: "2024-01-11",
    views: 2100,
    likes: 67,
    comments: 28,
    clipboards: 15,
    tags: ["외부", "정보", "분석"],
    category: "external",
  },
]

export default function DoctrinePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<1 | 2>(1)

  const filteredDoctrines = doctrines.filter((doctrine) => {
    const matchesCategory = selectedCategory === "all" || doctrine.category === selectedCategory
    const matchesSearch =
      doctrine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctrine.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">독트린</h1>
              <p className="text-gray-600">함대전과 PvP를 위한 독트린과 전략을 공유하세요</p>
            </div>
            <Link href="/doctrine/write/">
              <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                독트린 작성
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and Categories */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="독트린 검색..."
              className="pl-10 bg-white border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-200 bg-transparent hover:bg-gray-50"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-end">
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode(1)}
                className={viewMode === 1 ? "bg-blue-600 hover:bg-blue-700" : "border-gray-200 bg-transparent"}
              >
                상세 보기
              </Button>
              <Button
                variant={viewMode === 2 ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode(2)}
                className={viewMode === 2 ? "bg-blue-600 hover:bg-blue-700" : "border-gray-200 bg-transparent"}
              >
                간략 보기
              </Button>
            </div>
          </div>
        </div>

        {/* Doctrine List */}
        {viewMode === 1 ? (
          // 기존 상세 보기
          <div className="space-y-4">
            {filteredDoctrines.map((doctrine) => (
              <Card key={doctrine.id} className="card-hover bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <Link href={`/doctrine/${doctrine.id}/`}>
                        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                          {doctrine.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{doctrine.content}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctrine.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">by {doctrine.author}</span>
                        <span>{doctrine.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {doctrine.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {doctrine.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {doctrine.comments}
                        </span>
                        <span className="flex items-center text-blue-600">
                          <Copy className="w-4 h-4 mr-1" />
                          {doctrine.clipboards}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // 새로운 간략 보기
          <div className="space-y-2">
            {filteredDoctrines.map((doctrine) => (
              <Card key={doctrine.id} className="card-hover bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link href={`/doctrine/${doctrine.id}/`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors mb-1">
                          {doctrine.title}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by {doctrine.author}</span>
                        <span>{doctrine.createdAt}</span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {doctrine.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {doctrine.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {doctrine.comments}
                          </span>
                          <span className="flex items-center text-blue-600">
                            <Copy className="w-3 h-3 mr-1" />
                            {doctrine.clipboards}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-4">
                      {doctrine.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredDoctrines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredDoctrines.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button variant="outline" disabled className="border-gray-200 bg-transparent">
                이전
              </Button>
              <Button variant="outline" className="bg-blue-600 text-white border-blue-600">
                1
              </Button>
              <Button variant="outline" className="border-gray-200 bg-transparent">
                2
              </Button>
              <Button variant="outline" className="border-gray-200 bg-transparent">
                3
              </Button>
              <Button variant="outline" className="border-gray-200 bg-transparent">
                다음
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

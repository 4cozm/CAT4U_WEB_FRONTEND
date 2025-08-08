"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageSquare, Eye, Plus, Search, Copy } from 'lucide-react'

const fittings = [
  {
    id: 1,
    title: "PvP 프리깃 피팅 추천",
    content: "솔로 PvP에 적합한 프리깃 피팅들을 소개합니다. Rifter, Merlin, Tormentor 등의 T1 프리깃부터...",
    author: "PvP_Master",
    createdAt: "2024-01-13",
    views: 2100,
    likes: 78,
    comments: 25,
    clipboards: 8,
    tags: ["PvP", "프리깃", "솔로"],
  },
  {
    id: 2,
    title: "미션용 배틀쉽 피팅 모음",
    content: "Level 4 미션을 효율적으로 수행할 수 있는 배틀쉽 피팅들입니다...",
    author: "Mission_Runner",
    createdAt: "2024-01-12",
    views: 1560,
    likes: 45,
    comments: 18,
    clipboards: 6,
    tags: ["미션", "배틀쉽", "PvE"],
  },
]

export default function FittingPage() {
  const [viewMode, setViewMode] = useState<1 | 2>(1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">피팅</h1>
          <p className="text-gray-600">다양한 상황에 맞는 함선 피팅을 공유하세요</p>
        </div>
        <Link href="/fitting/write/">
          <Button className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            피팅 공유
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="피팅 검색..." className="pl-10" />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex justify-end">
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

      {/* Fitting List */}
      {viewMode === 1 ? (
        // 기존 상세 보기
        <div className="space-y-6">
          {fittings.map((fitting) => (
            <Card key={fitting.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <Link href={`/fitting/${fitting.id}/`}>
                      <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                        {fitting.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-3 line-clamp-2">{fitting.content}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {fitting.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>by {fitting.author}</span>
                      <span>{fitting.createdAt}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {fitting.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {fitting.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {fitting.comments}
                      </span>
                      <span className="flex items-center text-blue-600">
                        <Copy className="w-4 h-4 mr-1" />
                        {fitting.clipboards}
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
          {fittings.map((fitting) => (
            <Card key={fitting.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Link href={`/fitting/${fitting.id}/`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors mb-1">
                        {fitting.title}
                      </h3>
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>by {fitting.author}</span>
                      <span>{fitting.createdAt}</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {fitting.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {fitting.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {fitting.comments}
                        </span>
                        <span className="flex items-center text-blue-600">
                          <Copy className="w-3 h-3 mr-1" />
                          {fitting.clipboards}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 ml-4">
                    {fitting.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
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
    </div>
  )
}

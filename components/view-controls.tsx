"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid3X3, List, Search } from "lucide-react"

interface ViewControlsProps {
  viewMode: "card" | "list"
  onViewModeChange: (mode: "card" | "list") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
}

export default function ViewControls({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  placeholder = "검색어를 입력하세요...",
}: ViewControlsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* 검색 */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="bg-slate-700 border-slate-600 text-white pl-10"
        />
      </div>

      {/* 뷰 모드 전환 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">보기:</span>
        <div className="flex rounded-md border border-slate-600 overflow-hidden">
          <Button
            variant={viewMode === "card" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("card")}
            className={`rounded-none ${
              viewMode === "card"
                ? "bg-blue-600 hover:bg-blue-700"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">카드</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={`rounded-none ${
              viewMode === "list"
                ? "bg-blue-600 hover:bg-blue-700"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <List className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">리스트</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

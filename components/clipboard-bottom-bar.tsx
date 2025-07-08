"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClipboardItem {
  id: number
  title: string
  content: string
  timestamp: number
}

interface ClipboardBottomBarProps {
  onAddItem?: (title: string, content: string) => void
}

export default function ClipboardBottomBar({ onAddItem }: ClipboardBottomBarProps) {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const { toast } = useToast()

  // 로컬 스토리지에서 클립보드 아이템 로드
  useEffect(() => {
    const savedItems = localStorage.getItem("eve-clipboard-items")
    if (savedItems) {
      try {
        setClipboardItems(JSON.parse(savedItems))
      } catch (error) {
        console.error("Failed to load clipboard items:", error)
      }
    }
  }, [])

  // 클립보드 아이템 저장
  const saveToStorage = (items: ClipboardItem[]) => {
    localStorage.setItem("eve-clipboard-items", JSON.stringify(items))
  }

  // 외부에서 아이템 추가할 때 사용
  useEffect(() => {
    if (onAddItem) {
      // 전역 함수로 등록
      ;(window as any).addToClipboard = (title: string, content: string) => {
        addClipboardItem(title, content)
      }
    }
  }, [onAddItem])

  const addClipboardItem = (title: string, content: string) => {
    if (clipboardItems.length >= 10) {
      toast({
        title: "클립보드 가득참",
        description: "클립보드는 최대 10개까지만 저장할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    const newItem: ClipboardItem = {
      id: Date.now(),
      title,
      content,
      timestamp: Date.now(),
    }

    const updatedItems = [newItem, ...clipboardItems].slice(0, 10)
    setClipboardItems(updatedItems)
    saveToStorage(updatedItems)

    toast({
      title: "클립보드에 추가됨",
      description: `"${title}"이 클립보드에 저장되었습니다.`,
    })
  }

  const copyToClipboard = async (item: ClipboardItem) => {
    try {
      await navigator.clipboard.writeText(item.content)
      toast({
        title: "복사 완료",
        description: `"${item.title}"이 클립보드에 복사되었습니다.`,
      })
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const removeItem = (id: number) => {
    const updatedItems = clipboardItems.filter((item) => item.id !== id)
    setClipboardItems(updatedItems)
    saveToStorage(updatedItems)
    toast({
      title: "삭제 완료",
      description: "클립보드에서 제거되었습니다.",
    })
  }

  const clearAll = () => {
    setClipboardItems([])
    saveToStorage([])
    toast({
      title: "전체 삭제",
      description: "모든 클립보드가 삭제되었습니다.",
    })
  }

  if (clipboardItems.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-700">
      <div className="container mx-auto px-4">
        <div className="py-3">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                <span className="ml-2">클립보드 ({clipboardItems.length}/10)</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent"
              >
                전체 삭제
              </Button>
            </div>
          </div>

          {/* 클립보드 아이템들 */}
          {isExpanded && (
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-h-60 overflow-y-auto">
              {clipboardItems.map((item) => (
                <Card key={item.id} className="border-slate-700 bg-slate-800/80">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-white truncate flex-1">{item.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.content.substring(0, 100)}...</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(item)}
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent"
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      복사
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 축소된 상태에서 버튼들 */}
          {!isExpanded && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {clipboardItems.slice(0, 8).map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(item)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent whitespace-nowrap flex-shrink-0"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  {item.title}
                </Button>
              ))}
              {clipboardItems.length > 8 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 whitespace-nowrap flex-shrink-0"
                >
                  +{clipboardItems.length - 8}개 더
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

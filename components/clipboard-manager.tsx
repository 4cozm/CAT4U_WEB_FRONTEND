"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClipboardItem {
  id: number
  title: string
  content: string
}

export default function ClipboardManager() {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [copiedItems, setCopiedItems] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  const addClipboardItem = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (clipboardItems.length >= 10) {
      toast({
        title: "제한 초과",
        description: "클립보드는 최대 10개까지만 추가할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    const newItem: ClipboardItem = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
    }

    setClipboardItems([...clipboardItems, newItem])
    setNewTitle("")
    setNewContent("")
    setIsDialogOpen(false)

    toast({
      title: "성공",
      description: "클립보드가 추가되었습니다.",
    })
  }

  const copyToClipboard = async (content: string, title: string, id: number) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedItems((prev) => new Set([...prev, id]))

      toast({
        title: "복사 완료",
        description: `"${title}" 내용이 클립보드에 복사되었습니다.`,
      })

      // 3초 후 복사 상태 초기화
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }, 3000)
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const removeClipboardItem = (id: number) => {
    setClipboardItems(clipboardItems.filter((item) => item.id !== id))
    toast({
      title: "삭제 완료",
      description: "클립보드가 삭제되었습니다.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={clipboardItems.length >= 10}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent"
            >
              <Plus className="mr-2 h-4 w-4" />
              추가 ({clipboardItems.length}/10)
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">새 클립보드 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">제목</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="클립보드 제목을 입력하세요"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">내용</label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="복사할 내용을 입력하세요"
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button onClick={addClipboardItem} className="w-full bg-slate-600 hover:bg-slate-700 text-white">
                추가
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {clipboardItems.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-1">
          {clipboardItems.map((item) => (
            <Card
              key={item.id}
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all cursor-pointer group"
              onClick={() => copyToClipboard(item.content, item.title, item.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <span className="truncate flex items-center gap-2">
                    {copiedItems.has(item.id) && <Check className="h-3 w-3 text-green-400" />}
                    {item.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeClipboardItem(item.id)
                    }}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-slate-400 line-clamp-2">{item.content}</p>
                <p className="text-xs text-slate-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  클릭하여 복사
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {clipboardItems.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">저장된 클립보드가 없습니다.</p>
          <p className="text-xs mt-1">자주 사용하는 피팅이나 텍스트를 저장해보세요.</p>
        </div>
      )}
    </div>
  )
}

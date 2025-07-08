"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bold, Italic, Code, Link2, List, ListOrdered, Quote, ImageIcon } from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  minHeight = "400px",
}: MarkdownEditorProps) {
  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector("textarea[data-markdown-editor]") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const toolbarButtons = [
    { icon: Bold, label: "굵게", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "기울임", action: () => insertMarkdown("*", "*") },
    { icon: Code, label: "인라인 코드", action: () => insertMarkdown("`", "`") },
    { icon: Link2, label: "링크", action: () => insertMarkdown("[", "](url)") },
    { icon: List, label: "목록", action: () => insertMarkdown("- ") },
    { icon: ListOrdered, label: "번호 목록", action: () => insertMarkdown("1. ") },
    { icon: Quote, label: "인용", action: () => insertMarkdown("> ") },
    { icon: ImageIcon, label: "이미지", action: () => insertMarkdown("![alt](", ")") },
  ]

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">내용 작성</CardTitle>
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                title={button.label}
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          data-markdown-editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-slate-700 border-slate-600 text-white resize-none placeholder:text-slate-400"
          style={{ minHeight }}
        />
      </CardContent>
    </Card>
  )
}

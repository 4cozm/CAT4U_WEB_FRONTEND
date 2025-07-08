"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface PostContentRendererProps {
  content: string
  showFittingCopy?: boolean
}

export default function PostContentRenderer({ content, showFittingCopy = false }: PostContentRendererProps) {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  const copyToClipboard = async (text: string, blockIndex: number, title?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedBlocks((prev) => new Set([...prev, blockIndex]))

      // 클립보드에 저장
      if (showFittingCopy && title && (window as any).addToClipboard) {
        ;(window as any).addToClipboard(title, text)
      }

      toast({
        title: "복사 완료!",
        description: showFittingCopy ? "피팅이 클립보드에 저장되었습니다." : "내용이 복사되었습니다.",
      })

      // 3초 후 복사 상태 초기화
      setTimeout(() => {
        setCopiedBlocks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(blockIndex)
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

  const renderContent = (text: string) => {
    const lines = text.split("\n")
    const result = []
    let currentCodeBlock = []
    let inCodeBlock = false
    let codeBlockIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // 코드 블록 종료
          const codeContent = currentCodeBlock.join("\n")
          const isFitting = codeContent.includes("[") && codeContent.includes(",")

          // 피팅 제목 추출
          const fittingMatch = codeContent.match(/\[(.*?),\s*(.*?)\]/)
          const fittingTitle = fittingMatch ? `${fittingMatch[1]} - ${fittingMatch[2]}` : `피팅 ${codeBlockIndex + 1}`

          result.push(
            <Card key={`code-${codeBlockIndex}`} className="border-slate-600 bg-slate-800/50 my-4">
              <CardContent className="p-0">
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-200 p-4 rounded-t-lg overflow-x-auto text-sm">
                    <code>{codeContent}</code>
                  </pre>
                  {showFittingCopy && isFitting && (
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(codeContent, codeBlockIndex, fittingTitle)}
                        className="border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                      >
                        {copiedBlocks.has(codeBlockIndex) ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            저장됨
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3 w-3" />
                            피팅 저장
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>,
          )
          currentCodeBlock = []
          inCodeBlock = false
          codeBlockIndex++
        } else {
          // 코드 블록 시작
          inCodeBlock = true
        }
        continue
      }

      if (inCodeBlock) {
        currentCodeBlock.push(line)
        continue
      }

      // 일반 텍스트 처리
      let processedLine = line

      // 헤더 처리
      if (line.startsWith("### ")) {
        result.push(
          <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-3">
            {line.substring(4)}
          </h3>,
        )
        continue
      } else if (line.startsWith("## ")) {
        result.push(
          <h2 key={i} className="text-xl font-semibold text-white mt-8 mb-4">
            {line.substring(3)}
          </h2>,
        )
        continue
      } else if (line.startsWith("# ")) {
        result.push(
          <h1 key={i} className="text-2xl font-bold text-white mt-10 mb-5">
            {line.substring(2)}
          </h1>,
        )
        continue
      }

      // 인용문 처리
      if (line.startsWith("> ")) {
        result.push(
          <blockquote
            key={i}
            className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-slate-800/30 italic text-slate-300"
          >
            {line.substring(2)}
          </blockquote>,
        )
        continue
      }

      // 리스트 처리
      if (line.startsWith("- ") || line.match(/^\d+\. /)) {
        const listContent = line.startsWith("- ") ? line.substring(2) : line.replace(/^\d+\. /, "")
        result.push(
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-blue-400 mt-1">•</span>
            <span className="text-slate-200">{listContent}</span>
          </div>,
        )
        continue
      }

      // 빈 줄 처리
      if (line.trim() === "") {
        result.push(<div key={i} className="h-4" />)
        continue
      }

      // 인라인 마크다운 처리
      processedLine = processedLine
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-slate-700 px-2 py-1 rounded text-sm text-blue-300">$1</code>')

      result.push(
        <p
          key={i}
          className="text-slate-200 leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />,
      )
    }

    return result
  }

  return <div className="prose prose-invert max-w-none">{renderContent(content)}</div>
}

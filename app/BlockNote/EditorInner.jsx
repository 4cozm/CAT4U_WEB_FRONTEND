// app/BlockNote/EditorInner.jsx
"use client";
import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

import { SlashMenu } from "./slashMenu";

export default function EditorInner() {
  // 1) URL에서 카테고리/경로 추출 → 초안 키 만들기
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const category = (searchParams.get("category") || "general").toLowerCase();
  const DRAFT_KEY = React.useMemo(() => `draft:blocknote:${pathname}:${category}`, [pathname, category]);

  // 2) 초기 로드 시 해당 키의 초안 불러오기
  const initialContent = React.useMemo(() => {
    if (typeof window === "undefined") return undefined;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  }, [DRAFT_KEY]);

  // 3) 에디터 생성 (한글 사전 + 초기 초안)
  const editor = useCreateBlockNote({
    dictionary: ko,
    initialContent,
  });

  // 4) 변경사항을 디바운스로 해당 키에 저장
  React.useEffect(() => {
    let t;
    const unsub = editor.onChange(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(editor.topLevelBlocks));
        } catch {}
      }, 800); // 0.8s 디바운스
    });
    return () => {
      clearTimeout(t);
      unsub();
    };
  }, [editor, DRAFT_KEY]);

  return (
    <BlockNoteView editor={editor} slashMenu={false}>
      <SlashMenu />
    </BlockNoteView>
  );
}

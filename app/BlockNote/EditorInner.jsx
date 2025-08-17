"use client";
import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

import { SlashMenu } from "./slashMenu";

export default function EditorInner({ serverContent, serverUpdatedAt }) {
  // URL에서 컨텍스트 추출
  const sp = useSearchParams();
  const pathname = usePathname();
  const category = (sp.get("category") || "general").toLowerCase();
  const mode = (sp.get("mode") || "create").toLowerCase(); // create | edit
  const docId = sp.get("id") || null;

  // 초안 키
  const DRAFT_KEY = React.useMemo(() => {
    const idOrCategory = mode === "edit" ? docId || "unknown" : category;
    return `draft:blocknote:${mode}:${idOrCategory}:${pathname}`;
  }, [mode, docId, category, pathname]);

  // 로컬 초안 로드
  const draft = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null; // { blocks, updatedAt }
    } catch {
      return null;
    }
  }, [DRAFT_KEY]);

  // 충돌 해결: 로컬이 더 최신이면 복구 여부 질문
  const initial = React.useMemo(() => {
    if (!draft?.blocks) return serverContent;
    if (!serverUpdatedAt || draft.updatedAt > serverUpdatedAt) {
      const useLocal = confirm("이전 로컬 초안이 있습니다. 로컬 초안을 복구할까요?");
      return useLocal ? draft.blocks : serverContent;
    }
    return serverContent;
  }, [draft, serverContent, serverUpdatedAt]);

  const editor = useCreateBlockNote({
    dictionary: ko,
    initialContent: initial, // blocks 배열 or undefined
  });

  // 변경사항 디바운스 저장
  React.useEffect(() => {
    let t;
    const unsub = editor.onChange(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ blocks: editor.topLevelBlocks, updatedAt: Date.now() }));
        } catch {}
      }, 800);
    });
    return () => {
      clearTimeout(t);
      unsub();
    };
  }, [editor, DRAFT_KEY]);

  // 외부에서 “저장 성공”시 플러시하고 싶을 때를 위한 이벤트 훅(선택)
  React.useEffect(() => {
    const h = (e) => {
      if (e?.detail?.key === DRAFT_KEY) localStorage.removeItem(DRAFT_KEY);
    };
    window.addEventListener("draft:clear", h);
    return () => window.removeEventListener("draft:clear", h);
  }, [DRAFT_KEY]);

  return (
    <BlockNoteView editor={editor} slashMenu={false}>
      <SlashMenu />
    </BlockNoteView>
  );
}

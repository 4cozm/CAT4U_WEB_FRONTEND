"use client";

import React, { useRef } from "react";
import BlockNoteRestore from "../../components/BlockNoteRestore.jsx";
import BlockNoteTempSave from "../../components/BlockNoteTempSave.jsx";
import EditorHost from "./EditorHost";
import { fetchWithAuth } from '@/utils/fetchWithAuth.js'
import { useToast } from "@/hooks/useToast";
import * as yup from "yup";

/* DisablePageScroll
  - BlockNotePage 활성화 시, 브라우저 전체 스크롤을 막아줌
  - `overflow: hidden`을 html/body에 강제로 적용
   - 언마운트 시 기존 상태 복원 */
function DisablePageScroll() {
  React.useEffect(() => {
    const htmlPrev = document.documentElement.style.overflow;
    const bodyPrev = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = htmlPrev;
      document.body.style.overflow = bodyPrev;
    };
  }, []);
  return null;
}

const schema = yup.object({
  board_title: yup
    .string()
    .transform((v) => (v ?? "").trim())
    .required("제목을 입력해주세요."),
  board_content: yup
    .string()
    .transform((v) => (v ?? "").trim())
    .required("내용을 입력해주세요."),
});

export default function PageClient() {
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const { pushToast } = useToast();

  const handleSave = async () => {
    console.log("click save");
    // 1) 입력값 수집
    const board_title = (titleRef.current?.value ?? "").trim();
    const board_content = JSON.stringify(editorRef.current?.getJSON?.() ?? {});

    console.log(`제목 : ${board_title}, 내용 : ${board_content}`);
    const payload = {
      board_title,
      board_content,
    };

    try {
      const data = await fetchWithAuth("/api/guide/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      pushToast({ type: "success", message: `글 ${data.board_title} 생성에 성공하였습니다` });
      window.location.href = '/guide';
    } catch (err) {
      if (err?.status && [400, 500].includes(err.status)) {
        pushToast({ type: "error", message: "서버 통신에 문제가 발생하였습니다." });
      } else {
        pushToast({ type: "error", message: "알 수 없는 오류가 발생했습니다." });
      }
    }
  }

  return (
    <main className="mx-auto flex h-screen max-w-3xl flex-col px-4 pt-4 overflow-hidden">
      <DisablePageScroll />

      {/* 헤더: 제목 + 버튼 영역 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">새 글 작성</h1>
        <div className="flex gap-2">
          {/* 임시 저장 */}
          <BlockNoteTempSave content={() => editorRef.current?.getJSON?.()} />

          {/* 임시 저장 복원 (useSearchParams 사용) */}
          <BlockNoteRestore
            onRestore={(doc) => {
              const api = editorRef.current;
              if (!api) return;
              api.setJSON(doc);
            }}
          />

          {/* 저장 버튼 */}
          <button
            className="px-4 py-2 rounded-lg bg-blue-500/80 text-white hover:bg-blue-400 transition"
            type="button"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>

      {/* 제목 입력 필드 */}
      <input
        ref={titleRef}
        type="text"
        placeholder="글 제목을 입력하세요"
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
      />

      {/* 에디터 카드 */}
      <div className="h-[60vh] rounded-2xl bg-black/40 shadow-[0_8px_30px_rgb(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur overflow-visible">
        <EditorHost ref={editorRef} />
      </div>
    </main>
  );
}

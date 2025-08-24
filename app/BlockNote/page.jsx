"use client";
import React, { useRef } from "react";
import BlockNoteTempSave from "../../components/BlockNoteTempSave.jsx";
import EditorHost from "./EditorHost";

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

/* BlockNotePage
   - 새 글 작성 페이지 전체 레이아웃
   - 상단: 제목 + 버튼
   - 중단: 제목 입력 필드
   - 하단: BlockNote Editor 영역 (고정 높이 카드) */
export default function BlockNotePage() {
  const editorRef = useRef(null);

  return (
    <main className="mx-auto flex h-screen max-w-3xl flex-col px-4 pt-4 overflow-hidden">
      {/* 전역 스크롤 비활성화 */}
      <DisablePageScroll />

      {/* 헤더: 제목 + 버튼 영역 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">새 글 작성</h1>
        <div className="flex gap-2">
          {/*임시 저장 버튼 */}
          <BlockNoteTempSave content={() => editorRef.current?.getJSON?.()} />

          {/* 저장 버튼 */}
          <button className="px-4 py-2 rounded-lg bg-blue-500/80 text-white hover:bg-blue-400 transition" type="button">
            저장
          </button>
        </div>
      </div>

      {/* 제목 입력 필드 */}
      <input
        type="text"
        placeholder="글 제목을 입력하세요"
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
      />

      {/* 에디터 카드
          - 고정 높이(60vh)
          - 배경 반투명 + 블러 + 그림자
          - 외부 스크롤 없음, 내부 에디터만 스크롤 */}
      <div className="h-[60vh] rounded-2xl bg-black/40 shadow-[0_8px_30px_rgb(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur overflow-visible">
        <EditorHost ref={editorRef} />
      </div>
    </main>
  );
}

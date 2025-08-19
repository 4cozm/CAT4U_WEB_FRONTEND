"use client";
import React from "react";
import EditorHost from "./EditorHost";

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

export default function BlockNotePage() {
  return (
    <main className="mx-auto flex h-screen max-w-3xl flex-col px-4 pt-4 overflow-hidden">
      <DisablePageScroll />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">새 글 작성</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20 transition" type="button">
            임시저장
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-500/80 text-white hover:bg-blue-400 transition" type="button">
            저장
          </button>
        </div>
      </div>

      {/* 제목 */}
      <input
        type="text"
        placeholder="글 제목을 입력하세요"
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
      />

      {/* 에디터 카드: 남은 공간을 모두 차지 (바깥 스크롤 없음) */}
      <div className="h-[60vh] rounded-2xl bg-black/40 shadow-[0_8px_30px_rgb(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur overflow-hidden">
        <EditorHost />
      </div>
    </main>
  );
}

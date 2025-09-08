"use client";

import { formatKoreanTime } from "@/utils/date";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function BlockNoteRestore({ onRestore }) {
  const searchParams = useSearchParams();
  const page = searchParams.get("category") || "default";
  const key = `draft:${page}`;

  const [draft, setDraft] = React.useState(null);

  // 첫 렌더 시 localStorage에 초안 있는지 확인
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.content) setDraft(parsed);
    } catch {}
  }, [key]);

  if (!draft) return null; // 초안 없으면 버튼 자체를 숨김

  const handleRestore = () => {
    const when = draft.savedAt ? formatKoreanTime(draft.savedAt) : "알 수 없음";
    const ok = window.confirm(`임시저장이 있습니다.\n저장 시각: ${when}\n\n불러오시겠어요?`);
    if (!ok) return;

    // 부모에 content 전달(문서 JSON 등)
    onRestore?.(draft.content);
  };

  return (
    <button
      onClick={handleRestore}
      className="px-4 py-2 rounded-lg bg-emerald-500/80 text-white hover:bg-emerald-400 transition"
      type="button"
    >
      임시저장 불러오기
    </button>
  );
}

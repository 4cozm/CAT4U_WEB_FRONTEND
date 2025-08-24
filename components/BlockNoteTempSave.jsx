"use client";
import { useSearchParams } from "next/navigation";

export default function BlockNoteTempSave({ content }) {
  const searchParams = useSearchParams();
  const page = searchParams.get("category") || "default";

  const resolveContent = () => (typeof content === "function" ? content() : content);
  
  const isEmpty = (v) => {
    if (v == null) return true; // null/undefined
    if (typeof v === "string") return v.trim() === ""; // 빈 문자열
    // 객체/배열 등은 상황에 따라 달라질 수 있으니 최소 기준만
    return false;
  };

  const formatKoreanTime = (ts) =>
    new Date(ts).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleClick = () => {
    try {
      const key = `draft:${page}`;
      const value = resolveContent();

      // 1) 내용 비었으면 중단
      if (isEmpty(value)) {
        alert("저장할 내용이 없습니다.");
        return;
      }

      // 2) 기존 초안 확인
      const prevRaw = localStorage.getItem(key);
      if (prevRaw) {
        try {
          const prev = JSON.parse(prevRaw);
          const when = prev?.savedAt ? formatKoreanTime(prev.savedAt) : "알 수 없음";
          const ok = window.confirm(`기존 임시저장이 있습니다.\n저장 시각: ${when}\n\n덮어쓰시겠어요?`);
          if (!ok) return;
        } catch {
          // 파싱 실패면 조용히 진행(덮어쓰기)
        }
      }

      // 3) 저장
      localStorage.setItem(
        key,
        JSON.stringify({
          savedAt: Date.now(),
          content: value,
        })
      );
      alert(`임시저장 완료 (${key})`);
    } catch (e) {
      console.error("임시저장 실패:", e);
      alert("임시저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20 transition"
      type="button"
    >
      임시저장
    </button>
  );
}

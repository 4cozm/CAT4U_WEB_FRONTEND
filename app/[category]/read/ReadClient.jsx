"use client";

import NeumorphicButton from "@/components/NeumorphicButton";
import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { blockNoteSchema } from "../../../utils/blocknoteEmoji/schema.js";

const FALLBACK_BLOCKS = [{ type: "paragraph", content: [] }];

function fmtKST(dateLike) {
  if (!dateLike) return "-";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(d);
}

function ReadOnlyEditor({ blocks }) {
  const editor = useCreateBlockNote({
    schema: blockNoteSchema,
    initialContent: blocks,
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      sideMenu={false}
      slashMenu={false}
      formattingToolbar={false}
      linkToolbar={false}
      filePanel={false}
      tableHandles={false}
      emojiPicker={false}
    />
  );
}

export default function ReadClient({ category }) {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [error, setError] = useState("");
  const [data, setData] = useState(null); // 로딩 전 null, 로딩 후 object
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isInvalid = !id;
  const isLoading = !isInvalid && data === null;

  const title = data?.board_title ?? "";
  const nickname = data?.nickname ?? data?.user?.nickname ?? "";
  const recommendCnt = data?.recommend_cnt ?? 0;
  const owner = !!data?.owner;

  const createdAt = fmtKST(data?.create_dt);
  const updatedAt = fmtKST(data?.updated_dt);
  const lastEditor = data?.last_editor_name ?? "";

  const blocks = useMemo(() => {
    const raw = data?.board_content;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    // 백엔드가 문자열(JSON string)로 줄 때도 대비
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (err) {
        console.error(err);
      }
    }
    return FALLBACK_BLOCKS;
  }, [data]);

  const editorMountKey = useMemo(() => {
    return `${category}:${id || "no-id"}:${isLoading ? "loading" : "ready"}`;
  }, [category, id, isLoading]);

  useEffect(() => {
    if (!id) return;

    let alive = true;
    setError("");
    setData(null);

    fetchWithAuth(`/api/board/detail?category=${encodeURIComponent(category)}&id=${encodeURIComponent(id)}`, {
      method: "GET",
    })
      .then((resp) => {
        if (!alive) return;
        const payload = resp?.data ?? resp;
        // 백엔드가 { success:true, data: {...}} 형태면 여기서 한 번 더
        const board = payload?.data ?? payload;
        setData(board);
      })
      .catch((e) => {
        if (!alive) return;
        setError(String(e?.message || e));
      });

    return () => {
      alive = false;
    };
  }, [category, id]);

  // 핸들러는 UI만. 실제 API는 별도 검증한다고 했으니 여기서는 틀만 둠.
  const handleDelete = () => {
    // TODO: 실제 삭제 API 호출
    // confirm UI는 나중에 넣어도 됨
    alert("삭제는 아직 연결 안 됨");
  };

  const handleRecommend = () => {
    // TODO: 실제 추천 API 호출
    alert("추천은 아직 연결 안 됨");
  };

  if (isInvalid) {
    return <main className="mx-auto max-w-3xl px-4 py-8 text-white/70">잘못된 접근</main>;
  }

  if (error) {
    return <main className="mx-auto max-w-3xl px-4 py-8 text-white/70">불러오기 실패: {error}</main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* 상단 헤더 */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-white">
              {isLoading ? "불러오는 중..." : title || "제목 없음"}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
              <span>
                작성자: <span className="text-white/90">{isLoading ? "-" : nickname || "-"}</span>
              </span>
              <span>
                작성일: <span className="text-white/90">{isLoading ? "-" : createdAt}</span>
              </span>
              <span>
                추천: <span className="text-white/90">{isLoading ? "-" : recommendCnt}</span>
              </span>
              <span>
                수정일: <span className="text-white/90">{isLoading ? "-" : updatedAt}</span>
              </span>
              {!!lastEditor && !isLoading && (
                <span>
                  마지막 수정자: <span className="text-white/90">{lastEditor}</span>
                </span>
              )}
            </div>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="flex shrink-0 items-center gap-2">
            {owner ? (
              <>
                <NeumorphicButton
                  label="수정"
                  href={`/${encodeURIComponent(category)}/write?edit=1&id=${encodeURIComponent(id)}`}
                  variant="secondary"
                />
                <NeumorphicButton label="삭제" onClick={handleDelete} variant="accent" />
              </>
            ) : (
              <NeumorphicButton label="추천" onClick={handleRecommend} variant="primary" />
            )}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="rounded-2xl bg-white/5 p-4">
        {mounted ? (
          <ReadOnlyEditor key={editorMountKey} blocks={blocks} />
        ) : (
          <div className="text-white/60">에디터 로딩 중...</div>
        )}
      </div>
    </main>
  );
}

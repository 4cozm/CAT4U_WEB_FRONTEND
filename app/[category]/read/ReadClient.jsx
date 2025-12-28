"use client";
import { EDITOR_SHELL } from "@/style/uiClasses.js";
import { useAuth } from "@/components/AuthProvider";
import NeumorphicButton from "@/components/NeumorphicButton";
import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useRouter, useSearchParams } from "next/navigation";
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

  const { isAdmin } = useAuth();

  const [error, setError] = useState("");
  const [data, setData] = useState(null); // 로딩 전 null, 로딩 후 object
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setMounted(true), []);

  const isInvalid = !id;
  const isLoading = !isInvalid && data === null;

  const title = data?.board_title ?? "";
  const nickname = data?.nickname ?? data?.user?.nickname ?? "";
  const recommendCnt = data?.recommend_cnt ?? 0;

  // 백엔드가 내려주는 owner 플래그 기반
  const owner = !!data?.owner;

  // 수정/삭제 노출 조건: 작성자(owner) 또는 어드민
  const canEdit = owner || !!isAdmin;

  const createdAt = fmtKST(data?.create_dt);
  const updatedAt = fmtKST(data?.updated_dt);
  const lastEditor = data?.last_editor_name ?? "";

  const blocks = useMemo(() => {
    const raw = data?.board_content;
    if (Array.isArray(raw) && raw.length > 0) return raw;
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

  const handleDelete = async () => {
    if (!id) return;

    const ok = window.confirm("정말 삭제할까?");
    if (!ok) return;

    try {
      setDeleting(true);
      setError("");

      const resp = await fetchWithAuth(`/api/board/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const payload = resp?.data ?? resp;
      const message = payload?.message ?? payload?.data?.message ?? "삭제 완료";

      alert(message);

      router.push(`/${encodeURIComponent(category)}`);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setDeleting(false);
    }
  };

  const handleRecommend = () => {
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

          <div className="flex shrink-0 items-center gap-2">
            {/* 추천 버튼은 항상 노출 */}
            <NeumorphicButton label="추천" onClick={handleRecommend} variant="primary" />

            {/* 수정/삭제는 owner 또는 admin만 */}
            {canEdit && (
              <>
                <NeumorphicButton
                  label="수정"
                  href={`/${encodeURIComponent(category)}/write?edit=1&id=${encodeURIComponent(id)}`}
                  variant="secondary"
                />
                <NeumorphicButton
                  label={deleting ? "삭제 중..." : "삭제"}
                  onClick={handleDelete}
                  variant="accent"
                  disabled={deleting}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`${EDITOR_SHELL} p-4`}>
        {mounted ? (
          <ReadOnlyEditor key={editorMountKey} blocks={blocks} />
        ) : (
          <div className="text-white/60">에디터 로딩 중...</div>
        )}
      </div>
    </main>
  );
}

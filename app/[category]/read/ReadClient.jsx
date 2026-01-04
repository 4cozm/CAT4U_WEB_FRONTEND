"use client";
import { useAuth } from "@/components/AuthProvider";
import NeumorphicButton from "@/components/NeumorphicButton";
import { useToast } from "@/hooks/useToast";
import { EDITOR_SHELL } from "@/style/uiClasses.js";
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
  const [liking, setLiking] = useState(false);

  useEffect(() => setMounted(true), []);
  const { pushToast } = useToast();
  const isInvalid = !id;
  const isLoading = !isInvalid && data === null;

  const title = data?.board_title ?? "";
  const nickname = data?.nickname ?? data?.user?.nickname ?? "";
  const recommendCnt = data?.recommend_cnt ?? 0;
  const like = !!data?.like;

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

  const handleRecommend = async () => {
    if (!id || liking) return;

    try {
      setLiking(true);
      setError("");

      const resp = await fetchWithAuth(`/api/board/${encodeURIComponent(id)}/like`, {
        method: "POST",
      });

      const payload = resp?.data ?? resp;
      const likeNext = !!payload?.like;
      pushToast({ type: "success", message: payload.message || "처리 완료" });
      setData((prev) => {
        if (!prev) return prev;

        const prevLike = !!prev.like;
        const prevCnt = Number(prev.recommend_cnt ?? 0);

        const nextCnt = likeNext === prevLike ? prevCnt : likeNext ? prevCnt + 1 : Math.max(0, prevCnt - 1);

        return { ...prev, like: likeNext, recommend_cnt: nextCnt };
      });
    } catch (e) {
      const msg = String(e?.message || e);
      setError(msg);
      pushToast(`추천 처리 실패: ${msg}`);
    } finally {
      setLiking(false);
    }
  };

  if (isInvalid) {
    return <main className="mx-auto flex w-full max-w-6xl flex-col pt-4 text-white/70">잘못된 접근</main>;
  }

  if (error) {
    return <main className="mx-auto flex w-full max-w-6xl flex-col pt-4 text-white/70">불러오기 실패: {error}</main>;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col pt-4">
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        {/* 모바일: 세로(stack) / sm 이상: 가로(row) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            {/* 모바일: 줄바꿈 허용(제목 안 가리게) / sm 이상: 한 줄 + truncate */}
            <h1
              className="
                font-bold text-white
                whitespace-normal break-words
                [font-size:clamp(1.05rem,3.8vw,1.6rem)]
                leading-snug
              "
            >
              {isLoading ? "불러오는 중..." : title || "제목 없음"}
            </h1>

            {/* 모바일: 2열 그리드로 공간 효율 / sm 이상: 기존 flex wrap */}
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-white/70 sm:flex sm:flex-wrap sm:items-center">
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
                // 모바일에서 2칸 다 먹게 해서 잘림 방지
                <span className="col-span-2 sm:col-auto">
                  마지막 수정자: <span className="text-white/90">{lastEditor}</span>
                </span>
              )}
            </div>
          </div>

          {/* 버튼: 모바일에서는 아래 줄에서 우측 정렬 / sm 이상에서는 오른쪽 영역 */}
          <div className="flex flex-wrap justify-end gap-2 sm:shrink-0 sm:items-center">
            <NeumorphicButton
              onClick={handleRecommend}
              variant="primary"
              disabled={liking || isLoading}
              className={[
                "transition",
                like
                  ? "border border-white/30 bg-white/15 text-white"
                  : "border border-white/10 bg-white/5 text-white/90 hover:bg-white/10",
              ].join(" ")}
              label={liking ? "처리중..." : like ? "👎 추천 취소" : "👍 추천"}
            />

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

      <div className={`${EDITOR_SHELL} p-4 min-h-[280px] sm:min-h-[360px]`}>
        {mounted ? (
          <ReadOnlyEditor key={editorMountKey} blocks={blocks} />
        ) : (
          <div className="text-white/60">에디터 로딩 중...</div>
        )}
      </div>
    </main>
  );
}

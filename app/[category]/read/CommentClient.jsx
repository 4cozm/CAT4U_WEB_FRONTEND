"use client";

import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/useToast";
import { formatKoreanTime } from "@/utils/date.js";
import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function getPortraitUrl(characterId, size = 64) {
  if (!characterId) return null;
  return `https://images.evetech.net/characters/${encodeURIComponent(String(characterId))}/portrait?size=${size}`;
}

export default function CommentClient() {
  const sp = useSearchParams();
  const { me } = useAuth();
  const { pushToast } = useToast();

  const boardId = useMemo(() => sp.get("id") || sp.get("boardId") || "", [sp]);

  const my = useMemo(() => me?.data ?? me ?? null, [me]);
  const myCharId = my?.id ?? null;
  const sentinelRef = useRef(null);

  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const [newText, setNewText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [composerOpen, setComposerOpen] = useState(false);
  const composerRef = useRef(null);

  async function loadFirst() {
    if (!boardId) return;

    setLoading(true);
    try {
      const payload = await fetchWithAuth(`/api/comment?boardId=${encodeURIComponent(boardId)}&take=20`, {
        method: "GET",
      });

      if (!payload?.ok) {
        setItems([]);
        setNextCursor(null);
        // 목록 로딩은 토스트가 과하면 거슬릴 수 있으니, 실패시에만 표시
        pushToast({ type: "error", message: payload?.message || "댓글 로딩 실패" });
        return;
      }

      setItems(payload.items ?? []);
      setNextCursor(payload.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!composerOpen) return;
    const t = setTimeout(() => composerRef.current?.focus?.(), 0);
    return () => clearTimeout(t);
  }, [composerOpen]);

  const loadMore = useCallback(async () => {
    if (!boardId || !nextCursor || moreLoading) return;

    setMoreLoading(true);
    try {
      const payload = await fetchWithAuth(
        `/api/comment?boardId=${encodeURIComponent(boardId)}&cursor=${encodeURIComponent(nextCursor)}&take=20`,
        { method: "GET" }
      );

      if (!payload?.ok) {
        pushToast({ type: "error", message: payload?.message || "추가 댓글 로딩 실패" });
        return;
      }

      setItems((prev) => [...prev, ...(payload.items ?? [])]);
      setNextCursor(payload.nextCursor ?? null);
    } finally {
      setMoreLoading(false);
    }
  }, [boardId, nextCursor, moreLoading, pushToast]);

  useEffect(() => {
    if (!nextCursor) return; // 더 불러올 게 없으면 관찰 안 함
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        if (moreLoading) return;
        loadMore();
      },
      {
        root: null,
        rootMargin: "200px", // 바닥 근처 오기 전에 미리 로딩
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [nextCursor, loadMore, moreLoading]);
  async function onCreate() {
    const text = (newText ?? "").trim();
    if (!text) {
      pushToast({ type: "error", message: "댓글 내용을 입력해달라옹" });
      return;
    }

    const payload = await fetchWithAuth(`/api/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId, content: text }),
    });

    if (!payload?.ok) {
      pushToast({ type: "error", message: payload?.message || "댓글 작성 실패" });
      return;
    }

    pushToast({ type: "success", message: payload?.message || "댓글 작성 완료" });
    setNewText("");
    setComposerOpen(false);
    await loadFirst();
  }

  function startEdit(c) {
    setEditId(c.id);
    setEditText(c.content ?? "");
  }

  function cancelEdit() {
    setEditId(null);
    setEditText("");
  }

  async function onUpdate() {
    if (!editId) return;

    const text = (editText ?? "").trim();
    if (!text) {
      pushToast({ type: "error", message: "댓글 내용을 입력해달라옹" });
      return;
    }

    const payload = await fetchWithAuth(`/api/comment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: editId, content: text }),
    });

    if (!payload?.ok) {
      pushToast({ type: "error", message: payload?.message || "댓글 수정 실패" });
      return;
    }

    pushToast({ type: "success", message: payload?.message || "댓글 수정 완료" });
    cancelEdit();
    await loadFirst();
  }

  async function onDelete(commentId) {
    if (!confirm("댓글을 삭제할까옹?")) return;

    const payload = await fetchWithAuth(`/api/comment`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });

    if (!payload?.ok) {
      pushToast({ type: "error", message: payload?.message || "댓글 삭제 실패" });
      return;
    }

    pushToast({ type: "success", message: payload?.message || "댓글 삭제 완료" });
    await loadFirst();
  }

  useEffect(() => {
    loadFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col pt-4">
      {/*  큰 테두리 카드 제거: 헤더만 두고 아래는 열어둔 느낌 */}
      <div className="mt-10">
        <div className="mb-3 flex items-end justify-between">
          <div className="text-lg font-semibold text-white/90">댓글</div>
          <div className="text-xs text-white/55">{items.length ? `${items.length}개` : ""}</div>
        </div>

        {/* 작성 영역 (기본 접힘) */}
        <div className="mt-3">
          {!composerOpen ? (
            <div className="flex items-center justify-end">
              <button
                onClick={() => setComposerOpen(true)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 active:scale-[0.99]"
              >
                댓글쓰기
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/15 bg-black/10 p-3">
              <textarea
                ref={composerRef}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/15 bg-black/10 p-3 text-white outline-none placeholder:text-white/40 focus:border-white/30"
                placeholder="댓글을 입력해달라옹..."
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setComposerOpen(false);
                    setNewText("");
                  }}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  취소
                </button>
                <button
                  onClick={onCreate}
                  className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 active:scale-[0.99]"
                >
                  작성
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 목록 */}
        <div className="mt-4">
          {loading ? (
            <div className="text-sm text-white/60">댓글 침대 밑에서 꺼내는 중...</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-white/60">아직 아무 댓글이 없다옹</div>
          ) : (
            <div className="divide-y divide-white/10">
              {items.map((c) => {
                const authorNick = c?.user?.nickname ?? c?.user?.nickName ?? "알수없음";
                const authorCharId = c?.user?.character_id ?? c?.user_id ?? null;
                const portraitUrl = getPortraitUrl(authorCharId, 64);

                //  오탐 방지: id 기반만
                const mine = myCharId && authorCharId && String(myCharId) === String(authorCharId);

                return (
                  <div key={c.id} className="py-4">
                    <div className="flex items-start gap-3">
                      {/* 초상화 */}
                      <div className="shrink-0">
                        {portraitUrl ? (
                          <img
                            src={portraitUrl}
                            alt=""
                            className="h-9 w-9 rounded-full border border-white/15 bg-black/20"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full border border-white/15 bg-white/5" />
                        )}
                      </div>

                      {/* 본문 */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-white/90">{authorNick}</div>
                            <div className="text-xs text-white/55">{formatKoreanTime(c.created_at)}</div>
                          </div>

                          {mine && (
                            <div className="flex gap-2">
                              {editId === c.id ? (
                                <>
                                  <button
                                    onClick={onUpdate}
                                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15"
                                  >
                                    저장
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15"
                                  >
                                    취소
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(c)}
                                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => onDelete(c.id)}
                                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15"
                                  >
                                    삭제
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-2">
                          {editId === c.id ? (
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              rows={3}
                              className="w-full resize-none rounded-xl border border-white/15 bg-black/10 p-3 text-white outline-none focus:border-white/30"
                            />
                          ) : (
                            <div className="whitespace-pre-wrap text-sm text-white/85">{c.content}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 무한 스크롤 센티넬 */}
          {!loading && nextCursor && (
            <div ref={sentinelRef} className="mt-4 flex justify-center">
              <div className="text-xs text-white/50">{moreLoading ? "더 불러오는 중..." : ""}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

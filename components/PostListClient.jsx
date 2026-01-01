// 카테고리를 기반으로 글 목록을 가져오는 컴포넌트

"use client";

import GlassCard from "@/components/GlassCard";
import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function toPageNumber(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString("ko-KR");
}

export default function PostListClient({ categoryParam, categoryId }) {
  const sp = useSearchParams();
  const page = useMemo(() => toPageNumber(sp.get("page") || "1"), [sp]);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    setData(null);
    setError("");

    fetchWithAuth(`/api/board?type=${encodeURIComponent(categoryId)}&page=${page}`, {
      method: "GET",
    })
      .then((d) => {
        if (!alive) return;
        setData(d);
      })
      .catch((e) => {
        if (!alive) return;
        setError(String(e?.message || e));
      });

    return () => {
      alive = false;
    };
  }, [categoryId, page]);

  if (error) {
    return (
      <GlassCard>
        <div className="p-4 text-sm text-white/70">목록 불러오기 실패: {error}</div>
      </GlassCard>
    );
  }

  if (!data) {
    return (
      <GlassCard>
        <div className="p-4 text-sm text-white/70">불러오는 중...</div>
      </GlassCard>
    );
  }

  const rawPosts = data.posts ?? [];

  const posts = rawPosts.map((p) => ({
    id: p.id,
    title: p.board_title ?? "제목 없음",
    authorName: p.nickname ?? "",
    createdAt: p.create_dt ?? "",
    corp: mapCorpName(p.user?.corp),
    recommendCnt: Number.isFinite(Number(p.recommend_cnt)) ? Number(p.recommend_cnt) : 0,
    like: !!p.like,
  }));

  const totalPages = data.totalPages ?? 1;
  const currentPage = data.currentPage ?? page;

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <GlassCard>
      {posts.length === 0 ? (
        <div className="p-4 text-white/70">게시글이 없습니다.</div>
      ) : (
        <ul className="divide-y divide-white/10">
          {posts.map((post) => (
            <li key={post.id} className="p-4 hover:bg-white/5">
              <Link href={`/${categoryParam}/read?id=${encodeURIComponent(post.id)}`} className="block">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{post.title}</div>

                    {(post.createdAt || post.authorName || post.corp) && (
                      <div className="mt-1 text-xs text-white/60">
                        {post.authorName ? `by ${post.authorName}` : ""}
                        {post.authorName && post.corp ? " · " : ""}
                        {post.corp ? `${post.corp}` : ""}
                        {(post.authorName || post.corp) && post.createdAt ? " · " : ""}
                        {post.createdAt ? formatDate(post.createdAt) : ""}
                      </div>
                    )}
                  </div>

                  <div
                    className={`shrink-0 rounded-lg px-2 py-1 text-xs transition`}
                    title={post.like ? "마우스 치우라냥" : ""}
                  >
                    👍 {post.recommendCnt}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Link
          href={`/${categoryParam}?page=${prevPage}`}
          className={`rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 ${
            currentPage <= 1 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          이전
        </Link>

        <div className="text-sm text-white/70">
          {currentPage} / {totalPages}
        </div>

        <Link
          href={`/${categoryParam}?page=${nextPage}`}
          className={`rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 ${
            currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
          }`}
        >
          다음
        </Link>
      </div>
    </GlassCard>
  );
}

// corp 매핑
const CORP_NAME_MAP = {
  98641311: "캣포유",
  98616206: "대구",
  98494391: "물고기",
};

function mapCorpName(corp) {
  if (!corp) return "";
  const key = String(corp);
  return CORP_NAME_MAP[key] ?? "등록되지 않은 코퍼레이션";
}

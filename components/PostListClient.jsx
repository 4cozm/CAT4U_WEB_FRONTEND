//카테고리를 기반으로 글 목록을 가져오는 컴포넌트

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

  const posts = data.posts ?? [];
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
              <Link href={`/${categoryParam}/${post.id}`} className="block">
                <div className="text-sm font-medium">{post.title ?? "제목 없음"}</div>
                {post.createdAt || post.authorName ? (
                  <div className="mt-1 text-xs text-white/60">
                    {post.authorName ? `by ${post.authorName}` : ""}
                    {post.authorName && post.createdAt ? " · " : ""}
                    {post.createdAt ? String(post.createdAt) : ""}
                  </div>
                ) : null}
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

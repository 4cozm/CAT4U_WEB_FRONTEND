"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaHotjar } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import CategoryPills from "../components/CategoryPills";
import ListCard from "../components/ListCard.jsx";

function fmtKST(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(d);
}

function PostItem({ post }) {
  const id = String(post.id);
  const type = String(post.type ?? "").toLowerCase();
  const title = post.board_title ?? "(제목 없음)";
  const author = post.nickname ?? "-";
  const likes = post.recommend_cnt ?? 0;
  const created = post.create_dt ? fmtKST(post.create_dt) : "";

  const href = `/${encodeURIComponent(type)}/read?id=${encodeURIComponent(id)}`;

  return (
    <Link href={href} className="block">
      <ListCard className="cursor-pointer">
        <h3 className="text-base font-semibold">{title}</h3>

        <CategoryPills category={type} categories={post.categories} />

        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <span>{author}</span>
            {created && <span>· {created}</span>}
          </span>

          <span className="inline-flex items-center gap-1">
            <AiOutlineLike className="h-4 w-4" /> {likes}
          </span>
        </div>
      </ListCard>
    </Link>
  );
}

export default function HomeFeedClient() {
  const [feed, setFeed] = useState(null); // null=로딩
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr("");

        const res = await fetch("/api/board/feed", { method: "GET" });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json(); // ✅ 백엔드가 { latest, top, yyyymm } 그대로 반환

        const latest = Array.isArray(json?.latest) ? json.latest.slice(0, 5) : [];
        const top = Array.isArray(json?.top) ? json.top.slice(0, 5) : [];
        const yyyymm = json?.yyyymm ?? "";

        if (!alive) return;
        setFeed({ latest, top, yyyymm });
      } catch (e) {
        if (!alive) return;
        setErr("피드를 불러오지 못했다옹…");
        setFeed({ latest: [], top: [], yyyymm: "" });
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // 로딩 UI
  if (feed === null) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="latest-heading">
          <h2 id="latest-heading" className="flex items-center gap-2 text-2xl font-semibold">
            <IoTimeOutline className="h-6 w-6" />
            최신글
          </h2>
          <div className="mt-3 grid gap-3">
            <ListCard>
              <div className="text-sm text-muted">불러오는 중…</div>
            </ListCard>
            <ListCard>
              <div className="text-sm text-muted">불러오는 중…</div>
            </ListCard>
          </div>
        </section>

        <section aria-labelledby="popular-heading">
          <h2 id="popular-heading" className="flex items-center gap-2 text-2xl font-semibold">
            <FaHotjar className="h-6 w-6" />
            인기글
          </h2>
          <div className="mt-3 grid gap-3">
            <ListCard>
              <div className="text-sm text-muted">불러오는 중…</div>
            </ListCard>
            <ListCard>
              <div className="text-sm text-muted">불러오는 중…</div>
            </ListCard>
          </div>
        </section>
      </div>
    );
  }

  const { latest, top } = feed;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 최신글 */}
      <section aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="flex items-center gap-2 text-2xl font-semibold">
          <IoTimeOutline className="h-6 w-6" />
          최신글
        </h2>

        <div className="mt-3 grid gap-3">
          {err ? (
            <ListCard>
              <div className="text-sm text-red-200">{err}</div>
            </ListCard>
          ) : latest.length === 0 ? (
            <ListCard>
              <div className="text-sm text-muted">아직 글이 없다옹.그럴리가 없는데...</div>
            </ListCard>
          ) : (
            latest.map((post) => <PostItem key={String(post.id)} post={post} />)
          )}
        </div>
      </section>

      {/* 인기글 */}
      <section aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="flex items-center gap-2 text-2xl font-semibold">
          <FaHotjar className="h-6 w-6" />
          인기글
        </h2>

        <div className="mt-3 grid gap-3">
          {err ? (
            <ListCard>
              <div className="text-sm text-red-200">{err}</div>
            </ListCard>
          ) : top.length === 0 ? (
            <ListCard>
              <div className="flex items-center gap-3">
                <img
                  src="/images/tease.webp"
                  alt="tease"
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="text-sm text-muted">인기글도 안올라오는 커뮤니티라니~ 허접❤️ 쓰레기❤️</div>
              </div>
            </ListCard>
          ) : (
            top.map((post) => <PostItem key={String(post.id)} post={post} />)
          )}
        </div>
      </section>
    </div>
  );
}

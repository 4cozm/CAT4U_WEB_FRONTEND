"use client";

import React from "react";
import { createPortal } from "react-dom";

function GlassCard({ className = "", ...rest }) {
  return (
    <div
      className={"rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur shadow-xl " + className}
      {...rest}
    />
  );
}

/** 기본 카테고리/서브카테고리 추출 (함선 제외 일반용) */
function getCatSub(e) {
  if (Array.isArray(e?.folders) && e.folders.length) {
    const cat = String(e.folders[0] || "etc");
    const sub = String(e.folders[1] || "etc");
    return { category: cat, subcategory: sub };
  }
  const pathLike = e?.id || e?.url || e?.src || e?.thumb || e?.filename || "";
  let p = String(pathLike);
  try {
    p = decodeURI(p);
  } catch {}
  p = p.replace(/^https?:\/\/[^/]+/i, "").split("?")[0];
  let parts = p.split("/").filter(Boolean);
  if (parts.length && /\.[a-z0-9]+$/i.test(parts[parts.length - 1])) parts.pop();
  const skip = new Set([
    "public",
    "eve-emoji",
    "eve-emoji-thumbs",
    "images",
    "img",
    "emoji",
    "emojis",
    "thumb",
    "thumbs",
    "group",
    "groups",
  ]);
  parts = parts.filter((seg) => !skip.has(seg.toLowerCase()));
  const cat = String(parts[0] || "etc");
  const sub = String(parts[1] || "etc");
  return { category: cat, subcategory: sub };
}

/** 일반용 그룹 (함선 제외) */
function groupByCatSub(list) {
  const catMap = new Map();
  for (const e of list) {
    const { category, subcategory } = getCatSub(e);
    if (!catMap.has(category)) catMap.set(category, new Map());
    const subMap = catMap.get(category);
    if (!subMap.has(subcategory)) subMap.set(subcategory, []);
    subMap.get(subcategory).push(e);
  }
  return Array.from(catMap.entries()).map(([category, subMap]) => ({
    category,
    subcats: Array.from(subMap.entries()).map(([subcategory, items]) => ({
      subcategory,
      items,
    })),
  }));
}

/** 함선 전용 헬퍼 */
const isShip = (e) => Array.isArray(e?.folders) && e.folders[0] === "함선";

function uniq(arr) {
  return Array.from(new Set(arr));
}

export default function EmojiPicker({ list = [], onPick, onClose }) {
  // 전체 그룹(카테고리 뷰에서 사용)
  const groups = React.useMemo(() => groupByCatSub(list), [list]);

  // ── 상태 ─────────────────────────────────────────────
  const [activeCat, setActiveCat] = React.useState(null);

  // 일반 카테고리용
  const [activeSub, setActiveSub] = React.useState(null);

  // 함선 전용 단계
  const [activeFaction, setActiveFaction] = React.useState(null); // 국가/팩션
  const [activeClass, setActiveClass] = React.useState(null); // 함급

  // 카테고리 바뀔 때 하위 단계 리셋
  React.useEffect(() => {
    setActiveSub(null);
    setActiveFaction(null);
    setActiveClass(null);
  }, [activeCat]);

  // 일반 카테고리: 서브카테고리 목록
  const subcats = React.useMemo(() => {
    if (!activeCat) return [];
    const g = groups.find((g) => g.category === activeCat);
    return g ? g.subcats : [];
  }, [groups, activeCat]);

  // 일반 카테고리: 아이템 목록
  const items = React.useMemo(() => {
    if (!activeCat || !activeSub) return [];
    const g = groups.find((g) => g.category === activeCat);
    const s = g?.subcats.find((s) => s.subcategory === activeSub);
    return s ? s.items : [];
  }, [groups, activeCat, activeSub]);

  // ── 함선 전용 인덱스 ──────────────────────────────────
  const shipList = React.useMemo(() => list.filter(isShip), [list]);

  // 국가(팩션) 목록: folders[1]
  const shipFactions = React.useMemo(() => {
    return uniq(shipList.map((e) => e.folders?.[1]).filter(Boolean));
  }, [shipList]);

  // 선택 국가의 함급 목록: folders[2]
  const shipClasses = React.useMemo(() => {
    if (!activeFaction) return [];
    const classes = shipList
      .filter((e) => e.folders?.[1] === activeFaction && e.folders?.length >= 3)
      .map((e) => e.folders[2]);
    return uniq(classes);
  }, [shipList, activeFaction]);

  // 선택 국가 + 함급의 아이템: folders[1]==faction && folders[2]==class (그 아래 깊이는 전부 포함)
  const shipItems = React.useMemo(() => {
    if (!activeFaction || !activeClass) return [];
    return shipList.filter((e) => e.folders?.[1] === activeFaction && e.folders?.[2] === activeClass);
  }, [shipList, activeFaction, activeClass]);

  // 마운트 후에만 포털 렌더
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // ── UI 렌더 ──────────────────────────────────────────
  const overlay = (
    <div className="fixed inset-0 z-50" onMouseDown={onClose} aria-hidden>
      <GlassCard
        className="absolute bottom-24 left-0 w-[24rem] max-h-[70vh] overflow-auto p-3"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <p className="mb-2 text-sm font-semibold text-neutral-100">이브 이모지 선택</p>

        {/* 1단계: 카테고리 */}
        {!activeCat && (
          <div className="space-y-1">
            {groups.length === 0 ? (
              <p className="text-xs text-neutral-400/80">
                이모지 없는데숭? <code className="text-neutral-300">/manifest.json</code> 확인.
              </p>
            ) : (
              groups.map(({ category, subcats }) => (
                <button
                  key={category}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveCat(category);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-white/10"
                >
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-[11px] text-neutral-400/80">
                    {subcats.reduce((n, s) => n + s.items.length, 0)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {/* 2단계: 서브 네비게이션 */}
        {activeCat && (
          <>
            {/* ── (A) 함선 전용: 국가(팩션) 선택 ── */}
            {activeCat === "함선" && !activeFaction && (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveCat(null);
                    }}
                    className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                  >
                    ← 카테고리
                  </button>
                  <span className="text-xs text-neutral-400/80">함선 · 국가</span>
                </div>
                <div className="space-y-1">
                  {shipFactions.map((faction) => {
                    // 국가별 총 아이템 수(표시용)
                    const count = shipList.filter((e) => e.folders?.[1] === faction).length;
                    return (
                      <button
                        key={faction}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveFaction(faction);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-white/10"
                      >
                        <span className="text-sm">{faction}</span>
                        <span className="text-[11px] text-neutral-400/80">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── (B) 함선 전용: 함급 선택 ── */}
            {activeCat === "함선" && activeFaction && !activeClass && (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveFaction(null);
                    }}
                    className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                  >
                    ← {activeCat} · 국가
                  </button>
                  <span className="text-xs text-neutral-400/80">{activeFaction} · 함급</span>
                </div>
                <div className="space-y-1">
                  {shipClasses.map((klass) => {
                    const count = shipList.filter(
                      (e) => e.folders?.[1] === activeFaction && e.folders?.[2] === klass
                    ).length;
                    return (
                      <button
                        key={klass}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveClass(klass);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-white/10"
                      >
                        <span className="text-sm">{klass}</span>
                        <span className="text-[11px] text-neutral-400/80">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── (C) 함선 전용: 최종 아이템 ── */}
            {activeCat === "함선" && activeFaction && activeClass && (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveClass(null);
                    }}
                    className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                  >
                    ← {activeFaction} · 함급
                  </button>
                  <span className="text-xs text-neutral-400/80">
                    {activeFaction} / {activeClass}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {shipItems.map((e) => (
                    <button
                      key={e.id || e.url || e.src}
                      title={e.name}
                      type="button"
                      onMouseDown={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        onPick?.(e);
                      }}
                      className="flex flex-col items-center rounded-lg p-2 hover:bg-white/10 active:scale-[.98]"
                    >
                      <img
                        src={e.url || e.thumb || e.src}
                        alt={e.name}
                        className="h-12 w-12 object-contain rounded bg-white/5 ring-1 ring-white/10"
                      />
                      <span className="mt-1 text-[11px] text-neutral-200 line-clamp-1">{e.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── (D) 일반 카테고리: 기존 2단계 ── */}
            {activeCat !== "함선" && !activeSub && (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveCat(null);
                    }}
                    className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                  >
                    ← 카테고리
                  </button>
                  <span className="text-xs text-neutral-400/80">{activeCat}</span>
                </div>
                <div className="space-y-1">
                  {subcats.map(({ subcategory, items }) => (
                    <button
                      key={subcategory}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveSub(subcategory);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-white/10"
                    >
                      <span className="text-sm">{subcategory}</span>
                      <span className="text-[11px] text-neutral-400/80">{items.length}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeCat !== "함선" && activeSub && (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveSub(null);
                    }}
                    className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                  >
                    ← {activeCat}
                  </button>
                  <span className="text-xs text-neutral-400/80">{activeSub}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {items.map((e) => (
                    <button
                      key={e.id || e.url || e.src}
                      title={e.name}
                      type="button"
                      onMouseDown={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        onPick?.(e);
                      }}
                      className="flex flex-col items-center rounded-lg p-2 hover:bg-white/10 active:scale-[.98]"
                    >
                      <img
                        src={e.url || e.thumb || e.src}
                        alt={e.name}
                        className="h-12 w-12 object-contain rounded bg-white/5 ring-1 ring-white/10"
                      />
                      <span className="mt-1 text-[11px] text-neutral-200 line-clamp-1">{e.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose?.();
            }}
            className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
          >
            닫기
          </button>
        </div>
      </GlassCard>
    </div>
  );

  return createPortal(overlay, document.body);
}

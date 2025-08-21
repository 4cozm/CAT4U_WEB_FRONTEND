"use client";
import React from "react";
import { createPortal } from "react-dom";

/* GlassCard (픽커 UI) */
function GlassCard({ className = "", ...rest }) {
  return (
    <div
      className={"rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur shadow-xl " + className}
      {...rest}
    />
  );
}

/* 2단계 그룹핑 유틸: 카테고리/서브카테고리/아이템 */
function group2(list) {
  const catMap = new Map();
  for (const e of list) {
    const cat = e.category || "etc";
    const sub = e.subcategory || "etc";
    if (!catMap.has(cat)) catMap.set(cat, new Map());
    const subMap = catMap.get(cat);
    if (!subMap.has(sub)) subMap.set(sub, []);
    subMap.get(sub).push(e);
  }
  return Array.from(catMap.entries()).map(([category, subMap]) => ({
    category,
    subcats: Array.from(subMap.entries()).map(([subcategory, items]) => ({
      subcategory,
      items,
    })),
  }));
}

/* 이모지 픽커 (리스트/콜백 외부주입) */
export default function EmojiPicker({ list = [], onPick, onClose }) {
  const groups = React.useMemo(() => group2(list), [list]);
  const [activeCat, setActiveCat] = React.useState(null);
  const [activeSub, setActiveSub] = React.useState(null);

  const subcats = React.useMemo(() => {
    if (!activeCat) return [];
    const g = groups.find((g) => g.category === activeCat);
    return g ? g.subcats : [];
  }, [groups, activeCat]);

  const items = React.useMemo(() => {
    if (!activeCat || !activeSub) return [];
    const g = groups.find((g) => g.category === activeCat);
    const s = g?.subcats.find((s) => s.subcategory === activeSub);
    return s ? s.items : [];
  }, [groups, activeCat, activeSub]);

  // ---- Portal 안전 가드 (SSR에서 document 없음) ----
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const overlay = (
    <div className="fixed inset-0 z-50" onClick={onClose} aria-hidden>
      <GlassCard
        className="absolute bottom-24 left-0 w-[24rem] max-h-[70vh] overflow-auto p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-2 text-sm font-semibold text-neutral-100">이브 이모지 선택</p>

        {!activeCat && (
          <div className="space-y-1">
            {groups.length === 0 ? (
              <p className="text-xs text-neutral-400/80">
                이모지가 없습니다. <code className="text-neutral-300">/public/eve-emoji/manifest.json</code> 확인.
              </p>
            ) : (
              groups.map(({ category, subcats }) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCat(category)}
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

        {activeCat && !activeSub && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveCat(null)}
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
                  onClick={() => setActiveSub(subcategory)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-white/10"
                >
                  <span className="text-sm">{subcategory}</span>
                  <span className="text-[11px] text-neutral-400/80">{items.length}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {activeCat && activeSub && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSub(null)}
                className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
              >
                ← {activeCat}
              </button>
              <span className="text-xs text-neutral-400/80">{activeSub}</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {items.map((e) => (
                <button
                  key={e.src}
                  title={e.name}
                  type="button"
                  onClick={() => onPick?.(e)}
                  className="flex flex-col items-center rounded-lg p-2 hover:bg-white/10 active:scale-[.98]"
                >
                  <img
                    src={e.thumb || e.src}
                    alt={e.name}
                    className="h-10 w-10 object-contain rounded bg-white/5 ring-1 ring-white/10"
                  />
                  <span className="mt-1 text-[11px] text-neutral-200 line-clamp-1">{e.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
          >
            닫기
          </button>
        </div>
      </GlassCard>
    </div>
  );

  // ---- 화면 전체 기준: body 아래로 Portal 렌더 ----
  return createPortal(overlay, document.body);
}

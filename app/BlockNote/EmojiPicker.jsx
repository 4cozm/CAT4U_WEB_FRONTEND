"use client";
import React from "react";
import { createPortal } from "react-dom";

/* GlassCard 컴포넌트
   - 반투명 배경 + blur 효과 + 그림자
   - 공통 카드 스타일을 재사용하기 위해 정의 */
function GlassCard({ className = "", ...rest }) {
  return (
    <div
      className={"rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur shadow-xl " + className}
      {...rest}
    />
  );
}

/* group2: 이모지 리스트를
   카테고리 → 서브카테고리 → 아이템
   구조로 2단계 그룹핑해주는 유틸 함수 */
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
  // Map → 배열 변환
  return Array.from(catMap.entries()).map(([category, subMap]) => ({
    category,
    subcats: Array.from(subMap.entries()).map(([subcategory, items]) => ({
      subcategory,
      items,
    })),
  }));
}

/* EmojiPicker
   - 이브 이모지를 카테고리별로 선택할 수 있는 UI
   - 외부에서 list(이모지 데이터), onPick(선택 콜백), onClose(닫기 콜백)을 주입받음 */
export default function EmojiPicker({ list = [], onPick, onClose }) {
  // 전체 리스트를 그룹 구조로 변환
  const groups = React.useMemo(() => group2(list), [list]);

  // 현재 선택된 카테고리 / 서브카테고리 상태
  const [activeCat, setActiveCat] = React.useState(null);
  const [activeSub, setActiveSub] = React.useState(null);

  // 현재 카테고리에 속한 서브카테고리 목록
  const subcats = React.useMemo(() => {
    if (!activeCat) return [];
    const g = groups.find((g) => g.category === activeCat);
    return g ? g.subcats : [];
  }, [groups, activeCat]);

  // 현재 카테고리 + 서브카테고리에 속한 아이템 목록
  const items = React.useMemo(() => {
    if (!activeCat || !activeSub) return [];
    const g = groups.find((g) => g.category === activeCat);
    const s = g?.subcats.find((s) => s.subcategory === activeSub);
    return s ? s.items : [];
  }, [groups, activeCat, activeSub]);

  // ---- Portal 안전 가드 (Next.js SSR 환경에서는 document가 없으므로 mount 이후만 렌더) ----
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // 오버레이 UI 정의
  const overlay = (
    <div className="fixed inset-0 z-50" onClick={onClose} aria-hidden>
      <GlassCard
        className="absolute bottom-24 left-0 w-[24rem] max-h-[70vh] overflow-auto p-3"
        onClick={(e) => e.stopPropagation()} // 카드 내부 클릭 시 오버레이 닫힘 방지
      >
        <p className="mb-2 text-sm font-semibold text-neutral-100">이브 이모지 선택</p>

        {/* 1단계: 카테고리 선택 */}
        {!activeCat && (
          <div className="space-y-1">
            {groups.length === 0 ? (
              <p className="text-xs text-neutral-400/80">
                이모지 없는데숭? <code className="text-neutral-300">/public/eve-emoji/manifest.json</code> 확인.
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

        {/* 2단계: 서브카테고리 선택 */}
        {activeCat && !activeSub && (
          <>
            {/* 뒤로가기 버튼 */}
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

        {/* 3단계: 실제 이모지 아이템 선택 */}
        {activeCat && activeSub && (
          <>
            {/* 뒤로가기 버튼 */}
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

            {/* 이모지 그리드 */}
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
                    className="h-12 w-12 object-contain rounded bg-white/5 ring-1 ring-white/10"
                  />
                  <span className="mt-1 text-[11px] text-neutral-200 line-clamp-1">{e.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 닫기 버튼 */}
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

  // ---- createPortal: body 기준으로 오버레이를 렌더링 (BlockNote 내부에 갇히지 않음) ----
  return createPortal(overlay, document.body);
}

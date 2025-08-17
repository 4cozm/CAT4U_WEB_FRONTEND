"use client";
import { insertOrUpdateBlock } from "@blocknote/core";
import { SuggestionMenuController, getDefaultReactSlashMenuItems, useBlockNoteEditor } from "@blocknote/react";
import React from "react";
import { GiSpaceship } from "react-icons/gi";

// 텍스트 검색
const filterItems = (items, query) => {
  const q = (query || "").toLowerCase();
  if (!q) return items;
  return items.filter(
    (it) =>
      it.title?.toLowerCase().includes(q) ||
      (Array.isArray(it.aliases) && it.aliases.some((a) => a.toLowerCase().includes(q)))
  );
};

// 기본 항목 제목 중복 key 방지
const ensureUniqueTitles = (items) => {
  const seen = new Map();
  return items.map((it) => {
    const t = it.title ?? "";
    const n = (seen.get(t) || 0) + 1;
    seen.set(t, n);
    return n === 1 ? it : { ...it, title: `${t} ${n}` };
  });
};

// 2단계 그룹핑: category → subcategory → items
const group2 = (list) => {
  const catMap = new Map();
  for (const e of list) {
    const cat = e.category || "etc";
    const sub = e.subcategory || "etc";
    if (!catMap.has(cat)) catMap.set(cat, new Map());
    const subMap = catMap.get(cat);
    if (!subMap.has(sub)) subMap.set(sub, []);
    subMap.get(sub).push(e);
  }
  // 배열로 변환
  return Array.from(catMap.entries()).map(([category, subMap]) => ({
    category,
    subcats: Array.from(subMap.entries()).map(([subcategory, items]) => ({
      subcategory,
      items,
    })),
  }));
};

// 이모지 픽커 (카테고리 → 2차카테고리 → 이모지)
function EmojiPicker({ list, onPick, onClose }) {
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

  return (
    <div className="fixed inset-0 z-50" onClick={onClose} aria-hidden>
      <div
        className="absolute bottom-24 left-6 w-[24rem] max-h-[70vh] overflow-auto rounded-xl border bg-white p-3 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-2 text-sm font-semibold">이브 이모지 선택</p>

        {/* 1단계: 카테고리 목록 */}
        {!activeCat && (
          <div className="space-y-1">
            {groups.length === 0 ? (
              <p className="text-xs text-neutral-500">
                이모지가 없습니다. <code>/public/eve-emoji/manifest.json</code> 확인.
              </p>
            ) : (
              groups.map(({ category, subcats }) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCat(category)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-neutral-100"
                >
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-[11px] text-neutral-500">
                    {subcats.reduce((n, s) => n + s.items.length, 0)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {/* 2단계: 2차카테고리 목록 */}
        {activeCat && !activeSub && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveCat(null)}
                className="rounded border px-2 py-1 text-xs hover:bg-neutral-50"
              >
                ← 카테고리
              </button>
              <span className="text-xs text-neutral-500">{activeCat}</span>
            </div>

            <div className="space-y-1">
              {subcats.map(({ subcategory, items }) => (
                <button
                  key={subcategory}
                  type="button"
                  onClick={() => setActiveSub(subcategory)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-neutral-100"
                >
                  <span className="text-sm">{subcategory}</span>
                  <span className="text-[11px] text-neutral-500">{items.length}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 3단계: 이모지 그리드 */}
        {activeCat && activeSub && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSub(null)}
                className="rounded border px-2 py-1 text-xs hover:bg-neutral-50"
              >
                ← {activeCat}
              </button>
              <span className="text-xs text-neutral-500">{activeSub}</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {items.map((e) => (
                <button
                  key={e.src}
                  title={e.name}
                  className="flex flex-col items-center rounded-lg p-2 hover:bg-neutral-100 active:scale-[.98]"
                  onClick={() => onPick(e)}
                  type="button"
                >
                  <img
                    src={e.thumb || e.src}
                    alt={e.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 object-contain"
                  />
                  <span className="mt-1 text-[11px] text-neutral-600 line-clamp-1">{e.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-3 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-1 text-sm hover:bg-neutral-50">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export function SlashMenu() {
  const editor = useBlockNoteEditor();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);

  // manifest.json 로드
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/eve-emoji/manifest.json"); // 캐시 허용
        if (!res.ok) throw new Error("manifest not found");
        const data = await res.json();
        if (alive && Array.isArray(data)) setEmojiList(data);
      } catch {
        if (alive) setEmojiList([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!editor) return null;

  const items = React.useMemo(() => {
    const defaults = ensureUniqueTitles(getDefaultReactSlashMenuItems(editor));
    const eveEmojiItem = {
      title: "이브 이모지 삽입",
      icon: <GiSpaceship className="h-4 w-4" />,
      group: "미디어",
      aliases: ["eve", "emoji", "이모지", "우주선"],
      onItemClick: () => setPickerOpen(true),
    };
    return [...defaults, eveEmojiItem];
  }, [editor]);

  const handlePick = (emoji) => {
    insertOrUpdateBlock(editor, {
      type: "image",
      props: { src: emoji.src, alt: emoji.name },
    });
    setPickerOpen(false);
  };

  return (
    <>
      <SuggestionMenuController triggerCharacter="/" getItems={async (query) => filterItems(items, query)} />
      {pickerOpen && <EmojiPicker list={emojiList} onPick={handlePick} onClose={() => setPickerOpen(false)} />}
    </>
  );
}

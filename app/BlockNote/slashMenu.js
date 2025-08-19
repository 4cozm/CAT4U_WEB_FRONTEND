"use client";

import { SuggestionMenuController, getDefaultReactSlashMenuItems, useBlockNoteEditor } from "@blocknote/react";
import React from "react";
import { GiSpaceship } from "react-icons/gi";

/* 텍스트 검색 */
const filterItems = (items, query) => {
  const q = (query || "").toLowerCase();
  if (!q) return items;
  return items.filter(
    (it) =>
      it.title?.toLowerCase().includes(q) ||
      (Array.isArray(it.aliases) && it.aliases.some((a) => a.toLowerCase().includes(q)))
  );
};

/* “보이는 라벨” 중복 보정 (제목 → 제목 2, 3, ...) */
const ensureUniqueTitles = (items) => {
  const seen = new Map();
  return items.map((orig) => {
    const t = String(orig.title || "");
    const n = (seen.get(t) || 0) + 1;
    seen.set(t, n);
    const title = n === 1 ? t : `${t} ${n}`;
    return { ...orig, title };
  });
};

/* 2단계 그룹핑 (이모지 픽커용) */
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
  return Array.from(catMap.entries()).map(([category, subMap]) => ({
    category,
    subcats: Array.from(subMap.entries()).map(([subcategory, items]) => ({
      subcategory,
      items,
    })),
  }));
};

/* GlassCard (픽커 UI) */
function GlassCard({ className = "", ...rest }) {
  return (
    <div
      className={"rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur shadow-xl " + className}
      {...rest}
    />
  );
}

/* 이모지 픽커 */
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
      <GlassCard
        className="absolute bottom-24 left-6 w-[24rem] max-h-[70vh] overflow-auto p-3"
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
                  onClick={() => onPick(e)}
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
}

/* Slash 메뉴 아이템 정규화: id/name/key 강제 + group/label 유니크화 */
function normalizeSlashItems(rawItems) {
  const withIds = rawItems.map((it, i) => {
    const baseId = it.id ?? it.name ?? it.__safeId ?? `${String(it.title || "item").replaceAll(" ", "-")}-${i}`;
    return { ...it, id: baseId, name: baseId, key: baseId };
  });

  const grouped = withIds.map((it, i) => {
    if (typeof it.group === "string" && it.group.length) {
      return { ...it, group: `${it.group}#${i}` };
    }
    return it;
  });

  const seen = new Map();
  const titled = grouped.map((it) => {
    const t = String(it.title || "");
    const n = (seen.get(t) || 0) + 1;
    seen.set(t, n);
    return { ...it, title: n === 1 ? t : `${t} ${n}` };
  });

  return titled;
}

export function SlashMenu() {
  const editor = useBlockNoteEditor();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/eve-emoji/manifest.json");
        if (!res.ok) throw new Error("manifest not found");
        const data = await res.json();

        // basePath/assetPrefix가 있을 수도 있으니 대비
        const assetPrefix = (typeof window !== "undefined" && window.__NEXT_DATA__?.assetPrefix) || "";

        const toAbsEncoded = (p) => {
          if (!p) return p;
          // 1) 절대경로화
          const abs = p.startsWith("/") ? p : `/${p}`;
          // 2) URL 인코딩 (한글/공백 등)
          return assetPrefix + encodeURI(abs);
        };

        if (alive && Array.isArray(data)) {
          const normalized = data.map((e) => ({
            ...e,
            src: toAbsEncoded(e.src),
            thumb: e.thumb ? toAbsEncoded(e.thumb) : undefined,
          }));
          setEmojiList(normalized);
        }
      } catch {
        if (alive) setEmojiList([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!editor) return null;

  const baseItems = React.useMemo(() => {
    const defaults = ensureUniqueTitles(getDefaultReactSlashMenuItems(editor));
    const eveEmojiItem = {
      title: "이브 이모지 삽입",
      icon: <GiSpaceship className="h-4 w-4" />,
      group: "미디어",
      aliases: ["eve", "emoji", "이모지", "우주선"],
      onItemClick: () => setPickerOpen(true),
      id: "cmd-eve-emoji",
      name: "cmd-eve-emoji",
      __safeId: "cmd-eve-emoji",
    };
    return [...defaults, eveEmojiItem];
  }, [editor]);

  const items = React.useMemo(() => baseItems, [baseItems]);

  const handlePick = async (emoji) => {
    // 카드/manifest에서 온 원본을 그대로 받아서
    const raw = emoji.insertSrc || emoji.thumb || emoji.src;

    // thumbs 경로로 강제 + 더블인코딩 방지 처리
    const src = safeEncodePath(toThumbPath(raw));

    editor.focus();
    if (typeof editor.insertInlineContent === "function") {
      editor.insertInlineContent([{ type: "emoji", props: { src, alt: emoji.name } }]);
    } else if (typeof editor.tryInsertInlineContent === "function") {
      editor.tryInsertInlineContent([{ type: "emoji", props: { src, alt: emoji.name } }]);
    } else {
      document.execCommand(
        "insertHTML",
        false,
        `<img src="${src}" alt="${emoji.name}" style="height:1em;vertical-align:-0.2em;display:inline">`
      );
    }

    setPickerOpen(false);
  };

  return (
    <>
      <SuggestionMenuController
        editor={editor}
        triggerCharacter="/"
        getItems={async (query) => {
          const filtered = filterItems(items, query);
          const normalized = normalizeSlashItems(filtered);
          return normalized;
        }}
        renderItem={(item, { selected }) => (
          <div key={item.id} className={`px-2 py-1 rounded cursor-pointer ${selected ? "bg-gray-100" : ""}`}>
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.title}</span>
            </div>
          </div>
        )}
      />

      {pickerOpen && <EmojiPicker list={emojiList} onPick={handlePick} onClose={() => setPickerOpen(false)} />}
    </>
  );
}

const toThumbPath = (p) => {
  if (!p) return p;
  return p.includes("/eve-emoji-thumbs/") ? p : p.replace("/eve-emoji/", "/eve-emoji-thumbs/");
};

const safeEncodePath = (p) => {
  if (!p) return p;
  try {
    // 이미 인코딩된 경우에도 decode → encode로 “정상 형태”만 유지
    return encodeURI(decodeURI(p));
  } catch {
    // decode 실패(이상한 문자열)이면 건드리지 않음
    return p;
  }
};

"use client";

import { SuggestionMenuController, getDefaultReactSlashMenuItems, useBlockNoteEditor } from "@blocknote/react";
import Image from "next/image";
import React from "react";
import EmojiPicker from "./EmojiPicker";

/**
 * 슬래시 메뉴 전체를 커스터마이즈:
 * - BlockNote의 SuggestionMenuController는 기본적으로 "그룹 헤더"를 렌더링할 때
 *   같은 텍스트(예: '제목', '미디어')가 여러 번 나오면 React key 경고가 날 수 있어요.
 * - 공식 prop인 `suggestionMenuComponent`를 이용해 "메뉴 전체"를 직접 그리면,
 *   그룹/아이템에 우리가 원하는 고유 key를 부여할 수 있습니다.
 */
export default function SlashMenu() {
  const editor = useBlockNoteEditor();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);

  // 이모지 매니페스트 로드 (정적 export 환경에서도 public/ 경로로 바로 서빙됨)
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/eve-emoji/manifest.json", { cache: "force-cache" });
        if (!res.ok) throw new Error("manifest not found");
        const data = await res.json();

        // basePath/assetPrefix 대응 + 경로 인코딩
        const assetPrefix = (typeof window !== "undefined" && window.__NEXT_DATA__?.assetPrefix) || "";
        const toAbsEncoded = (p) => {
          if (!p) return p;
          const abs = p.startsWith("/") ? p : `/${p}`;
          return assetPrefix + encodeURI(abs);
        };

        const normalized = Array.isArray(data)
          ? data.map((e) => ({
              ...e,
              src: toAbsEncoded(e.src),
              thumb: e.thumb ? toAbsEncoded(e.thumb) : undefined,
            }))
          : [];

        if (alive) setEmojiList(normalized);
      } catch {
        if (alive) setEmojiList([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!editor) return null;

  /**
   * 기본 슬래시 아이템 + 커스텀 명령 추가
   * - icon은 문자열 경로가 아니라 ReactNode여야 함
   */
  const baseItems = React.useMemo(() => {
    const defaults = getDefaultReactSlashMenuItems(editor);
    const eveEmojiItem = {
      id: "cmd-eve-emoji", // 고유 ID를 명시 (key 안정성 ↑)
      title: "이브 이모지 삽입",
      group: "미디어",
      aliases: ["eve", "emoji", "이모지", "우주선"],
      icon: <Image src="/eve-emoji.png" alt="EVE Emoji" width={18} height={18} />,
      onItemClick: () => setPickerOpen(true),
    };
    return [...defaults, eveEmojiItem];
  }, [editor]);

  /**
   * 검색: title/aliases만 가볍게
   */
  const filterItems = React.useCallback((items, query) => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const t = it.title?.toLowerCase() || "";
      const hitTitle = t.includes(q);
      const hitAlias = Array.isArray(it.aliases) && it.aliases.some((a) => (a || "").toLowerCase().includes(q));
      return hitTitle || hitAlias;
    });
  }, []);

  /**
   * React key 안정화:
   * - 아이템마다 __id, __idx(플랫 인덱스), __groupKey를 부여해 중복 key 경고 제거
   * - group 라벨은 그대로 보여주되, 내부적으로는 `${라벨}#${카운터}`로 안전키 사용
   */
  const normalizeForKeys = React.useCallback((items) => {
    const groupSeen = new Map();
    return items.map((it, idx) => {
      const title = String(it.title ?? "item");
      const baseId = it.id ?? it.name ?? it.key ?? `${title.replace(/\s+/g, "-").toLowerCase()}-${idx}`;

      const groupLabel = String(it.group ?? "기본");
      const gCount = (groupSeen.get(groupLabel) || 0) + 1;
      groupSeen.set(groupLabel, gCount);
      const groupKey = `${groupLabel}#${gCount}`; // 화면에는 groupLabel만 보여주고, key만 groupKey 사용

      return { ...it, __id: baseId, __idx: idx, __groupLabel: groupLabel, __groupKey: groupKey };
    });
  }, []);

  /**
   * 커스텀 메뉴 컴포넌트:
   * - BlockNote가 넘겨주는 items/selectedIndex/onItemClick만 활용
   * - 그룹 단위로 묶어 헤더와 항목을 렌더 (키보드 ↑↓/엔터 등 기본 동작 유지)
   */
  const CustomSuggestionMenu = React.useCallback(({ items, selectedIndex, onItemClick }) => {
    // 그룹핑: 표시용 라벨(__groupLabel)과 내부키(__groupKey)를 함께 사용
    const grouped = React.useMemo(() => {
      const map = new Map(); // key: __groupKey, val: { label, items: [...] }
      items.forEach((it) => {
        const key = it.__groupKey || it.__groupLabel || "기본";
        if (!map.has(key)) {
          map.set(key, { label: it.__groupLabel || "기본", items: [] });
        }
        map.get(key).items.push(it);
      });
      return Array.from(map.entries()); // [ [groupKey, {label, items}], ... ]
    }, [items]);

    return (
      <div className="rounded-xl border border-white/10 bg-neutral-900/70 backdrop-blur p-2 shadow-xl max-h-[60vh] overflow-auto">
        {grouped.map(([gKey, group]) => (
          <div key={gKey} className="py-1">
            {/* 그룹 헤더: 화면엔 라벨만, key는 gKey로 고유화 */}
            <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
              {group.label}
            </div>

            {group.items.map((item) => (
              <div
                key={item.__id} // 아이템 고유키
                className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer ${
                  selectedIndex === item.__idx ? "bg-white/10" : ""
                }`}
                onMouseDown={(e) => {
                  // 기본 포커스 흐름 깨지지 않게 mouseDown에서 처리
                  e.preventDefault();
                  onItemClick?.(item);
                }}
              >
                {item.icon}
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-100">{item.title}</span>
                  {item.subtext && <span className="text-[11px] text-neutral-400/80">{item.subtext}</span>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }, []);

  /**
   * 이모지 선택 → 인라인 삽입
   */
  const handlePick = (emoji) => {
    const raw = emoji.thumb || emoji.src;
    const src = safeEncodePath(toThumbPath(raw));
    const alt = emoji.name || "emoji";

    editor.focus?.();
    if (typeof editor.insertInlineContent === "function") {
      editor.insertInlineContent([{ type: "emoji", props: { src, alt } }]);
    } else if (typeof editor.tryInsertInlineContent === "function") {
      editor.tryInsertInlineContent([{ type: "emoji", props: { src, alt } }]);
    }
    setPickerOpen(false);
  };

  return (
    <>
      <SuggestionMenuController
        editor={editor}
        triggerCharacter="/"
        getItems={async (query) => normalizeForKeys(filterItems(baseItems, query))}
        // 기본 렌더러 대신 "전체 커스텀 메뉴"로 교체 → 그룹/아이템 키 충돌 제거
        suggestionMenuComponent={CustomSuggestionMenu}
      />

      {pickerOpen && <EmojiPicker list={emojiList} onPick={handlePick} onClose={() => setPickerOpen(false)} />}
    </>
  );
}

/* ====== 경로 유틸 ====== */
function toThumbPath(p) {
  if (!p) return p;
  return p.includes("/eve-emoji-thumbs/") ? p : p.replace("/eve-emoji/", "/eve-emoji-thumbs/");
}
function safeEncodePath(p) {
  if (!p) return p;
  try {
    return encodeURI(decodeURI(p)); // 이중 인코딩 방지
  } catch {
    return encodeURI(p);
  }
}

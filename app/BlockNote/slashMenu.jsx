"use client";

import React from "react";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useBlockNoteEditor,
} from "@blocknote/react";
import { GiSpaceship } from "react-icons/gi";
import EmojiPicker from "./EmojiPicker";

/** SlashMenu: 기본 컴포넌트 유지(키보드/휠 OK) + renderItem 커스터마이즈 */
export default function SlashMenu() {
  const editor = useBlockNoteEditor();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/eve-emoji/manifest.json", { cache: "force-cache" });
        if (!res.ok) throw new Error("manifest not found");
        const data = await res.json();

        // basePath/assetPrefix 대응 + 경로 인코딩
        const assetPrefix =
          (typeof window !== "undefined" && window.__NEXT_DATA__?.assetPrefix) || "";
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

  // 기본 아이템 + 이모지 삽입
  const baseItems = React.useMemo(() => {
    const defaults = getDefaultReactSlashMenuItems(editor);
    const eveEmojiItem = {
      title: "이브 이모지 삽입",
      group: "미디어",
      aliases: ["eve", "emoji", "이모지", "우주선"],
      icon: <GiSpaceship className="h-4 w-4" />,
      onItemClick: () => setPickerOpen(true),
    };
    return [...defaults, eveEmojiItem];
  }, [editor]);

  // 가벼운 필터
  const filterItems = React.useCallback((items, query) => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const t = it.title?.toLowerCase() || "";
      const hitTitle = t.includes(q);
      const hitAlias =
        Array.isArray(it.aliases) && it.aliases.some((a) => (a || "").toLowerCase().includes(q));
      return hitTitle || hitAlias;
    });
  }, []);

  // 중복 title 대비: 렌더용 숨김 키 부여
  const makeUnique = React.useCallback((items) => {
    const seen = new Map();
    return items.map((it) => {
      const t = String(it.title ?? "");
      const n = (seen.get(t) || 0) + 1;
      seen.set(t, n);
      return { ...it, __key: `${t}#${n}` };
    });
  }, []);

  const handlePick = (emoji) => {
    // thumbs 우선 삽입 (없으면 src)
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
        getItems={async (query) => makeUnique(filterItems(baseItems, query))}
        renderItem={(item, { selected }) => (
          <div
            key={item.__key}
            className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer ${
              selected ? "bg-white/10" : ""
            }`}
          >
            {item.icon}
            <span className="text-sm text-neutral-100">{item.title}</span>
          </div>
        )}
      />

      {pickerOpen && (
        <EmojiPicker
          list={emojiList}
          onPick={handlePick}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}

/* ====== 유틸 ====== */
function toThumbPath(p) {
  if (!p) return p;
  return p.includes("/eve-emoji-thumbs/") ? p : p.replace("/eve-emoji/", "/eve-emoji-thumbs/");
}
function safeEncodePath(p) {
  if (!p) return p;
  try {
    return encodeURI(decodeURI(p));
  } catch {
    return encodeURI(p);
  }
}

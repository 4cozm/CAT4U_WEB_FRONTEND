"use client";

import { SuggestionMenuController, getDefaultReactSlashMenuItems, useBlockNoteEditor } from "@blocknote/react";
import Image from "next/image";
import React from "react";
import EmojiPicker from "./EmojiPicker.jsx";

/* 공용 렌더러: key = index 로 안전 */
function SlashMenuList({ items, selectedIndex, onItemClick }) {
  return (
    <div className="z-50 max-h-72 w-[20rem] overflow-auto rounded-xl border border-white/10 bg-black/80 p-1 backdrop-blur">
      {items.map((it, idx) => (
        <button
          key={`item-${idx}`}
          type="button"
          onClick={() => onItemClick?.(it)}
          className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition
            ${selectedIndex === idx ? "bg-white/10" : "hover:bg-white/10"}`}
        >
          <div className="flex w-10 shrink-0 justify-center">
            {it.badge ? (
              <span className="rounded-md px-1 text-xs leading-5 text-white/90 ring-1 ring-white/20">{it.badge}</span>
            ) : it.icon ? (
              <span className="opacity-90">{it.icon}</span>
            ) : null}
          </div>
          <div className="min-w-0 flex-1 truncate text-white/90">{it.title}</div>
          {it.subtext ? (
            <div className="ml-2 shrink-0 truncate text-xs text-white/50 max-w-[9rem] hidden sm:block">
              {it.subtext}
            </div>
          ) : null}
        </button>
      ))}
      {items.length === 0 && <div className="px-3 py-2 text-sm text-white/60">결과가 없어요</div>}
    </div>
  );
}

export default function SlashMenu() {
  const editor = useBlockNoteEditor();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);
  const selectionRef = React.useRef(null);

  // manifest 로드
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/manifest.json", { cache: "force-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setEmojiList(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setEmojiList([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!editor) return null;

  // 3-1) '/'용: 기본 아이템 불러오되 'emoji' 관련은 제거
  const slashDefaults = React.useMemo(() => {
    const arr = getDefaultReactSlashMenuItems(editor) || [];
    // title/aliases에 'emoji' 또는 '이모지'가 보이면 제외
    return arr.filter((it) => {
      const t = String(it?.title || "").toLowerCase();
      const hitTitle = t.includes("emoji") || t.includes("이모지");
      const hitAlias =
        Array.isArray(it?.aliases) &&
        it.aliases.some((a) => String(a).toLowerCase().includes("emoji") || String(a).toLowerCase().includes("이모지"));
      return !(hitTitle || hitAlias);
    });
  }, [editor]);

  const getSlashItems = React.useCallback(
    async (query) => {
      const q = (query || "").trim().toLowerCase();
      if (!q) return slashDefaults;
      return slashDefaults.filter((it) => {
        const t = (it.title || "").toLowerCase();
        const hitTitle = t.includes(q);
        const hitAlias = Array.isArray(it.aliases) && it.aliases.some((a) => (a || "").toLowerCase().includes(q));
        return hitTitle || hitAlias;
      });
    },
    [slashDefaults]
  );

  // 3-2) ':'용: 커스텀 이모지
  const colonItems = React.useMemo(
    () => [
      {
        title: "이브 이모지 삽입",
        group: "미디어",
        aliases: ["eve", "emoji", "이모지", "우주선", ":"],
        icon: <Image src="/eve-emoji.png" alt="EVE Emoji" width={18} height={18} />,
        onItemClick: () => {
          selectionRef.current = editor.getSelection?.() ?? null;
          setPickerOpen(true);
        },
      },
    ],
    [editor]
  );

  const getColonItems = React.useCallback(
    async (query) => {
      const q = (query || "").trim().toLowerCase();
      if (!q) return colonItems;
      return colonItems.filter((it) => {
        const t = (it.title || "").toLowerCase();
        const hitTitle = t.includes(q);
        const hitAlias = Array.isArray(it.aliases) && it.aliases.some((a) => (a || "").toLowerCase().includes(q));
        return hitTitle || hitAlias;
      });
    },
    [colonItems]
  );

  // 이모지 선택 → selection 복원 후 인라인 삽입(실패 시 ❓는 spec에서 처리)
  const handlePick = React.useCallback(
    (emoji) => {
      const src = emoji?.url || emoji?.src || emoji?.thumb;
      const alt = emoji?.name || "emoji";

      const saved = selectionRef.current;
      if (saved && editor.setSelection) editor.setSelection(saved);
      else editor.focus?.();

      if (typeof editor.insertInlineContent === "function") {
        editor.insertInlineContent([{ type: "emoji", props: { src, alt } }]);
      } else if (typeof editor.tryInsertInlineContent === "function") {
        editor.tryInsertInlineContent([{ type: "emoji", props: { src, alt } }]);
      }

      selectionRef.current = null;
      setPickerOpen(false);
    },
    [editor]
  );

  return (
    <>
      {/* '/' 기본: 우리 렌더러로 그리지만 실질은 기본 목록 */}
      <SuggestionMenuController
        editor={editor}
        triggerCharacter="/"
        getItems={getSlashItems}
        suggestionMenuComponent={SlashMenuList}
      />

      {/* ':' 커스텀: 이모지 */}
      <SuggestionMenuController
        editor={editor}
        triggerCharacter=":"
        getItems={getColonItems}
        suggestionMenuComponent={SlashMenuList}
      />

      {pickerOpen && <EmojiPicker list={emojiList} onPick={handlePick} onClose={() => setPickerOpen(false)} />}
    </>
  );
}

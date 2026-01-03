// app/BlockNote/menus/EveEmojiMenu.jsx
"use client";

import { SuggestionMenuController } from "@blocknote/react";
import Image from "next/image";
import React from "react";
import EmojiPicker from "../EmojiPicker.jsx";

/**
 * ✅ 역할
 * - ; (triggerCharacter) 입력 → 메뉴 표시
 * - "이브 이모지 넣기" → 피커 열고 커서 위치에 emoji inline 삽입 (실패 시 image block 폴백)
 * - "EVE Fit 임베드" → eveFit block를 현재 커서 블럭 뒤(after)에 삽입
 *
 * ✅ 이번 fix의 핵심
 * - insertBlocks(referenceBlock)는 BlockIdentifier(string | Block)를 받지만,
 *   런타임에서 id→Block resolve가 흔들릴 수 있어 'isInGroup' 에러가 남.
 * - 따라서 우리가 editor.getBlock(...)로 "Block 객체"로 resolve해서 넣는다.
 */

export default function EveEmojiMenu({ editor, triggerCharacter = ";" }) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);
  const cursorBlockIdRef = React.useRef(null);

  // 1) manifest 로드
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/manifest.json", { cache: "force-cache" });
        const data = res.ok ? await res.json() : [];
        if (alive) setEmojiList(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setEmojiList([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // URL normalize
  const normalizeUrl = React.useCallback((u) => {
    if (!u) return "";
    if (/^https?:\/\//i.test(u) || u.startsWith("data:")) return u;
    const withRoot = u.startsWith("/") ? u : `/${u}`;
    return encodeURI(withRoot);
  }, []);

  // SuggestionMenu 클릭 직전에 현재 커서 블럭 id 저장 → 피커 열기
  const openPickerAfterCleanup = React.useCallback(() => {
    if (!editor) return;

    const run = () => {
      try {
        const pos = editor.getTextCursorPosition?.();
        const raw = pos?.block;
        cursorBlockIdRef.current = typeof raw === "string" ? raw : raw?.id ?? null;
      } catch {
        cursorBlockIdRef.current = null;
      }
      setPickerOpen(true);
    };

    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(run, 0);
  }, [editor]);

  /**
   * BlockIdentifier(string | Block | undefined)를 "Block 객체"로 최대한 안전하게 resolve
   */
  const resolveBlockIdentifier = React.useCallback(
    (identifier) => {
      if (!editor || !identifier) return null;

      // 1) 이미 Block 객체면 그대로
      if (typeof identifier === "object" && identifier.id) return identifier;

      // 2) string id면 editor.getBlock(id)로 resolve
      if (typeof identifier === "string") {
        try {
          const b = editor.getBlock?.(identifier);
          if (b) return b;
        } catch (err) {
          console.error(err);
        }

        // fallback: snapshot(document)에서라도 찾아보기
        const doc = editor.document || [];
        const hit = doc.find((x) => x?.id === identifier);
        return hit ?? null;
      }

      return null;
    },
    [editor]
  );

  /**
   * ✅ insertBlocks에 넣을 referenceBlock(Block 객체)을 확보
   * 우선순위:
   * 1) 저장된 커서 id(cursorBlockIdRef)
   * 2) 현재 커서 pos.block
   * 3) 문서 마지막 블럭
   */
  const ensureRefBlock = React.useCallback(() => {
    if (!editor) return null;

    editor.focus?.();

    // 1) 저장된 id
    const saved = resolveBlockIdentifier(cursorBlockIdRef.current);
    if (saved) return saved;

    // 2) 현재 커서 block
    try {
      const pos = editor.getTextCursorPosition?.();
      const cur = resolveBlockIdentifier(pos?.block);
      if (cur) return cur;
    } catch (err){
      console.error(err);
    }

    // 3) 마지막 블럭
    const doc = editor.document || [];
    const last = doc[doc.length - 1] ?? doc[0] ?? null;
    return last;
  }, [editor, resolveBlockIdentifier]);

  /**
   * ✅ EVE Fit 삽입 (한 틱 뒤 실행: 메뉴 클릭으로 selection이 흔들리는 타이밍 회피)
   */
  const insertFitAfterCleanup = React.useCallback(() => {
    if (!editor) return;

    const run = () => {
      const refBlock = ensureRefBlock();
      if (!refBlock) {
        console.warn("[EVE FIT] reference block not found (document empty?)");
        return;
      }

      try {
        editor.insertBlocks([{ type: "eveFit", props: { eft: "", fitUrl: "" } }], refBlock, "after");
      } catch (err) {
        console.error("[EVE FIT] insertBlocks failed", err);

        // 최후 fallback: "문서 마지막 블럭"으로 한 번 더
        try {
          const doc = editor.document || [];
          const last = doc[doc.length - 1] ?? doc[0];
          if (last) editor.insertBlocks([{ type: "eveFit", props: { eft: "", fitUrl: "" } }], last, "after");
        } catch (e2) {
          console.error("[EVE FIT] fallback insertBlocks failed", e2);
        }
      }
    };

    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(run, 0);
  }, [editor, ensureRefBlock]);

  // 메뉴 아이템들
  const items = React.useMemo(
    () => [
      {
        title: "이브 이모지 넣기",
        group: "Media",
        aliases: ["eve", "emoji", "이모지", triggerCharacter],
        icon: <Image src="/eve-emoji.png" alt="EVE Emoji" width={18} height={18} />,
        onItemClick: openPickerAfterCleanup,
      },
      {
        title: "EVE Fit 임베드",
        group: "Media",
        aliases: ["fit", "eft", "피팅", "eveship"],
        onItemClick: insertFitAfterCleanup,
      },
    ],
    [openPickerAfterCleanup, triggerCharacter, insertFitAfterCleanup]
  );

  const getItems = React.useCallback(
    async (query) => {
      const q = (query || "").trim().toLowerCase();
      if (!q) return items;
      return items.filter((it) => {
        const t = (it.title || "").toLowerCase();
        const hitTitle = t.includes(q);
        const hitAlias = Array.isArray(it.aliases) && it.aliases.some((a) => (a || "").toLowerCase().includes(q));
        return hitTitle || hitAlias;
      });
    },
    [items]
  );

  // 이모지 선택 → 커서 복구 후 삽입
  const handlePick = React.useCallback(
    (emoji) => {
      if (!editor) return;

      const raw = emoji?.url ?? emoji?.src ?? emoji?.thumb ?? "";
      const src = normalizeUrl(raw);
      const alt = emoji?.name || "emoji";

      // 커서 복구
      const ref = ensureRefBlock();
      if (ref) {
        try {
          editor.setTextCursorPosition?.(ref.id, "end");
        } catch (err){
          console.error(err);
        }
      }

      try {
        editor.insertInlineContent([{ type: "emoji", props: { src, alt } }, " "], { updateSelection: true });
        setPickerOpen(false);
        cursorBlockIdRef.current = null;
        return;
      } catch {
        /* 폴백 */
      }

      // 폴백: 이미지 블럭 삽입
      try {
        const ref2 = ensureRefBlock();
        if (ref2) editor.insertBlocks([{ type: "image", props: { url: src, name: alt } }], ref2, "after");
      } catch (err) {
        console.error(err);
      }

      setPickerOpen(false);
      cursorBlockIdRef.current = null;
    },
    [editor, normalizeUrl, ensureRefBlock]
  );

  if (!editor) return null;

  return (
    <>
      <SuggestionMenuController editor={editor} triggerCharacter={triggerCharacter} getItems={getItems} />
      {pickerOpen && <EmojiPicker list={emojiList} onPick={handlePick} onClose={() => setPickerOpen(false)} />}
    </>
  );
}

"use client";
import { SuggestionMenuController } from "@blocknote/react";
import Image from "next/image";
import React from "react";
import EmojiPicker from "../EmojiPicker.jsx";

export default function EveEmojiMenu({ editor, triggerCharacter = ";" }) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);
  const cursorBlockIdRef = React.useRef(null);

  // 1. Effect는 최상단 유지
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

  const openPickerAfterCleanup = React.useCallback(() => {
    if (!editor) return;
    const run = () => {
      try {
        const pos = editor.getTextCursorPosition?.();
        cursorBlockIdRef.current = pos?.block?.id ?? null;
      } catch {
        cursorBlockIdRef.current = null;
      }
      setPickerOpen(true);
    };
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(run, 0);
  }, [editor]);

  const items = React.useMemo(
    () => [
      {
        title: "Insert EVE Emoji",
        group: "Media",
        aliases: ["eve", "emoji", "이모지", triggerCharacter],
        icon: <Image src="/eve-emoji.png" alt="EVE Emoji" width={18} height={18} />,
        onItemClick: openPickerAfterCleanup,
      },
    ],
    [openPickerAfterCleanup, triggerCharacter]
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

  const normalizeUrl = React.useCallback((u) => {
    if (!u) return "";
    if (/^https?:\/\//i.test(u) || u.startsWith("data:")) return u;
    const withRoot = u.startsWith("/") ? u : `/${u}`;
    return encodeURI(withRoot);
  }, []);

  const ensureEditableCursor = React.useCallback(() => {
    if (!editor) return;
    editor.focus?.();

    if (!editor.document || editor.document.length === 0) {
      try {
        editor.replaceBlocks(editor.document, [{ type: "paragraph", content: "" }]);
      } catch (err) {
        console.error(err);
      }
    }

    const targetId = cursorBlockIdRef.current;
    if (targetId) {
      try {
        editor.setTextCursorPosition?.(targetId, "end");
        return;
      } catch (err) {
        console.error(err);
      }
    }

    try {
      const first = editor.document?.[0];
      if (first) editor.setTextCursorPosition?.(first, "end");
    } catch (err) {
      console.log(err);
    }
  }, [editor]);

  const handlePick = React.useCallback(
    (emoji) => {
      if (!editor) return;
      const raw = emoji?.url ?? emoji?.src ?? emoji?.thumb ?? "";
      const src = normalizeUrl(raw);
      const alt = emoji?.name || "emoji";

      ensureEditableCursor();

      try {
        editor.insertInlineContent([{ type: "emoji", props: { src, alt } }, " "], { updateSelection: true });
        setPickerOpen(false);
        cursorBlockIdRef.current = null;
        return;
      } catch {
        /* 폴백 로직 */
      }

      try {
        const refBlock = editor.getTextCursorPosition?.()?.block ?? editor.document?.[editor.document.length - 1];
        if (refBlock) {
          editor.insertBlocks([{ type: "image", props: { url: src, name: alt } }], refBlock, "after");
        }
      } catch (err) {
        console.error(err);
      }

      setPickerOpen(false);
      cursorBlockIdRef.current = null;
    },
    [editor, normalizeUrl, ensureEditableCursor]
  );

  if (!editor) return null;

  return (
    <>
      <SuggestionMenuController editor={editor} triggerCharacter={triggerCharacter} getItems={getItems} />
      {pickerOpen && <EmojiPicker list={emojiList} onPick={handlePick} onClose={() => setPickerOpen(false)} />}
    </>
  );
}

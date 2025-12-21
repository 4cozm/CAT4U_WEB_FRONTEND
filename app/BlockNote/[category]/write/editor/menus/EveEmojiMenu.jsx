"use client";
import { SuggestionMenuController, useBlockNoteEditor } from "@blocknote/react";
import Image from "next/image";
import React from "react";
import EmojiPicker from "../../../../EmojiPicker.jsx";

export default function EveEmojiMenu() {
  const editor = useBlockNoteEditor();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);
  const cursorBlockIdRef = React.useRef(null); // 텍스트 커서가 있던 블록 ID만 저장

  // manifest 로드 (public/manifest.json)
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

  if (!editor) return null;

  // 메뉴 아이템 클릭 시점: 트리거 문자가 정리된 다음 tick에 커서 위치 스냅샷
  const openPickerAfterCleanup = React.useCallback(() => {
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
        aliases: ["eve", "emoji", "이모지", ";"],
        icon: <Image src="/eve-emoji.png" alt="EVE Emoji" width={18} height={18} />,
        onItemClick: openPickerAfterCleanup,
      },
    ],
    [openPickerAfterCleanup]
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

  // 경로 정규화
  const normalizeUrl = React.useCallback((u) => {
    if (!u) return "";
    if (/^https?:\/\//i.test(u) || u.startsWith("data:")) return u;
    const withRoot = u.startsWith("/") ? u : `/${u}`;
    return encodeURI(withRoot);
  }, []);

  const ensureEditableCursor = React.useCallback(() => {
    editor.focus?.();

    // 문서가 비었으면 문단 하나 만들고 커서 이동
    if (!editor.document || editor.document.length === 0) {
      try {
        editor.replaceBlocks(editor.document, [{ type: "paragraph", content: "" }]); // 전체 교체로 안전 생성
      } catch {}
    }

    // 저장한 커서 블록이 있으면 그 끝으로 위치
    const targetId = cursorBlockIdRef.current;
    if (targetId) {
      try {
        editor.setTextCursorPosition?.(targetId, "end");
        return;
      } catch {}
    }

    // 폴백: 첫 블록 끝
    try {
      const first = editor.document?.[0];
      if (first) editor.setTextCursorPosition?.(first, "end");
    } catch {}
  }, [editor]);

  const handlePick = React.useCallback(
    (emoji) => {
      const raw = emoji?.url ?? emoji?.src ?? emoji?.thumb ?? "";
      const src = normalizeUrl(raw);
      const alt = emoji?.name || "emoji";

      ensureEditableCursor();

      // 1) 인라인 삽입 (권장 API)
      try {
        editor.insertInlineContent([{ type: "emoji", props: { src, alt } }, " "], { updateSelection: true }); // ← 공식 예제와 동일 패턴
        setPickerOpen(false);
        cursorBlockIdRef.current = null;
        return;
      } catch {
        /* 계속 폴백 */
      }

      // 2) 실패 시 이미지 블록 폴백(참조 블록 지정 필수)
      try {
        const refBlock = editor.getTextCursorPosition?.()?.block ?? editor.document?.[editor.document.length - 1];
        if (refBlock) {
          editor.insertBlocks([{ type: "image", props: { url: src, name: alt } }], refBlock, "after");
        }
      } catch {}

      setPickerOpen(false);
      cursorBlockIdRef.current = null;
    },
    [editor, normalizeUrl, ensureEditableCursor]
  );

  return (
    <>
      <SuggestionMenuController editor={editor} triggerCharacter=";" getItems={getItems} />
      {pickerOpen && <EmojiPicker list={emojiList} onPick={handlePick} onClose={() => setPickerOpen(false)} />}
    </>
  );
}

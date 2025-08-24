"use client";
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { createReactInlineContentSpec, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import React, { forwardRef, useImperativeHandle } from "react";
import { MdHelpOutline } from "react-icons/md";

import SlashMenu from "./slashMenu.jsx";

/* ────────────────────────────────────────────────────────────
   인라인 이모지 스펙
   - 기본: 글자크기 따라가기(em) + 최소/최대 clamp
   - 명시(px) 존재 시: 그 값 고정
   - scale: 글자 대비 배율(기본 1)
   ──────────────────────────────────────────────────────────── */

const inlineEmoji = createReactInlineContentSpec(
  {
    type: "emoji",
    propSchema: {
      src: { default: "" },
      alt: { default: "" },
      width: { default: null },
      height: { default: null },
      size: { default: null },
      scale: { default: 1 },
    },
    content: "none",
    draggable: false,
  },
  {
    render: ({ inlineContent }) => {
      const { src, alt, width, height, size, scale } = inlineContent.props || {};
      const explicitW = Number(size ?? width);
      const explicitH = Number(size ?? height);
      const hasExplicitW = Number.isFinite(explicitW);
      const hasExplicitH = Number.isFinite(explicitH);
      const hasExplicitSize = hasExplicitW || hasExplicitH;

      const wPx = hasExplicitW ? explicitW : hasExplicitH ? explicitH : undefined;
      const hPx = hasExplicitH ? explicitH : hasExplicitW ? explicitW : undefined;

      // 이미지 로드 여부 상태 관리
      const [error, setError] = React.useState(false);

      if (error || !src) {
        return (
          <MdHelpOutline
            role="img"
            aria-label={alt || "emoji"}
            style={{
              display: "inline-block",
              verticalAlign: "-0.2em",
              width: hasExplicitSize ? wPx : "clamp(22px, calc(1.1em * var(--emoji-scale, 1)), 2.5em)",
              height: hasExplicitSize ? hPx : "clamp(22px, calc(1.1em * var(--emoji-scale, 1)), 2.5em)",
              // @ts-ignore
              ["--emoji-scale"]: Number(scale) || 1,
            }}
            data-inline-emoji=""
          />
        );
      }

      return (
        <img
          src={src}
          alt={alt || ""}
          {...(hasExplicitSize ? { width: wPx, height: hPx } : {})}
          style={{
            display: "inline-block",
            verticalAlign: "-0.2em",
            // @ts-ignore
            ["--emoji-scale"]: Number(scale) || 1,
          }}
          data-inline-emoji=""
          draggable={false}
          onError={() => setError(true)}
        />
      );
    },
    // @ts-ignore
    fromHTML: (el) => {
      if (!el || el.tagName !== "IMG") return null;
      const wAttr = el.getAttribute("width");
      const hAttr = el.getAttribute("height");
      const w = wAttr ? Number(wAttr) : null;
      const h = hAttr ? Number(hAttr) : null;
      return {
        src: el.getAttribute("src") || "",
        alt: el.getAttribute("alt") || "",
        width: Number.isFinite(w) ? w : null,
        height: Number.isFinite(h) ? h : null,
      };
    },
  }
);

/**
 * @typedef {Object} EditorInnerProps
 * @property {any} serverContent
 */
const EditorInner = forwardRef(function EditorInner(props, ref) {
  // @ts-ignore
  const { serverContent } = props || {};

  const schema = React.useMemo(() => {
    return BlockNoteSchema.create({
      blockSpecs: defaultBlockSpecs,
      inlineContentSpecs: { ...defaultInlineContentSpecs, emoji: inlineEmoji },
    });
  }, []);

  const editor = useCreateBlockNote({
    schema,
    dictionary: ko,
    initialContent: serverContent,
  });

  // 부모에게 메서드 노출
  useImperativeHandle(
    ref,
    () => ({
      getJSON: () => editor.document,
      setJSON: (doc) => {
        if (!editor || !doc) return;
        try {
          editor.replaceBlocks(editor.document, doc);
        } catch (e) {
          console.warn("replaceBlocks failed:", e);
        }
      },
    }),
    [editor]
  );

  return (
    <>
      <div className="h-full min-h-0 overflow-y-auto scrollbar-none overscroll-contain p-4">
        <BlockNoteView editor={editor} slashMenu={false} formattingToolbar={false} className="!bg-transparent !p-0">
          <SlashMenu />
        </BlockNoteView>
      </div>

      {/* 전역 스타일 */}
      <style jsx global>{`
        :root .bn-container,
        :root .bn-editor,
        :root .bn-editor * {
          background: transparent !important;
        }
        :root .bn-container {
          border: none !important;
          box-shadow: none !important;
        }
        :root .bn-editor .bn-default-placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        :root .bn-container:focus-within {
          box-shadow: none !important;
          outline: none !important;
        }
        :root .bn-editor img[data-inline-emoji] {
          width: clamp(22px, calc(1.1em * var(--emoji-scale, 1)), 2.5em);
          height: clamp(22px, calc(1.1em * var(--emoji-scale, 1)), 2.5em);
          image-rendering: auto;
        }

        /* 제목에서 살짝 더 키우고 싶으면 배율만 덮어쓰기 */
        :root .bn-editor h1 img[data-inline-emoji] {
          --emoji-scale: 1.15;
        }
        :root .bn-editor h2 img[data-inline-emoji] {
          --emoji-scale: 1.08;
        }
      `}</style>
    </>
  );
});

export default EditorInner;

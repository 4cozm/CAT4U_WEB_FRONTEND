"use client";
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { createReactInlineContentSpec, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import React from "react";
import SlashMenu from "./slashMenu.jsx";

/* 인라인 이모지 스펙 (사용 중인 버전 유지) */
const inlineEmoji = createReactInlineContentSpec(
  {
    type: "emoji",
    propSchema: {
      src: { default: "" },
      alt: { default: "" },
      // 픽셀 기반 크기 지정용
      width: { default: null }, // 예: 64
      height: { default: null }, // 예: 64
      // 한 번에 정사각형 지정하고 싶을 때(size가 있으면 width/height 무시)
      size: { default: 20 }, // 예: 64
    },
    content: "none",
    draggable: false,
  },
  {
    render: ({ inlineContent }) => {
      const { src, alt, width, height, size } = inlineContent.props || {};

      // 우선순위: size > width/height > 기본값(24)
      const w = Number(size ?? width) || 24;
      const h = Number(size ?? height) || 24;

      return (
        <img
          src={src || ""}
          alt={alt || ""}
          width={w}
          height={h}
          style={{
            display: "inline-block",
            width: `${w}px`,
            height: `${h}px`,
            verticalAlign: "-0.2em",
          }}
          draggable={false}
          onError={(e) => {
            // 투명 1x1 픽셀로 대체
            e.currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
          }}
        />
      );
    },
    fromHTML: (el) => {
      if (!el || el.tagName !== "IMG") return null;
      // HTML에서 가져올 때 width/height 속성도 함께 읽어줌
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

export default function EditorInner({ serverContent }) {
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

  return (
    <>
      {/* 부모 높이를 전부 차지, 내부만 스크롤 (스크롤바 숨김) */}
      <div className="h-full min-h-0 overflow-y-auto scrollbar-none overscroll-contain p-4">
        <BlockNoteView editor={editor} slashMenu={false} formattingToolbar={false} className="!bg-transparent !p-0">
          <SlashMenu />
        </BlockNoteView>
      </div>

      {/* BlockNote 테두리/배경 제거 */}
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
      `}</style>
    </>
  );
}

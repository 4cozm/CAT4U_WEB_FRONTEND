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
    propSchema: { src: { default: "" }, alt: { default: "" } },
    content: "none",
    draggable: false,
  },
  {
    render: ({ inlineContent }) => (
      <img
        src={inlineContent.props.src || ""}
        alt={inlineContent.props.alt || ""}
        style={{ display: "inline", height: "1em", verticalAlign: "-0.2em" }}
        draggable={false}
        onError={(e) => {
          e.currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        }}
      />
    ),
    fromHTML: (el) => {
      if (!el || el.tagName !== "IMG") return null;
      return { src: el.getAttribute("src") || "", alt: el.getAttribute("alt") || "" };
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
    dictionary: ko, // ✅ 기본 ko만 사용
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

"use client";
import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import React from "react";

// 스키마 관련
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import { createReactInlineContentSpec } from "@blocknote/react";

import { SlashMenu } from "./slashMenu";

/** 한글 사전 패치: 헤딩 타이틀 유니크 */
const koFixed = {
  ...ko,
  slash_menu: {
    ...ko.slash_menu,
    heading: { ...ko.slash_menu.heading, title: "제목 1" },
    heading_2: { ...ko.slash_menu.heading_2, title: "제목 2" },
    heading_3: { ...ko.slash_menu.heading_3, title: "제목 3" },
    heading_4: { ...ko.slash_menu.heading_4, title: "제목 4" },
    heading_5: { ...ko.slash_menu.heading_5, title: "제목 5" },
    heading_6: { ...ko.slash_menu.heading_6, title: "제목 6" },
  },
  formatting_toolbar: {
    ...ko.formatting_toolbar,
    heading: { ...ko.formatting_toolbar.heading, title: "제목 1" },
    heading_2: { ...ko.formatting_toolbar.heading_2, title: "제목 2" },
    heading_3: { ...ko.formatting_toolbar.heading_3, title: "제목 3" },
    heading_4: { ...ko.formatting_toolbar.heading_4, title: "제목 4" },
    heading_5: { ...ko.formatting_toolbar.heading_5, title: "제목 5" },
    heading_6: { ...ko.formatting_toolbar.heading_6, title: "제목 6" },
  },
};
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
          // 서버가 한글 파일명을 못 서빙하면 폴백(투명 1px)
          e.currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        }}
      />
    ),
    fromHTML: (el) => {
      if (!el || el.tagName !== "IMG") return null;
      const src = el.getAttribute("src") || "";
      const alt = el.getAttribute("alt") || "";
      return { src, alt };
    },
  }
);

export default function EditorInner({ serverContent }) {
  // 1) 스키마 생성 (기본 스펙 + 커스텀 인라인 병합)
  const schema = React.useMemo(() => {
    return BlockNoteSchema.create({
      blockSpecs: defaultBlockSpecs,
      inlineContentSpecs: {
        ...defaultInlineContentSpecs,
        emoji: inlineEmoji,
      },
    });
  }, []);

  // 2) 에디터 생성
  const editor = useCreateBlockNote({
    schema,
    dictionary: koFixed,
    initialContent: serverContent,
  });

  // 3) 스키마 노드 확인 로그
  React.useEffect(() => {
    try {
      // keys()가 이터레이터이므로 배열로 변환
      const nodeKeys = [...editor.schema.spec.nodes.keys()];
      console.log("=== schema nodes ===", nodeKeys);
    } catch (e) {
      console.warn("schema nodes log failed:", e);
    }
  }, [editor]);

  return (
    <BlockNoteView editor={editor} slashMenu={false} formattingToolbar={false}>
      <SlashMenu />
    </BlockNoteView>
  );
}

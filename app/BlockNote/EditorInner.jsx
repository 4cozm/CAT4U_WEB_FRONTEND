// app/BlockNote/EditorInner.jsx
"use client";
import { uploadFile } from "@/utils/uploadFile.js";
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { en } from "@blocknote/core/locales"; // ← locale 가져와서 placeholder만 한글로
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import React, { forwardRef, useImperativeHandle } from "react";
import EveEmojiMenu from "./EveEmojiMenu.jsx";
import inlineEmoji from "./InlineEmojiSpec.jsx";

const EditorInner = forwardRef(function EditorInner(props, ref) {
  const { serverContent } = props || {};

  const schema = React.useMemo(() => {
    return BlockNoteSchema.create({
      blockSpecs: defaultBlockSpecs,
      inlineContentSpecs: { ...defaultInlineContentSpecs, emoji: inlineEmoji },
    });
  }, []);

  // ✅ 기본 UI는 영어 유지, placeholder만 한글로 커스터마이즈
  const dictionary = React.useMemo(
    () => ({
      ...en,
      placeholders: {
        ...en.placeholders,
        // 빈 문서와 기본 플레이스홀더에 동일 문구 적용
        emptyDocument: "여기에 입력하거나 '/'로 명령을, ';'로 이브 이모지를 사용하세요",
        default: "여기에 입력하거나 '/'로 명령을, ';'로 이브 이모지를 사용하세요",
        // (선택) 헤딩 자리표시도 한글로
        heading: "제목",
      },
    }),
    []
  );

  const editor = useCreateBlockNote({
    schema,
    dictionary,
    uploadFile,
    initialContent: serverContent,
  });

  useImperativeHandle(
    ref,
    () => ({
      getJSON: () => editor.document,
      setJSON: (doc) => {
        if (!editor || !doc) return;
        try {
          if (typeof editor.setContent === "function") editor.setContent(doc);
          else editor.replaceBlocks(editor.document, doc);
        } catch {}
      },
    }),
    [editor]
  );

  return (
    <>
      <div className="bn-scope h-full min-h-0 overflow-y-auto scrollbar-none overscroll-contain p-4">
        <BlockNoteView editor={editor} slashMenu formattingToolbar={false} className="!bg-transparent !p-0">
          <EveEmojiMenu />
        </BlockNoteView>
      </div>

      <style jsx global>{`
        :root .bn-scope .bn-container,
        :root .bn-scope .bn-editor {
          background: transparent !important;
        }
        :root .bn-scope .bn-container {
          border: none !important;
          box-shadow: none !important;
        }
        :root .bn-scope .bn-editor .bn-default-placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        :root .bn-scope .bn-editor [data-node-type] {
          background: transparent !important;
        }
        :root .bn-scope .bn-editor [data-is-selected="true"],
        :root .bn-scope .bn-editor .selected,
        :root .bn-scope .bn-editor [contenteditable="true"]:focus {
          background: transparent !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>
    </>
  );
});

export default EditorInner;

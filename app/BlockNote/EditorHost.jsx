"use client";

import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import { ko } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import React, { forwardRef, useImperativeHandle } from "react";

import { eveFitSpec } from "@/utils/blocknoteEmoji/eveFitSpec.js";
import { uploadFile } from "@/utils/upload/uploadFile.js";
import EditorView from "./EditorView";
import inlineEmoji from "./components/InlineEmojiSpec";

const EditorHost = forwardRef(function EditorHost({ serverContent }, ref) {
  const schema = React.useMemo(() => {
    return BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        eveFit: eveFitSpec, // ✅ 핵심: eveFit 등록
      },
      inlineContentSpecs: {
        ...defaultInlineContentSpecs,
        emoji: inlineEmoji,
      },
    });
  }, []);

  const dictionary = React.useMemo(
    () => ({
      ...ko,
      placeholders: {
        ...ko.placeholders,
        emptyDocument: "여기에 입력하거나 '/'로 명령을, ';'로 EVE 메뉴를 사용하세요",
        default: "여기에 입력하거나 '/'로 명령을, ';'로 EVE 메뉴를 사용하세요",
        heading: "제목",
      },
    }),
    []
  );

  // ✅ 서버 컨텐츠가 비면 paragraph 하나라도 보장
  const initialContent = React.useMemo(() => {
    if (Array.isArray(serverContent) && serverContent.length > 0) return serverContent;
    return [{ type: "paragraph", content: "" }];
  }, [serverContent]);

  const editor = useCreateBlockNote({
    schema,
    dictionary,
    initialContent,
    uploadFile: async (file) => {
      let blockId = null;
      try {
        blockId = editor.getTextCursorPosition?.()?.block?.id ?? null;
      } catch (err) {
        console.error(err);
      }

      try {
        return await uploadFile(file);
      } catch (err) {
        console.error(err);
        setTimeout(() => {
          if (blockId) editor.replaceBlocks([blockId], [{ type: "paragraph", content: "업로드 실패" }]);
        }, 0);
        return "/state-image/fail.webp";
      }
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      getJSON: () => editor.document,
      setJSON: (doc) => {
        if (!doc) return;
        if (typeof editor.setContent === "function") editor.setContent(doc);
        else editor.replaceBlocks(editor.document, doc);
      },
      focus: () => editor.focus?.(),
    }),
    [editor]
  );

  return <EditorView editor={editor} />;
});

export default EditorHost;

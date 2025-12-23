"use client";

import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import { en } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import React, { forwardRef, useImperativeHandle } from "react";

import { uploadFile } from "@/utils/upload/uploadFile.js";
import EditorView from "./EditorView";
import inlineEmoji from "./components/InlineEmojiSpec";

const EditorHost = forwardRef(function EditorHost({ serverContent }, ref) {
  const schema = React.useMemo(() => {
    return BlockNoteSchema.create({
      blockSpecs: defaultBlockSpecs,
      inlineContentSpecs: {
        ...defaultInlineContentSpecs,
        emoji: inlineEmoji,
      },
    });
  }, []);

  const dictionary = React.useMemo(
    () => ({
      ...en,
      placeholders: {
        ...en.placeholders,
        emptyDocument: "여기에 입력하거나 '/'로 명령을, ':'로 이브 이모지를 사용하세요",
        default: "여기에 입력하거나 '/'로 명령을, ':'로 이브 이모지를 사용하세요",
        heading: "제목",
      },
    }),
    []
  );

  const editor = useCreateBlockNote({
    schema,
    dictionary,
    initialContent: serverContent,
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
          editor.replaceBlocks([blockId], [{ type: "paragraph", content: "업로드 실패" }]);
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

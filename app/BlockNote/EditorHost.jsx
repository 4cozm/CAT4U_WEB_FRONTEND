"use client";

import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import { ko } from "@blocknote/core/locales";
import React, { forwardRef, useImperativeHandle } from "react";

import { AIExtension, aiDocumentFormats } from "@blocknote/xl-ai";
import { ko as aiKo } from "@blocknote/xl-ai/locales";
import "@blocknote/xl-ai/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { DefaultChatTransport } from "ai";

import { eveFitSpec } from "@/utils/blocknoteEmoji/eveFitSpec.js";
import { uploadFile } from "@/utils/upload/uploadFile.js";
import EditorView from "./EditorView";
import inlineEmoji from "./components/InlineEmojiSpec";

const EditorHost = forwardRef(function EditorHost({ serverContent }, ref) {
  const schema = React.useMemo(() => {
    return BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        eveFit: eveFitSpec(),
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
      ai: aiKo,
      placeholders: {
        ...ko.placeholders,
        emptyDocument: "여기에 입력하거나 '/'로 명령을, ';'로 EVE 메뉴를 사용하세요",
        default: "여기에 입력하거나 '/'로 명령을, ';'로 EVE 메뉴를 사용하세요",
        heading: "제목",
      },
    }),
    []
  );

  const initialContent = React.useMemo(() => {
    if (Array.isArray(serverContent) && serverContent.length > 0) return serverContent;
    return [{ type: "paragraph", content: [] }];
  }, [serverContent]);

  const isDev = process.env.NEXT_PUBLIC_IS_DEV === "true";
  const normalizeApi = (s) => (s.endsWith("/") ? s.slice(0, -1) : s);

  const api = isDev
    ? "/api/aiChat" // dev: rewrite 타게
    : `${normalizeApi("localhost:3000")}/api/aiChat`; // prod: 절대 URL

  const editor = useCreateBlockNote({
    schema,
    dictionary,
    initialContent,

    //  0.45 공식 방식: extensions에 AIExtension 등록 + transport 제공
    extensions: [
      AIExtension({
        transport: new DefaultChatTransport({ api: api }),
        streamToolsProvider: aiDocumentFormats.html.getStreamToolsProvider(true),
      }),
    ],
    uploadFile: async (file) => {
      // 업로드 실패 시 커서 위치 블록에 "업로드 실패"로 치환하려는 의도 유지
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
          if (blockId) editor.replaceBlocks([blockId], [{ type: "paragraph", content: [] }]);
        }, 0);
        return "/state-image/fail.webp";
      }
    },
  });

  React.useEffect(() => {
    const ai = editor.getExtension(AIExtension);
    if (!ai) return;

    const unsub = ai.store.subscribe(() => {
      const s = ai.store.state.aiMenuState;
      console.log("[AI] state =", s);
    });

    return () => unsub?.();
  }, [editor]);

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

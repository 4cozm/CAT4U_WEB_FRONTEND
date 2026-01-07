"use client";

import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import { ko } from "@blocknote/core/locales";
import React, { forwardRef, useImperativeHandle } from "react";

import { AIExtension, aiDocumentFormats } from "@blocknote/xl-ai";
import { ko as aiKo } from "@blocknote/xl-ai/locales";
import "@blocknote/xl-ai/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { DefaultChatTransport } from "ai";

import { useToast } from "@/hooks/useToast.js";
import { eveFitSpec } from "@/utils/blocknoteEmoji/eveFitSpec.js";
import { uploadFile } from "@/utils/upload/uploadFile.js";
import EditorView from "./EditorView";
import inlineEmoji from "./components/InlineEmojiSpec";

const EditorHost = forwardRef(function EditorHost({ serverContent }, ref) {
  const { pushToast } = useToast();
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

  const api = "/api/aiChat";

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

    let prevMsg = null;

    const unsub = ai.store.subscribe(() => {
      const state = ai.store.state;
      const menu = state?.aiMenuState;
      const raw = menu?.error?.message ?? state?.error?.message ?? null;

      if (!raw) return;

      let msg = raw;
      try {
        msg = JSON.parse(raw)?.message ?? raw;
      } catch (err) {
        console.error(err);
      }

      if (msg && msg !== prevMsg) {
        prevMsg = msg;
        pushToast({ type: "error", message: msg });
        console.error("[AI ERROR]", msg);
      }
    });

    return () => unsub?.();
  }, [editor, pushToast]);

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

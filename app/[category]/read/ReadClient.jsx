"use client";

import { useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import { blockNoteSchema } from "../../../utils/blocknoteEmoji/schema.js";

export default function ReadClient({ title, content }) {
  const initialContent = useMemo(() => (Array.isArray(content) ? content : []), [content]);

  const editor = useCreateBlockNote({
    schema: blockNoteSchema,
    initialContent,
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">{title}</h1>

      <div className="rounded-2xl bg-white/5 p-4">
        <BlockNoteView
          editor={editor}
          editable={false}
          // Read에서는 상호작용 UI 전부 제거
          sideMenu={false}
          slashMenu={false}
          formattingToolbar={false}
          linkToolbar={false}
          filePanel={false}
          tableHandles={false}
          emojiPicker={false}
        />
      </div>
    </main>
  );
}

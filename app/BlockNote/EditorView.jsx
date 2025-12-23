"use client";

import React from "react";
import { BlockNoteView } from "@blocknote/shadcn";

import SlashMenu from "./menus/slashMenu.jsx"; //TODO 고치기
import EveEmojiMenu from "./menus/EveEmojiMenu.jsx";

export default function EditorView({ editor }) {
  if (!editor) return null;

  return (
    <div className="bn-scope h-full min-h-0 overflow-y-auto scrollbar-none overscroll-contain p-4">
      <BlockNoteView
        editor={editor}            
        formattingToolbar={false}
        className="!bg-transparent !p-0"
      >
        <EveEmojiMenu editor={editor} triggerCharacter=";" />
      </BlockNoteView>
    </div>
  );
}

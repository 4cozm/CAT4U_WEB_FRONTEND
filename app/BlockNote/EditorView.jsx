"use client";

import React from "react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

import SlashMenu from "./menus/slashMenu.jsx";
import EveEmojiMenu from "./menus/EveEmojiMenu.jsx";

export default function EditorView({ editor }) {
  if (!editor) return null;

  return (
    <div className="bn-scope h-full min-h-0 overflow-y-auto scrollbar-none overscroll-contain p-4">
      <BlockNoteView
        editor={editor}
        slashMenu={false}            
        formattingToolbar={false}
        className="!bg-transparent !p-0"
      >
        <SlashMenu editor={editor} />
        <EveEmojiMenu editor={editor} triggerCharacter=";" />
      </BlockNoteView>
    </div>
  );
}

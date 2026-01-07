"use client";

import { filterSuggestionItems } from "@blocknote/core/extensions";
import { SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import CatAIMenu from "@/components/CatAIMenu.jsx";
import { AIMenuController, getAISlashMenuItems } from "@blocknote/xl-ai";
import EveEmojiMenu from "./menus/EveEmojiMenu.jsx";

export default function EditorView({ editor }) {
  if (!editor) return null;

  return (
    <div
      className="
        bn-scope h-full min-h-0 overflow-y-auto scrollbar-none overscroll-contain
        px-0 py-3 sm:p-4
      "
    >
      <BlockNoteView editor={editor} formattingToolbar={false} slashMenu={false} className="!bg-transparent !p-0">
        <AIMenuController aiMenu={CatAIMenu} />

        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async (query) => {
            const allItems = [...getDefaultReactSlashMenuItems(editor), ...getAISlashMenuItems(editor)];

            //  공식 필터 유틸 (aliases/subtext 포함 매칭)
            return filterSuggestionItems(allItems, query);
          }}
        />

        <EveEmojiMenu editor={editor} triggerCharacter=";" />
      </BlockNoteView>
    </div>
  );
}

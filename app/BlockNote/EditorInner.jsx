'use client';
import React from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import { ko } from '@blocknote/core/locales';
import '@blocknote/shadcn/style.css';
import '@blocknote/core/fonts/inter.css';

import { SlashMenu } from './slashMenu';

export default function EditorInner() {
  const editor = useCreateBlockNote({ dictionary: ko });

  return (
    <BlockNoteView editor={editor} slashMenu={false}>
      {/* ⬅️ 중요: 컨텍스트 안에서 렌더 */}
      <SlashMenu />
    </BlockNoteView>
  );
}

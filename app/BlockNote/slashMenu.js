'use client';
import { insertOrUpdateBlock } from '@blocknote/core';
import {
    SuggestionMenuController,
    getDefaultReactSlashMenuItems,
    useBlockNoteEditor,
} from '@blocknote/react';
import React from 'react';

// 간단 텍스트/별칭 포함 검색
const filterItems = (items, query) => {
  const q = (query || '').toLowerCase();
  if (!q) return items;
  return items.filter(
    (it) =>
      it.title?.toLowerCase().includes(q) ||
      (Array.isArray(it.aliases) &&
        it.aliases.some((a) => a.toLowerCase().includes(q)))
  );
};

// 🔧 제목이 중복되면 "제목", "제목 2", "제목 3" ... 처럼 고유화
const ensureUniqueTitles = (items) => {
  const seen = new Map();
  return items.map((it) => {
    const t = it.title ?? '';
    const n = (seen.get(t) || 0) + 1;
    seen.set(t, n);
    if (n === 1) return it;
    return { ...it, title: `${t} ${n}` };
  });
};

export function SlashMenu() {
  // BlockNoteView 내부에서만 사용해야 컨텍스트가 존재
  const editor = useBlockNoteEditor();
  if (!editor) return null;

  // 기본 아이템(ko 번역 적용됨) → 제목 고유화 → 커스텀 추가
  const items = React.useMemo(() => {
    const defaults = getDefaultReactSlashMenuItems(editor);
    const deduped = ensureUniqueTitles(defaults);

    const helloItem = {
      title: 'Hello World 넣기',
      onItemClick: () =>
        insertOrUpdateBlock(editor, {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello World', styles: { bold: true } }],
        }),
      aliases: ['helloworld', 'hw'],
      group: '기타',
    };

    return [...deduped, helloItem];
  }, [editor]);

  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) => filterItems(items, query)}
    />
  );
}

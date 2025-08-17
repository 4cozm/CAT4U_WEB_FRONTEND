'use client';
import { insertOrUpdateBlock } from '@blocknote/core';
import {
    SuggestionMenuController,
    getDefaultReactSlashMenuItems,
    useBlockNoteEditor,
} from '@blocknote/react';
import React from 'react';
import { GiSpaceship } from 'react-icons/gi';

// 텍스트 검색
const filterItems = (items, query) => {
  const q = (query || '').toLowerCase();
  if (!q) return items;
  return items.filter(
    (it) =>
      it.title?.toLowerCase().includes(q) ||
      (Array.isArray(it.aliases) && it.aliases.some((a) => a.toLowerCase().includes(q)))
  );
};

// 중복 제목 고유화
const ensureUniqueTitles = (items) => {
  const seen = new Map();
  return items.map((it) => {
    const t = it.title ?? '';
    const n = (seen.get(t) || 0) + 1;
    seen.set(t, n);
    return n === 1 ? it : { ...it, title: `${t} ${n}` };
  });
};

// 카테고리별 그룹핑
const groupByCategory = (list) => {
  const map = new Map();
  for (const e of list) {
    const cat = e.category || '기타';
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat).push(e);
  }
  // 정렬을 원하면 여기서 Array.from(map).sort(...)
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
};

// 이모지 픽커(섹션 헤더 + 그리드)
function EmojiPicker({ list, onPick, onClose }) {
  const groups = React.useMemo(() => groupByCategory(list), [list]);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose} aria-hidden>
      <div
        className="absolute bottom-24 left-6 w-[22rem] max-h-[70vh] overflow-auto rounded-xl border bg-white p-3 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-2 text-sm font-semibold">이브 이모지 선택</p>

        {groups.length === 0 ? (
          <p className="text-xs text-neutral-500">
            이모지를 찾지 못했어요. <code>/public/eve-emoji/manifest.json</code>을 확인하세요.
          </p>
        ) : (
          groups.map(({ category, items }, idx) => (
            <div key={category} className="mb-3">
              {/* --- 느낌의 섹션 제목/구분선 */}
              <div className="flex items-center gap-2 py-1">
                <span className="text-[11px] font-semibold uppercase text-neutral-500">
                  {category}
                </span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {items.map((e) => (
                  <button
                    key={e.src}
                    title={e.name}
                    className="flex flex-col items-center rounded-lg p-2 hover:bg-neutral-100 active:scale-[.98]"
                    onClick={() => onPick(e)}
                    type="button"
                  >
                    <img
                      src={e.src}
                      alt={e.name}
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      className="h-10 w-10 object-contain"
                    />
                    <span className="mt-1 text-[11px] text-neutral-600">{e.name}</span>
                  </button>
                ))}
              </div>
              {idx < groups.length - 1 && <div className="my-3 h-px bg-neutral-100" />}
            </div>
          ))
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-neutral-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export function SlashMenu() {
  const editor = useBlockNoteEditor();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [emojiList, setEmojiList] = React.useState([]);

  // manifest.json 로드
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/eve-emoji/manifest.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('manifest not found');
        const data = await res.json();
        if (alive && Array.isArray(data)) setEmojiList(data);
      } catch {
        if (alive) setEmojiList([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!editor) return null;

  const items = React.useMemo(() => {
    const defaults = ensureUniqueTitles(getDefaultReactSlashMenuItems(editor));
    const eveEmojiItem = {
      title: '이브 이모지 삽입',
      icon: <GiSpaceship className="h-4 w-4" />,
      group: '미디어',
      aliases: ['eve', 'emoji', '이모지', '우주선'],
      onItemClick: () => setPickerOpen(true),
    };
    return [...defaults, eveEmojiItem];
  }, [editor]);

  const handlePick = (emoji) => {
    insertOrUpdateBlock(editor, {
      type: 'image',
      props: { src: emoji.src, alt: emoji.name },
    });
    setPickerOpen(false);
  };

  return (
    <>
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) => filterItems(items, query)}
      />
      {pickerOpen && (
        <EmojiPicker
          list={emojiList}
          onPick={handlePick}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}

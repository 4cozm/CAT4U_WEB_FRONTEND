/**
 * 해당 코드 베이스의 책임 정리
 *
 * 하는일
 * schema 조립
 * inline spec 등록
 * BlockNote editor 생성
 * React hook으로 감싸서 반환
 *
 * 절대 하면 안되는 일
 * UI 렌더
 * 메뉴 마운트
 * ref 조작
 * 전역 접근
 */

"use client";

import { BlockNoteSchema } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";

import { InlineEmojiSpec } from "./components/InlineEmojiSpec";

// 필요하면 나중에 더 추가
const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    //기본 기능이 로드되지 않는다면 스프레드 연산자로 기본 기능 마운트 ...defaultInlineContentSpecs
    emoji: InlineEmojiSpec,
  },
});

export function useBlockNoteEditor({ initialContent }) {
  const editor = useCreateBlockNote({
    schema,
    initialContent,
  });

  return editor;
}

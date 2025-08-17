'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// 에디터 본체를 클라이언트에서만 로드
const EditorInner = dynamic(() => import('./EditorInner'), { ssr: false });

export default function EditorHost() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <EditorInner />;
}

import React from 'react';
import EditorHost from './EditorHost';

export default function BlockNotePage() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">새 글 작성</h1>
      <div className="rounded-xl border bg-white p-4 shadow">
        <EditorHost />
      </div>
    </main>
  );
}

"use client";

export default function ReadClient({ title, html }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">
        {title}
      </h1>

      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}

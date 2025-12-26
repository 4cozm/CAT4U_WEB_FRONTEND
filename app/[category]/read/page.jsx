import { getCategoryParams } from "@/utils/categoryPath.js";
import { Suspense } from "react";
import ReadClient from "./ReadClient";

export const generateStaticParams = getCategoryParams;

export default async function Page({ params }) {
  const { category } = await params;

  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-8 text-white/70">불러오는 중...</div>}>
      <ReadClient category={category} />
    </Suspense>
  );
}

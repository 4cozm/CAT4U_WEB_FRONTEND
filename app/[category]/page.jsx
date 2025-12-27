// app/[category]/page.jsx
import GlassCard from "@/components/GlassCard";
import PostListClient from "@/components/PostListClient.jsx";
import WriteButton from "@/components/WriteButton";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORY_MAP, getCategoryParams } from "../../utils/categoryPath.js";

export const dynamicParams = false;
export const generateStaticParams = getCategoryParams;

export default async function CategoryPage({ params }) {
  const { category: categoryParam } = await params;
  const category = CATEGORY_MAP[categoryParam];
  if (!category) notFound();

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">{category.name}</h1>

          <Suspense fallback={null}>
            <WriteButton category={category.id} />
          </Suspense>
        </div>
      </GlassCard>

      <Suspense fallback={<div className="text-white/70">불러오는 중...</div>}>
        <PostListClient categoryParam={categoryParam} categoryId={category.id} />
      </Suspense>
    </div>
  );
}

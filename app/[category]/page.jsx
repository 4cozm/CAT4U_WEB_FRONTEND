import GlassCard from "@/components/GlassCard";
import WriteButton from "@/components/WriteButton";
import { notFound } from "next/navigation";
import { CATEGORY_MAP, getCategoryParams } from "../../utils/categoryPath.js";


export const dynamicParams = false;
export const generateStaticParams = getCategoryParams;

export default async function CategoryPage({ params }) {
  const { category: categoryParam } = await params; 
  const category = CATEGORY_MAP[categoryParam];
  if (!category) notFound();

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{category.name}</h1>
        <WriteButton category={category.id} />
      </div>
    </GlassCard>
  );
}

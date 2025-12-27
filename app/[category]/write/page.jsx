import { getCategoryParams } from "../../../utils/categoryPath.js";
import PageClient from "./PageClient.jsx";
import { Suspense } from "react";

export const generateStaticParams = getCategoryParams;

export default async function WritePage({ params }) {
  const { category } = await params; // Next 15 비동기 처리

  // 클라이언트 컴포넌트로 category 전달
  return(
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-8 text-white/70">불러오는 중...</div>}>
      <PageClient category={category} />;
    </Suspense>);

}

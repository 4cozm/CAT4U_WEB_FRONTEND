import { EDITOR_SHELL } from "@/style/uiClasses.js";
import { getCategoryParams } from "@/utils/categoryPath.js";
import { Suspense } from "react";
import ReadClient from "./ReadClient";
import CommentClient from "./CommentClient";

export const generateStaticParams = getCategoryParams;

export default async function Page({ params }) {
  const { category } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-6xl flex-col pt-4">
          <div className={`${EDITOR_SHELL} p-4 text-white/70`}>불러오는 중...</div>
        </div>
      }
    >
      <>
        <ReadClient category={category} />
        <CommentClient category={category} />
      </>
    </Suspense>
  );
}

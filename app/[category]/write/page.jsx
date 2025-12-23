import { getCategoryParams } from "../../../utils/categoryPath.js";
import PageClient from "./PageClient.jsx";

export const generateStaticParams = getCategoryParams;

export default async function WritePage({ params }) {
  const { category } = await params; // Next 15 비동기 처리

  // 클라이언트 컴포넌트로 category 전달
  return <PageClient category={category} />;
}

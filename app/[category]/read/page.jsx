// BlockNote/[category]/read/page.jsx
import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import ReadClient from "./ReadClient";

export default async function Page({ searchParams, params }) {
  const { id } = searchParams;
  const { category } = params;

  if (!id) {
    return <div>잘못된 접근</div>;
  }

  const data = await fetchWithAuth(`/api/guide/${category}?id=${id}`, { cache: "no-store" });

  // 서버는 JSON 문자열을 그대로 내려줬다고 가정
  const contentJSON = JSON.parse(data.board_content);

  return <ReadClient title={data.board_title} content={contentJSON} />;
}

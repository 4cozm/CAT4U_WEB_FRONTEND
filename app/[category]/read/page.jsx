import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import ReadClient from "./ReadClient";

export default async function Page({ searchParams, params }) {
  const { id } = searchParams;
  const { category } = params;

  if (!id) return <div>잘못된 접근</div>;

  const data = await fetchWithAuth(`/api/guide/${category}?id=${id}`, { cache: "no-store" });

  let contentJSON = [];
  try {
    contentJSON = JSON.parse(data.board_content);
  } catch {
    contentJSON = [];
  }

  return <ReadClient title={data.board_title} content={contentJSON} />;
}

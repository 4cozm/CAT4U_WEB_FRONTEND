import { FittingDetailPageClient } from "./FittingDetailPageClient"

// 정적 생성을 위한 함수
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }]
}

export default function FittingDetailPage({ params }: { params: { id: string } }) {
  return <FittingDetailPageClient params={params} />
}

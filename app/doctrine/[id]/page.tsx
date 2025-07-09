import type { Metadata } from "next"
import DoctrineDetailPageClient from "./DoctrineDetailPageClient"

// 정적 생성을 위한 함수
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }]
}

export const metadata: Metadata = {
  title: "독트린 상세 페이지",
}

export default function DoctrineDetailPage({ params }: { params: { id: string } }) {
  return <DoctrineDetailPageClient params={params} />
}

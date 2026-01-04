import GlassCard from "../components/GlassCard";
import HomeFeedClient from "../components/HomeFeedClient.jsx";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <GlassCard>
        <h1 className="text-3xl md:text-4xl font-semibold">🐸🐟😺 커뮤니티</h1>
        <p className="mt-3 text-muted">가이드, 독트린, 피팅 정보를 공유하고 함께 성장하든가 말든가</p>
      </GlassCard>

      <HomeFeedClient />
    </div>
  );
}

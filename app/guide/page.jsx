import GlassCard from "@/components/GlassCard";
import WriteButton from '@/components/WriteButton';

export default function GuidePage() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">가이드</h1>
        <WriteButton category="guide" />
      </div>
    </GlassCard>
  );
}

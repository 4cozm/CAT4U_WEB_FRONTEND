import GlassCard from "@/components/GlassCard";
import WriteButton from '@/components/WriteButton';

export default function MarketPage() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">장터</h1>
        <WriteButton category="market" />
      </div>
    </GlassCard>
  );
}

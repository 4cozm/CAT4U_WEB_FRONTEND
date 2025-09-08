import GlassCard from '@/components/GlassCard';
import WriteButton from '@/components/WriteButton';

export default function FittingPage() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">피팅</h1>
        <WriteButton category="fitting" />
      </div>
    </GlassCard>
  );
}
import GlassCard from '@/components/GlassCard';
import WriteButton from '@/components/WriteButton';

export default function DoctrinePage() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">독트린</h1>
        <WriteButton category="doctrine" />
      </div>
    </GlassCard>
  );
}

import CTAButtons from '@/components/CTAButtons';
import GlassCard from '@/components/GlassCard';

export default function HomePage() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <GlassCard className="md:col-span-2">
                <h1 className="text-3xl md:text-4xl font-semibold">CAT4U 커뮤니티</h1>
                <p className="mt-3 text-muted">
                    iOS 스타일의 라이트 글래스 UI 데모입니다. 가이드, 독트린, 피팅, 장터 정보를 공유하세요.
                </p>
                <CTAButtons />
            </GlassCard>

            <GlassCard>
                <h2 className="text-2xl font-semibold">공지</h2>
                <p className="mt-2 text-sm text-muted">알파 테스트 버전입니다. 정적 Export 배포 가능.</p>
            </GlassCard>

            <GlassCard>
                <h2 className="text-2xl font-semibold">오늘의 추천 피팅</h2>
                <ul className="mt-3 list-disc pl-5 text-sm text-muted">
                    <li>Caracal — L2 런너 (샘플)</li>
                    <li>Vexor — 드론 포커스 (샘플)</li>
                </ul>
            </GlassCard>
        </div>
    );
}

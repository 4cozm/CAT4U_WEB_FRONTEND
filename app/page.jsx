import CategoryPills from '../components/CategoryPills';
import GlassCard from '../components/GlassCard';
import ListCard from '../components/ListCard.jsx';
import { AiOutlineLike } from 'react-icons/ai';
import { FaHotjar } from 'react-icons/fa';
import { IoTimeOutline } from 'react-icons/io5';
const latestPosts = [
    {
        id: 1,
        title: '새 공지 — 알파 테스트 오픈',
        desc: '정적 Export 배포 가능',
        author: '관리자',
        category: '공지',
        likes: 12,
    },
    {
        id: 2,
        title: '패치 노트 0.1.1',
        desc: 'UI 소소한 개선',
        author: '운영팀',
        category: '업데이트',
        likes: 8,
    },
    {
        id: 3,
        title: '가이드: 초반 ISK 모으기',
        desc: '하이섹 미션 루트',
        author: 'EVEPlayer',
        category: '가이드',
        likes: 23,
    },
    {
        id: 4,
        title: '피팅: 카라칼 L2 런',
        desc: '저예산 미사일',
        author: 'AlphaPilot',
        category: '피팅',
        likes: 17,
    },
];

const popularPosts = [
    {
        id: 101,
        title: '베속 — 드론 포커스',
        desc: 'L3 미션 효율',
        author: 'DroneMaster',
        category: '피팅',
        likes: 42,
    },
    {
        id: 102,
        title: '무역 루트 기본기',
        desc: 'Jita↔Amarr',
        author: 'TraderX',
        category: '경제',
        likes: 31,
    },
    {
        id: 103,
        title: '스캔 입문',
        desc: '프로브 세팅',
        author: 'ScannerY',
        category: '가이드',
        likes: 27,
    },
    {
        id: 104,
        title: '뉴마치 버튼 UX',
        desc: '실험적',
        author: 'UI연구원',
        category: 'UX/UI',
        likes: 19,
    },
];

export default function HomePage() {
    return (
        <div className="grid gap-6">
            {/* 상단 히어로 */}
            <GlassCard>
                <h1 className="text-3xl md:text-4xl font-semibold">🐸🐟😺 커뮤니티</h1>
                <p className="mt-3 text-muted">가이드, 독트린, 피팅 정보를 공유하고 함께 성장하든가 말든가</p>
            </GlassCard>

            {/* 아래 섹션: md부터 2컬럼 (왼: 최신글 / 오른: 인기글) */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* 최신글 섹션 */}
                <section aria-labelledby="latest-heading">
                    <h2 id="latest-heading" className="flex items-center gap-2 text-2xl font-semibold">
                        <IoTimeOutline className="w-6 h-6" />
                        최신글
                    </h2>

                    {/* 카드 리스트: 모바일 세로, md에선 왼쪽 컬럼에 세로 4개 */}
                    <div className="mt-3 grid gap-3">
                        {latestPosts.slice(0, 4).map(post => (
                            <ListCard key={post.id}>
                                <h3 className="text-base font-semibold">{post.title}</h3>
                                {post.desc && <p className="mt-1 text-sm text-muted">{post.desc}</p>}

                                {/* 카테고리 알약 */}
                                <CategoryPills category={post.category} categories={post.categories} />

                                {/* 메타 라인 */}
                                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                                    <span>{post.author}</span>
                                    <span className="inline-flex items-center gap-1">
                                        <AiOutlineLike className="w-4 h-4" /> {post.likes}
                                    </span>
                                </div>
                            </ListCard>
                        ))}
                    </div>
                </section>

                {/* 인기글 섹션 */}
                <section aria-labelledby="popular-heading">
                    <h2 id="latest-heading" className="flex items-center gap-2 text-2xl font-semibold">
                        <FaHotjar className="w-6 h-6" />
                        인기글
                    </h2>

                    <div className="mt-3 grid gap-3">
                        {latestPosts.slice(0, 4).map(post => (
                            <ListCard key={post.id}>
                                <h3 className="text-base font-semibold">{post.title}</h3>
                                {post.desc && <p className="mt-1 text-sm text-muted">{post.desc}</p>}

                                {/* 카테고리 알약 */}
                                <CategoryPills category={post.category} categories={post.categories} />

                                {/* 메타 라인 */}
                                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                                    <span>{post.author}</span>
                                    <span className="inline-flex items-center gap-1">
                                        <AiOutlineLike className="w-4 h-4" /> {post.likes}
                                    </span>
                                </div>
                            </ListCard>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

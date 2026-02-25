// ──────────────────────────────────────────────
// Guide Spatial UI – Static Data
// ──────────────────────────────────────────────

export const DIMENSIONS = [
  {
    id: 'dim-field',
    label: '분야',
    icon: '⚔️',
    tags: [
      { id: 'tag-pvp',      label: 'PvP' },
      { id: 'tag-pve',      label: 'PvE' },
      { id: 'tag-industry', label: '인더스트리' },
      { id: 'tag-trade',    label: '트레이딩' },
      { id: 'tag-explore',  label: '탐험' },
    ],
  },
  {
    id: 'dim-ship',
    label: '함선',
    icon: '🚀',
    tags: [
      { id: 'tag-frigate',   label: '프리깃' },
      { id: 'tag-destroyer', label: '디스트로이어' },
      { id: 'tag-cruiser',   label: '크루저' },
      { id: 'tag-bc',        label: '배틀크루저' },
      { id: 'tag-bs',        label: '배틀십' },
      { id: 'tag-capital',   label: '캐피탈' },
    ],
  },
  {
    id: 'dim-space',
    label: '공간',
    icon: '🌌',
    tags: [
      { id: 'tag-hisec',   label: '하이섹' },
      { id: 'tag-losec',   label: '로섹' },
      { id: 'tag-nullsec', label: '널섹' },
      { id: 'tag-wh',      label: '웜홀' },
      { id: 'tag-abyss',   label: '어비스' },
    ],
  },
  {
    id: 'dim-mechanic',
    label: '메커니즘',
    icon: '⚙️',
    tags: [
      { id: 'tag-fitting',    label: '피팅' },
      { id: 'tag-tackle',     label: '태클' },
      { id: 'tag-logi',       label: '로지스틱스' },
      { id: 'tag-fleet',      label: '플릿 커맨드' },
      { id: 'tag-ewar',       label: 'EWAR' },
      { id: 'tag-scanning',   label: '스캐닝' },
    ],
  },
];

export const GUIDE_CARDS = [
  {
    id: 'g-1',
    title: '솔로 프리깃 PvP 완전 정복',
    tags: ['tag-pvp', 'tag-frigate', 'tag-losec', 'tag-fitting'],
    description: '저섹에서 솔로 프리깃으로 생존하고 킬을 따내는 핵심 전략.',
    url: '#',
  },
  {
    id: 'g-2',
    title: '널섹 캐피탈 운용 가이드',
    tags: ['tag-pvp', 'tag-capital', 'tag-nullsec', 'tag-fleet'],
    description: '대규모 블록 전쟁에서 캐피탈 함대를 운용하는 방법.',
    url: '#',
  },
  {
    id: 'g-3',
    title: '어비스 티어 5–6 크루저 피팅',
    tags: ['tag-pve', 'tag-cruiser', 'tag-abyss', 'tag-fitting'],
    description: '위험성 높은 어비스 포켓에서 수익을 극대화하는 피팅 세팅.',
    url: '#',
  },
  {
    id: 'g-4',
    title: '웜홀 스캐닝 & 탐험 루틴',
    tags: ['tag-explore', 'tag-wh', 'tag-scanning'],
    description: '웜홀 사이트를 효율적으로 스캔하고 먹는 루틴 가이드.',
    url: '#',
  },
  {
    id: 'g-5',
    title: '로지스틱스 포지셔닝 & 링크',
    tags: ['tag-fleet', 'tag-logi', 'tag-nullsec'],
    description: '로지스틱스 파일럿이 플릿 내에서 살아남는 포지셔닝 팁.',
    url: '#',
  },
  {
    id: 'g-6',
    title: '하이섹 미션 PvE 배틀십 피팅',
    tags: ['tag-pve', 'tag-bs', 'tag-hisec', 'tag-fitting'],
    description: '레벨 4 미션을 빠르게 돌기 위한 배틀십 피팅 추천.',
    url: '#',
  },
  {
    id: 'g-7',
    title: 'EWAR 기초: 재밍·댐프·트래킹',
    tags: ['tag-pvp', 'tag-ewar', 'tag-fleet'],
    description: '전자전 모듈의 작동 원리와 플릿에서의 역할 가이드.',
    url: '#',
  },
  {
    id: 'g-8',
    title: '태클러 입문: 프리깃으로 킬 기여',
    tags: ['tag-pvp', 'tag-frigate', 'tag-tackle', 'tag-losec'],
    description: '태클 프리깃을 타고 플릿 킬에 기여하는 기본 가이드.',
    url: '#',
  },
  {
    id: 'g-9',
    title: '인더스트리 블루프린트 관리',
    tags: ['tag-industry'],
    description: 'T1·T2 블루프린트 복사·리서치 최적화 전략.',
    url: '#',
  },
  {
    id: 'g-10',
    title: '트레이딩 마진 분석 & Jita 101',
    tags: ['tag-trade', 'tag-hisec'],
    description: '지타에서 수익률 높은 아이템을 찾고 마진을 계산하는 방법.',
    url: '#',
  },
  {
    id: 'g-11',
    title: '디스트로이어 스쿼드론 전술',
    tags: ['tag-pvp', 'tag-destroyer', 'tag-losec', 'tag-fleet'],
    description: '소규모 디스트로이어 팩으로 상위 함선을 사냥하는 전술.',
    url: '#',
  },
  {
    id: 'g-12',
    title: '배틀크루저 솔로 & 스몰갱',
    tags: ['tag-pvp', 'tag-bc', 'tag-nullsec', 'tag-fitting'],
    description: '배틀크루저로 솔로 또는 4인 이하 소규모 교전을 즐기는 법.',
    url: '#',
  },
];

export const TRENDING_CARDS = [
  {
    id: 't-1',
    type: 'patch',
    title: 'Patch Notes – Equinox 2.3',
    date: '2026-02-20',
    tags: ['패치'],
    excerpt:
      '드레드노트 시그니처 반경 조정, 세베루스 데미지 보너스 수정, 어비스 웨더 이펙트 밸런스 변경이 포함됩니다.',
  },
  {
    id: 't-2',
    type: 'meta',
    title: '급상승 메타: 비글스웜 컴프',
    date: '2026-02-22',
    tags: ['메타', 'PvP'],
    excerpt:
      '최근 토너먼트와 캐주얼 스몰갱에서 비글스웜 구성이 압도적인 성과를 내고 있습니다. 핵심 피팅과 전술을 분석합니다.',
  },
  {
    id: 't-3',
    type: 'fitting',
    title: '이번 주 인기 피팅: 뱀파이어 크루저',
    date: '2026-02-23',
    tags: ['피팅', 'PvP', '크루저'],
    excerpt:
      'Corp 멤버들이 검증한 노스페라투 크루저 피팅. 로섹 솔로에서 높은 생존율과 킬 효율을 보여줍니다.',
  },
  {
    id: 't-4',
    type: 'guide',
    title: '신규 가이드: 웜홀 J-Space 생활',
    date: '2026-02-24',
    tags: ['가이드', '웜홀'],
    excerpt:
      'C3~C5 웜홀에 홀딩을 세우고 생활하는 방법. POS 대신 아타노르 운용 팁 포함.',
  },
  {
    id: 't-5',
    type: 'news',
    title: 'EVE 개발팀 AMA 핵심 요약',
    date: '2026-02-24',
    tags: ['뉴스'],
    excerpt:
      '다음 분기 피팅 인터페이스 개편, 함대 스캐닝 시스템 개선, 그리고 신규 웜홀 클래스 검토 중임을 확인.',
  },
];

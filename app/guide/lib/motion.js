/**
 * 가이드 캔버스 공통 Framer Motion 애니메이션 토큰
 * 모든 노드/엣지에서 이 파일을 import해 일관성을 유지합니다.
 */

// 공통 easing — 스프링감 있는 감속 (CSS cubic-bezier와 동일)
export const EASE_SPRING = [0.16, 1, 0.3, 1];

// ── Dimension 노드 variants ───────────────────────────────────
export const nodeVariants = {
  hover: { scale: 1.03, transition: { duration: 0.14, ease: 'easeOut' } },
  tap:   { scale: 0.97, transition: { duration: 0.07 } },
};

// ── Subtag 노드 variants (진입 + 인터랙션) ──────────────────
export const subtagVariants = {
  initial: { opacity: 0, x: -14, scale: 0.88 },
  animate: {
    opacity: 1, x: 0, scale: 1,
    transition: { duration: 0.32, ease: EASE_SPRING },
  },
  hover: { scale: 1.07, transition: { duration: 0.1, ease: 'easeOut' } },
  tap:   { scale: 0.95, transition: { duration: 0.06 } },
};

// ── Chip (DimensionNode 내 선택 태그) hover variants ────────
// motion.span에 적용, 색상은 style prop으로 따로 처리
export const chipVariants = {
  hover: { scale: 1.05, transition: { duration: 0.1 } },
  tap:   { scale: 0.95, transition: { duration: 0.06 } },
};

// ── 결과 패널 카드 variants ───────────────────────────────────
export const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: i * 0.04, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
  hover: {
    borderColor: 'rgba(61,220,151,0.35)',
    background: 'rgba(61,220,151,0.06)',
    transition: { duration: 0.15 },
  },
};

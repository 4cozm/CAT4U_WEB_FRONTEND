'use client';
import { useMemo } from 'react';
import { DIMENSIONS, TRENDING_CARDS } from '../data/guideData';
import useGuideStore from '../store/guideStore';

export const ZONE_A = { x: 0, y: 0 };
export const ZONE_B = { x: -2200, y: 0 };
export const ZONE_C = { x: 2200, y: 0 };

// ── Zone B 좌표 상수 ──────────────────────────────────────────
//   센터 모드(아무것도 열리지 않음):
//     카드 4개 세로 배치 (좌측) | Results 패널 (우측)
//   Pill 모드(하나 이상 열림):
//     Subtag (좌) | Pill (중앙 약간 우) | Results (우)

// Pill 모드 위치
const DIM_X    = ZONE_B.x + 80;    // -2120 : pill 세로 목록
const SUBTAG_X = ZONE_B.x - 400;   // -2600 : 좌측 subtag

// 센터 모드 카드 위치 (세로 4×1, 50% 확대)
const CENTER_CARD_X = ZONE_B.x - 25;   // -2225 : 카메라 중심(-2000) 기준 카드 중앙 정렬
const CARD_W = 450;
const CARD_H = 135;
const CARD_GAP = 20;

// Results 패널 위치 (모드별)
const RESULTS_X_CENTER = ZONE_B.x + 180;  // -2020 : 센터 모드 결과
const RESULTS_X_PILL   = ZONE_B.x + 490;  // -1710 : pill 모드 결과 (화면 이탈 방지)

const DIM_SPACING    = 160;
const SUBTAG_SPACING = 60;
const DIM_START_Y    = -((DIMENSIONS.length - 1) * DIM_SPACING) / 2;

export function useGuideGraph() {
  const { openDimensions, selectedTags } = useGuideStore();

  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // 아무 Dimension도 열리지 않고 + 선택된 태그도 없을 때만 센터 모드
    const isCenterMode = openDimensions.size === 0 && selectedTags.size === 0;

    // ── Zone A – Landing ──
    nodes.push({
      id: 'landing',
      type: 'landing',
      position: { x: ZONE_A.x - 310, y: ZONE_A.y - 180 },
      data: {},
    });

    // ── Zone B – Discovery Tree ──
    const dimSubtagStartY = {};
    let totalSubtagY = 0;
    DIMENSIONS.forEach((dim) => {
      dimSubtagStartY[dim.id] = totalSubtagY;
      const count = openDimensions.has(dim.id) ? dim.tags.length : 0;
      totalSubtagY += count > 0 ? count * SUBTAG_SPACING + 24 : 0;
    });
    const subtagClusterStartY = -(totalSubtagY / 2);

    // 센터 모드 카드 전체 높이 계산 (세로 중앙 정렬용)
    const totalCenterH = CARD_H * DIMENSIONS.length + CARD_GAP * (DIMENSIONS.length - 1);

    DIMENSIONS.forEach((dim, dimIndex) => {
      const dimHasSelections = dim.tags.some((t) => selectedTags.has(t.id));

      // 위치 계산
      let posX, posY;
      if (isCenterMode) {
        // 4×1 세로 배치 (좌측)
        posX = CENTER_CARD_X;
        posY = ZONE_B.y - totalCenterH / 2 + dimIndex * (CARD_H + CARD_GAP);
      } else {
        // Pill 모드: 우측 중앙 세로 배열
        const dimY = DIM_START_Y + dimIndex * DIM_SPACING;
        posX = DIM_X;
        posY = ZONE_B.y + dimY - 22;
      }

      nodes.push({
        id: dim.id,
        type: 'dimension',
        position: { x: posX, y: posY },
        data: { id: dim.id, label: dim.label, icon: dim.icon, tags: dim.tags, isCenterMode },
      });

      // 선택된 태그가 있는 dimension → results 연결선
      if (dimHasSelections) {
        edges.push({
          id: `glow-${dim.id}-results`,
          source: dim.id,
          target: 'results',
          type: 'pulseLine',
          sourceHandle: 'right',
          targetHandle: 'left',
        });
      }

      // Subtags (열렸을 때만)
      if (openDimensions.has(dim.id)) {
        const subtagBaseY = subtagClusterStartY + dimSubtagStartY[dim.id];
        dim.tags.forEach((tag, tagIndex) => {
          const tagY = subtagBaseY + tagIndex * SUBTAG_SPACING;
          const isSelected = selectedTags.has(tag.id);

          nodes.push({
            id: tag.id,
            type: 'subtag',
            position: { x: SUBTAG_X, y: ZONE_B.y + tagY },
            data: { id: tag.id, label: tag.label },
          });

          edges.push({
            id: `e-${dim.id}-${tag.id}`,
            source: dim.id,
            target: tag.id,
            type: 'animatedBezier',
            sourceHandle: 'left',
            targetHandle: 'right',
            data: { isActive: isSelected },
          });
        });
      }
    });

    // Results node — 센터 모드(아무것도 선택 안 됨)에서는 숨김
    if (!isCenterMode) {
      nodes.push({
        id: 'results',
        type: 'results',
        position: {
          x: RESULTS_X_PILL,
          y: ZONE_B.y - 400,
        },
        data: {},
      });
    }

    // ── Zone C – Trending ──
    nodes.push({
      id: 'trending-header',
      type: 'trendingFeed',
      position: { x: ZONE_C.x - 210, y: ZONE_C.y - 380 },
      data: {},
    });
    TRENDING_CARDS.forEach((card, i) => {
      nodes.push({
        id: `trending-${card.id}`,
        type: 'trendingCard',
        position: { x: ZONE_C.x - 210 + (i % 2) * 420, y: ZONE_C.y - 200 + Math.floor(i / 2) * 220 },
        data: card,
      });
    });

    return { nodes, edges };
  }, [openDimensions, selectedTags]);

  return { nodes, edges };
}

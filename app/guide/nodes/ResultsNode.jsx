'use client';
import { Handle, Position } from '@xyflow/react';
import { AnimatePresence, motion } from 'framer-motion';
import { GUIDE_CARDS } from '../data/guideData';
import { cardVariants } from '../lib/motion';
import useGuideStore from '../store/guideStore';

export default function ResultsNode({ data }) {
  const { selectedTags } = useGuideStore();
  const selected = [...selectedTags];

  // Intersection: cards that have ALL selected tags
  const results = selected.length === 0
    ? []
    : GUIDE_CARDS.filter((card) =>
        selected.every((tagId) => card.tags.includes(tagId))
      );

  // Fallback: union (any tag matches) when no intersection found
  const unionResults = selected.length > 0 && results.length === 0
    ? GUIDE_CARDS.filter((card) =>
        selected.some((tagId) => card.tags.includes(tagId))
      )
    : [];

  const displayCards = results.length > 0 ? results : unionResults;
  const isUnion = results.length === 0 && unionResults.length > 0;

  return (
    <div
      className="nopan"
      style={{
        width: 460,
        background: 'rgba(11, 16, 26, 0.75)',
        border: '1px solid rgba(61,220,151,0.22)',
        borderRadius: 28,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 0 40px rgba(61,220,151,0.06), 0 16px 48px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 28px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 22 }}>📋</span>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#3ddc97' }}>가이드 결과</div>
          {selected.length > 0 ? (
            <div style={{ fontSize: 13, color: 'rgba(154,167,182,0.7)', marginTop: 2 }}>
              {isUnion ? `유사 결과 ${displayCards.length}개` : `교집합 ${displayCards.length}개`}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: 'rgba(154,167,182,0.5)', marginTop: 2 }}>태그를 선택하면 결과가 나타납니다</div>
          )}
        </div>
      </div>

      {/* Card list */}
      <div style={{
        overflowY: 'auto',
        maxHeight: 720,
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        scrollbarWidth: 'none',
      }}>
        <AnimatePresence mode="popLayout">
          {selected.length === 0 && (
            <motion.div
              key="empty-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(154,167,182,0.4)', fontSize: 16 }}
            >
              ← 왼쪽에서 태그를 선택하세요
            </motion.div>
          )}

          {selected.length > 0 && displayCards.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(154,167,182,0.4)', fontSize: 16 }}
            >
              선택한 태그 조합에 맞는 가이드가 없습니다
            </motion.div>
          )}

          {displayCards.map((card, i) => (
            <motion.a
              key={card.id}
              href={card.url}
              variants={cardVariants}
              custom={i}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover={{
                borderColor: 'rgba(61,220,151,0.35)',
                backgroundColor: 'rgba(61,220,151,0.06)',
                transition: { duration: 0.15 },
              }}
              style={{
                display: 'block',
                textDecoration: 'none',
                padding: '16px 18px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 18,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 600, color: '#e6edf7', marginBottom: 6 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(154,167,182,0.7)', lineHeight: 1.6 }}>
                {card.description}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                {card.tags.map((tid) => (
                  <span
                    key={tid}
                    style={{
                      fontSize: 12,
                      padding: '3px 10px',
                      borderRadius: 50,
                      background: selected.includes(tid)
                        ? 'rgba(102,178,255,0.2)'
                        : 'rgba(255,255,255,0.06)',
                      color: selected.includes(tid)
                        ? '#66b2ff'
                        : 'rgba(154,167,182,0.6)',
                      border: selected.includes(tid)
                        ? '1px solid rgba(102,178,255,0.3)'
                        : '1px solid transparent',
                    }}
                  >
                    {tid.replace('tag-', '')}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      <Handle id="left" type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />
    </div>
  );
}

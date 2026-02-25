'use client';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { chipVariants, nodeVariants } from '../lib/motion';
import useGuideStore from '../store/guideStore';

export default function DimensionNode({ data }) {
  const { id, label, icon, tags, isCenterMode } = data;
  const { openDimensions, selectedTags, toggleDimension, toggleTag } = useGuideStore();

  const isOpen = openDimensions.has(id);
  const selectedInDim = tags.filter((t) => selectedTags.has(t.id));
  const hasSelections = selectedInDim.length > 0;

  // chip이 있고 닫힌 pill 모드: 컨테이너를 column으로 해서 chip을 아래에 배치
  const showChipsBelow = !isOpen && !isCenterMode && hasSelections;

  return (
    <motion.div
      className="nopan"
      onClick={() => toggleDimension(id)}
      variants={nodeVariants}
      whileHover="hover"
      whileTap="tap"
      style={{
        display: 'flex',
        flexDirection: isCenterMode ? 'row' : (showChipsBelow ? 'column' : 'row-reverse'),
        justifyContent: 'flex-start',
        alignItems: isCenterMode ? 'center' : (showChipsBelow ? 'flex-start' : 'center'),
        gap: isCenterMode ? 16 : (showChipsBelow ? 10 : 8),
        padding: isCenterMode ? '0 32px' : (showChipsBelow ? '14px 20px 16px' : '18px 28px'),
        width: isCenterMode ? 450 : 'auto',
        height: isCenterMode ? 135 : 'auto',
        background: isOpen
          ? 'rgba(102,178,255,0.13)'
          : hasSelections
          ? 'rgba(61,220,151,0.07)'
          : 'rgba(16, 20, 28, 0.7)',
        border: isOpen
          ? '1px solid rgba(102,178,255,0.45)'
          : hasSelections
          ? '1px solid rgba(61,220,151,0.35)'
          : '1px solid rgba(255,255,255,0.12)',
        borderRadius: isCenterMode ? 18 : 20,
        cursor: 'pointer',
        userSelect: 'none',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isOpen
          ? '0 0 20px rgba(102,178,255,0.2)'
          : hasSelections
          ? '0 0 24px rgba(61,220,151,0.18), 0 4px 16px rgba(0,0,0,0.35)'
          : '0 4px 16px rgba(0,0,0,0.35)',
        position: 'relative',
        transition: [
          'background 0.3s',
          'border-color 0.3s',
          'box-shadow 0.3s',
          'border-radius 0.4s cubic-bezier(0.16,1,0.3,1)',
          'padding 0.4s cubic-bezier(0.16,1,0.3,1)',
          'width 0.4s cubic-bezier(0.16,1,0.3,1)',
          'height 0.4s cubic-bezier(0.16,1,0.3,1)',
        ].join(', '),
        maxWidth: isCenterMode ? 450 : 380,
        minWidth: showChipsBelow ? 200 : 'auto',
      }}
    >
      {/* ── 상단 행: 아이콘 + 레이블 + 화살표 ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        width: isCenterMode ? 'auto' : (showChipsBelow ? '100%' : 'auto'),
      }}>
        {/* 아이콘 */}
        <span style={{
          fontSize: isCenterMode ? 48 : 26,
          flexShrink: 0,
          transition: 'font-size 0.4s cubic-bezier(0.16,1,0.3,1)',
          lineHeight: 1,
        }}>{icon}</span>

        {/* 레이블 */}
        <span style={{
          fontSize: isCenterMode ? 22 : 20,
          fontWeight: 700,
          color: isOpen ? '#66b2ff' : hasSelections ? '#3ddc97' : '#e6edf7',
          transition: 'color 0.28s',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          flex: showChipsBelow ? 1 : 'none',
        }}>
          {label}
        </span>

        {/* 화살표 — pill 모드에서만 표시 */}
        {!isCenterMode && (
          <span style={{
            fontSize: 11,
            color: isOpen ? 'rgba(102,178,255,0.6)' : 'rgba(154,167,182,0.45)',
            flexShrink: 0,
            display: 'inline-block',
            transform: isOpen ? 'rotate(-90deg)' : 'rotate(90deg)',
            transition: 'transform 0.28s, color 0.28s',
            marginLeft: 4,
          }}>▲</span>
        )}
      </div>

      {/* ── 하단 행: 선택 chip들 (pill 모드 + 닫힌 상태 + 선택 있을 때) ── */}
      {showChipsBelow && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 5,
            alignItems: 'center',
            paddingTop: 4,
            borderTop: '1px solid rgba(61,220,151,0.2)',
            width: '100%',
          }}
        >
          {selectedInDim.map((tag) => (
            <motion.span
              key={tag.id}
              variants={chipVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => toggleTag(tag.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px 4px 8px',
                background: 'rgba(61,220,151,0.15)',
                border: '1px solid rgba(61,220,151,0.45)',
                borderRadius: 50,
                fontSize: 12,
                color: '#3ddc97',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 8px rgba(61,220,151,0.2)',
              }}
            >
              {tag.label}
              <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 700 }}>×</span>
            </motion.span>
          ))}
        </div>
      )}

      <Handle id="left"     type="source" position={Position.Left}  style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="right"    type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="target-l" type="target" position={Position.Left}  style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
}

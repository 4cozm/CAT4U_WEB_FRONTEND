'use client';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { motion } from 'framer-motion';

export default function TrendingFeedNode({ data }) {
  const { setCenter } = useReactFlow();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 420,
        background: 'rgba(11, 16, 26, 0.72)',
        border: '1px solid rgba(61,220,151,0.2)',
        borderRadius: 24,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 0 40px rgba(61,220,151,0.06), 0 16px 48px rgba(0,0,0,0.4)',
        padding: '28px 28px 24px',
        userSelect: 'none',
      }}
    >
      {/* Accent line */}
      <div style={{
        width: 40,
        height: 3,
        borderRadius: 2,
        background: 'linear-gradient(90deg, #3ddc97, #66b2ff)',
        marginBottom: 16,
      }} />

      <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(61,220,151,0.7)', textTransform: 'uppercase', marginBottom: 6 }}>
        Live Feed
      </div>
      <h2 style={{
        fontSize: 26,
        fontWeight: 700,
        color: '#e6edf7',
        letterSpacing: '-0.02em',
        margin: '0 0 8px',
      }}>
        최신 메타 동향
      </h2>
      <p style={{ fontSize: 13, color: 'rgba(154,167,182,0.7)', lineHeight: 1.6, margin: 0 }}>
        패치노트, 급상승 피팅, EVE 커뮤니티 핫이슈를 모아 보여드립니다.
      </p>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
}

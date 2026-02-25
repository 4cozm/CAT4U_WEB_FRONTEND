'use client';
import { getBezierPath } from '@xyflow/react';
import { motion } from 'framer-motion';

export default function PulseLine({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.3,
  });

  return (
    <g>
      {/* Glowing base — 항상 표시되는 얇은 바닥 선 */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(61,220,151,0.2)"
        strokeWidth={3}
      />

      {/* Breathing glow — 부드럽게 밝아졌다 어두워지는 호흡 효과 */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="#3ddc97"
        strokeWidth={3}
        initial={{ opacity: 0.25, filter: 'drop-shadow(0 0 2px rgba(61,220,151,0.2))' }}
        animate={{ opacity: 1,    filter: 'drop-shadow(0 0 12px rgba(61,220,151,0.9))' }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Dot at source */}
      <circle cx={sourceX} cy={sourceY} r={3} fill="rgba(61,220,151,0.8)" />
      {/* Dot at target */}
      <circle cx={targetX} cy={targetY} r={3} fill="rgba(61,220,151,0.8)" />
    </g>
  );
}

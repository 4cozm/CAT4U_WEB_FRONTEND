'use client';
import { getBezierPath } from '@xyflow/react';

export default function AnimatedBezierEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {},
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = !!data.isActive;

  return (
    <g>
      {/* Base stroke */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={isActive ? 'rgba(102,178,255,0.55)' : 'rgba(255,255,255,0.1)'}
        strokeWidth={isActive ? 2 : 1}
        style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
      />

      {/* Data-flow animation on active paths */}
      {isActive && (
        <path
          d={edgePath}
          fill="none"
          stroke="rgba(102,178,255,0.8)"
          strokeWidth={2}
          strokeDasharray="6 10"
          style={{
            animation: 'edgeFlow 1.8s linear infinite',
          }}
        />
      )}
    </g>
  );
}

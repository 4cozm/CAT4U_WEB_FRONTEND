'use client';
import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

const TYPE_CONFIG = {
  patch:   { icon: '🔧', color: '#ffb44d', label: '패치' },
  meta:    { icon: '⚡', color: '#66b2ff', label: '메타' },
  fitting: { icon: '🛸', color: '#3ddc97', label: '피팅' },
  guide:   { icon: '📖', color: '#c084fc', label: '가이드' },
  news:    { icon: '📡', color: '#9aa7b6', label: '뉴스' },
};

export default function TrendingCardNode({ data }) {
  const { title, date, tags, excerpt, type } = data;
  const [expanded, setExpanded] = useState(false);
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.news;

  return (
    <div
      className="nopan"
      onClick={() => setExpanded((v) => !v)}
      style={{
        width: 380,
        background: 'rgba(16, 20, 28, 0.72)',
        border: `1px solid ${expanded ? cfg.color + '44' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 20,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: expanded
          ? `0 0 24px ${cfg.color}18, 0 12px 32px rgba(0,0,0,0.4)`
          : '0 6px 20px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {/* Card header */}
      <div style={{ padding: '16px 18px 12px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 10,
          background: cfg.color + '22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          border: `1px solid ${cfg.color}33`,
        }}>
          {cfg.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: cfg.color, fontWeight: 600, marginBottom: 4 }}>
            {cfg.label} · {date}
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#e6edf7',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </div>
        </div>

        <span style={{
          fontSize: 11,
          color: 'rgba(154,167,182,0.5)',
          flexShrink: 0,
          marginTop: 2,
          display: 'inline-block',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s',
        }}>
          ▼
        </span>
      </div>

      {/* Tags */}
      <div style={{ paddingInline: 18, paddingBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 50,
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(154,167,182,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Expandable excerpt */}
      <div
        style={{
          maxHeight: expanded ? 200 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        <div style={{
          padding: '12px 18px 16px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          fontSize: 13,
          color: 'rgba(154,167,182,0.85)',
          lineHeight: 1.65,
        }}>
          {excerpt}
          <div style={{ marginTop: 10 }}>
            <a
              href="#"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: 12,
                color: cfg.color,
                textDecoration: 'none',
              }}
            >
              자세히 보기 →
            </a>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
    </div>
  );
}

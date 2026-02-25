'use client';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

export default function LandingNode({ data }) {
  const flyTo = (zone) => {
    if (typeof window !== 'undefined' && window.__guideFlyTo) {
      window.__guideFlyTo(zone);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 620,
        background: 'rgba(11, 16, 26, 0.72)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 28,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 0 60px rgba(102,178,255,0.08), 0 20px 60px rgba(0,0,0,0.5)',
        padding: '48px 48px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        top: -80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102,178,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* EVE emblem */}
      <div style={{ fontSize: 11, letterSpacing: '0.25em', color: 'rgba(102,178,255,0.6)', textTransform: 'uppercase', marginBottom: 12 }}>
        EVE Online · 대물캣 커뮤니티
      </div>

      {/* Main title */}
      <h1 style={{
        fontSize: 36,
        fontWeight: 700,
        color: '#e6edf7',
        textAlign: 'center',
        lineHeight: 1.2,
        margin: '0 0 8px',
        letterSpacing: '-0.02em',
      }}>
        지식 탐색망
      </h1>
      <p style={{ fontSize: 14, color: 'rgba(154,167,182,0.8)', textAlign: 'center', margin: '0 0 36px' }}>
        원하는 분야와 함선을 선택해 가이드를 탐색하세요
      </p>

      {/* Search bar (decorative) */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        padding: '12px 18px',
        marginBottom: 32,
      }}>
        <span style={{ fontSize: 16, opacity: 0.4 }}>🔍</span>
        <span style={{ fontSize: 14, color: 'rgba(154,167,182,0.5)' }}>가이드 검색… (준비 중)</span>
      </div>

      {/* Portal buttons */}
      <div style={{ display: 'flex', gap: 14, width: '100%' }}>
        {/* Zone B — 왼쪽으로 이동 */}
        <PortalButton
          label="지식 탐색망 접속"
          sub="← 왼쪽으로 이동"
          icon="🕸️"
          accent="#66b2ff"
          onClick={() => flyTo('B')}
        />
        {/* Zone C — 오른쪽으로 이동 */}
        <PortalButton
          label="최신 메타 동향"
          sub="오른쪽으로 이동 →"
          icon="📡"
          accent="#3ddc97"
          onClick={() => flyTo('C')}
        />
      </div>

      <Handle type="source" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
}

function PortalButton({ label, sub, icon, accent, onClick }) {
  return (
    <motion.button
      className="nopan"
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      style={{
        flex: 1,
        background: `linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)`,
        border: `1px solid ${accent}33`,
        borderRadius: 16,
        padding: '16px 14px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        color: '#e6edf7',
        boxShadow: `0 0 20px ${accent}14`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent + '66')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = accent + '33')}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: accent }}>{label}</span>
      <span style={{ fontSize: 11, color: 'rgba(154,167,182,0.7)' }}>{sub}</span>
    </motion.button>
  );
}

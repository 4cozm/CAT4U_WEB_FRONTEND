'use client';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { subtagVariants } from '../lib/motion';
import useGuideStore from '../store/guideStore';

export default function SubTagNode({ data }) {
  const { id, label } = data;
  const { selectedTags, toggleTag } = useGuideStore();
  const isSelected = selectedTags.has(id);

  return (
    <motion.div
      className="nopan"
      onClick={() => toggleTag(id)}
      variants={subtagVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      style={{
        padding: '12px 26px',
        background: isSelected
          ? 'rgba(102,178,255,0.18)'
          : 'rgba(255,255,255,0.05)',
        border: isSelected
          ? '1px solid rgba(102,178,255,0.55)'
          : '1px solid rgba(255,255,255,0.1)',
        borderRadius: 50,
        cursor: 'pointer',
        userSelect: 'none',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isSelected
          ? '0 0 14px rgba(102,178,255,0.28), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 2px 8px rgba(0,0,0,0.25)',
        fontSize: 17,
        fontWeight: isSelected ? 600 : 400,
        color: isSelected ? '#66b2ff' : '#9aa7b6',
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s, color 0.2s',
        whiteSpace: 'nowrap',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}
    >
      {isSelected && (
        <span style={{ fontSize: 13, color: '#66b2ff' }}>✓</span>
      )}
      {label}

      <Handle id="left"  type="target" position={Position.Left}  style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="right" type="target" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
}

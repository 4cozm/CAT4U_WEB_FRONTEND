'use client';
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';


import { ZONE_A, ZONE_B, ZONE_C, useGuideGraph } from './hooks/useGuideGraph';

// Custom Nodes
import DimensionNode from './nodes/DimensionNode';
import LandingNode from './nodes/LandingNode';
import ResultsNode from './nodes/ResultsNode';
import SubTagNode from './nodes/SubTagNode';
import TrendingCardNode from './nodes/TrendingCardNode';
import TrendingFeedNode from './nodes/TrendingFeedNode';

// Custom Edges
import AnimatedBezierEdge from './edges/AnimatedBezierEdge';
import PulseLine from './edges/PulseLine';

const NODE_TYPES = {
  landing: LandingNode,
  dimension: DimensionNode,
  subtag: SubTagNode,
  results: ResultsNode,
  trendingFeed: TrendingFeedNode,
  trendingCard: TrendingCardNode,
};

const EDGE_TYPES = {
  animatedBezier: AnimatedBezierEdge,
  pulseLine: PulseLine,
};

// 현재 어떤 Zone에 있는지 추정 (x 기준)
function detectZone(x) {
  if (x < -800) return 'B';
  if (x > 800) return 'C';
  return 'A';
}

function CanvasInner() {
  const { setCenter, getViewport } = useReactFlow();
  const { nodes, edges } = useGuideGraph();
  const [currentZone, setCurrentZone] = useState('A');

  const flyTo = useCallback((zone) => {
    const zoom = zone === 'B' ? 0.7 : 0.9;
    // Zone B: 요소 실제 무게중심(pills~results)에 맞춰 카메라를 오른쪽으로 200 이동
    const camera = {
      A: ZONE_A,
      B: { x: ZONE_B.x + 200, y: 0 },
      C: ZONE_C,
    };
    const c = camera[zone];
    setCenter(c.x, c.y, { duration: 900, zoom });
    setCurrentZone(zone);
  }, [setCenter]);

  // LandingNode 등 노드 내부에서 flyTo 호출 가능하게 전역 노출
  if (typeof window !== 'undefined') {
    window.__guideFlyTo = flyTo;
  }

  const onInit = useCallback(() => {
    setCenter(ZONE_A.x, ZONE_A.y, { duration: 0, zoom: 0.9 });
  }, [setCenter]);

  const showHome = currentZone !== 'A';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onInit={onInit}
        defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
        minZoom={0.5}
        maxZoom={1.3}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        fitView={false}
        nodesDraggable={false}
        nodesConnectable={false}
        deleteKeyCode={null}
        style={{ background: 'transparent' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="rgba(255,255,255,0.06)"
        />

        {/* 홈으로 버튼 — Zone B/C에서만 표시 */}
        {showHome && (
          <Panel position="top-left">
            <button
              onClick={() => flyTo('A')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                background: 'rgba(11,16,26,0.82)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 50,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                cursor: 'pointer',
                color: '#e6edf7',
                fontSize: 13,
                fontWeight: 500,
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                transition: 'border-color 0.2s, background 0.2s',
                marginTop: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(102,178,255,0.4)';
                e.currentTarget.style.background = 'rgba(102,178,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                e.currentTarget.style.background = 'rgba(11,16,26,0.82)';
              }}
            >
              ← 홈으로
            </button>
          </Panel>
        )}


      </ReactFlow>

      <style>{`
        @keyframes edgeFlow {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -48; }
        }
        /* Dimension 노드 위치 이동 시 부드러운 슬라이드 */
        .react-flow__node-dimension {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .react-flow__node:focus { outline: none; }
        .react-flow__pane { cursor: default !important; }
        .react-flow__panel { margin: 12px; }
      `}</style>
    </div>
  );
}

export default function GuideCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}

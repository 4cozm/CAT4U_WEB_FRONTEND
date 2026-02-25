'use client';
import { GUIDE_CARDS } from '../data/guideData';
import useGuideStore from '../store/guideStore';

export default function ResultsPanel() {
  const { selectedTags } = useGuideStore();
  const selected = [...selectedTags];

  const results = selected.length === 0
    ? []
    : GUIDE_CARDS.filter((card) =>
        selected.every((tagId) => card.tags.includes(tagId))
      );

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
        width: 380,
        maxHeight: 'calc(100vh - 120px)',
        background: 'rgba(11, 16, 26, 0.85)',
        border: '1px solid rgba(61,220,151,0.22)',
        borderRadius: 20,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 0 40px rgba(61,220,151,0.06), 0 16px 48px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 4,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 20px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 15 }}>📋</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#3ddc97' }}>가이드 결과</div>
          {selected.length > 0 ? (
            <div style={{ fontSize: 11, color: 'rgba(154,167,182,0.7)', marginTop: 1 }}>
              {isUnion ? `유사 결과 ${displayCards.length}개` : `교집합 ${displayCards.length}개`}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'rgba(154,167,182,0.5)', marginTop: 1 }}>
              태그를 선택하면 결과가 나타납니다
            </div>
          )}
        </div>
      </div>

      {/* Card list */}
      <div style={{
        overflowY: 'auto',
        flex: 1,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        scrollbarWidth: 'none',
      }}>
        {selected.length === 0 && (
          <div style={{ padding: '28px 0', textAlign: 'center', color: 'rgba(154,167,182,0.4)', fontSize: 13 }}>
            ← 왼쪽에서 태그를 선택하세요
          </div>
        )}

        {selected.length > 0 && displayCards.length === 0 && (
          <div style={{ padding: '28px 0', textAlign: 'center', color: 'rgba(154,167,182,0.4)', fontSize: 13 }}>
            선택한 태그 조합에 맞는 가이드가 없습니다
          </div>
        )}

        {displayCards.map((card) => (
          <a
            key={card.id}
            href={card.url}
            className="nopan"
            style={{
              display: 'block',
              textDecoration: 'none',
              padding: '11px 13px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 13,
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(61,220,151,0.35)';
              e.currentTarget.style.background = 'rgba(61,220,151,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e6edf7', marginBottom: 3 }}>
              {card.title}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(154,167,182,0.7)', lineHeight: 1.5 }}>
              {card.description}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 7 }}>
              {card.tags.map((tid) => (
                <span
                  key={tid}
                  style={{
                    fontSize: 10,
                    padding: '2px 7px',
                    borderRadius: 50,
                    background: selected.includes(tid) ? 'rgba(102,178,255,0.2)' : 'rgba(255,255,255,0.06)',
                    color: selected.includes(tid) ? '#66b2ff' : 'rgba(154,167,182,0.6)',
                    border: selected.includes(tid) ? '1px solid rgba(102,178,255,0.3)' : '1px solid transparent',
                  }}
                >
                  {tid.replace('tag-', '')}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

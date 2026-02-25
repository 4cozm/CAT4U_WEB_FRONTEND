'use client';
// page.jsx is a Client Component so we can use dynamic() with ssr:false
// Metadata is exported from layout.jsx instead.
import dynamic from 'next/dynamic';

const GuideCanvas = dynamic(() => import('./GuideCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(154,167,182,0.4)',
      fontSize: 12,
      letterSpacing: '0.2em',
    }}>
      INITIALIZING...
    </div>
  ),
});

export default function GuidePage() {
  return (
    /* 헤더와 동일한 max-w-7xl + mx-auto 컨테이너 */
    <div style={{ position: 'fixed', inset: 0, top: 'var(--header-h)', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '80rem', height: '100%', paddingInline: 16, paddingBottom: 8 }}>
        <GuideCanvas />
      </div>
    </div>
  );
}

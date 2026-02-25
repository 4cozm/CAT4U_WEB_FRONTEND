// app/guide/layout.jsx
// Guide layout: metadata here (Server Component), body passthrough
export const metadata = {
  title: '지식 탐색망',
  description: 'EVE Online 가이드 공간 탐색 인터페이스',
};

export default function GuideLayout({ children }) {
  return <>{children}</>;
}

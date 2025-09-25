// app/head.jsx
export default function Head() {
    return (
        <>
            {/* 포스터를 최우선 이미지로 프리로드 */}
            <link
                rel="preload"
                as="image"
                href="/bg/hero-fallback.webp"
                fetchpriority="high"
                // imagesrcset / imagesizes 도 가능하지만 배경이라 단일 소스로 충분
            />
        </>
    );
}

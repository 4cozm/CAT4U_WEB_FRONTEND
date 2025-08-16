'use client';
import { useEffect, useRef, useState } from 'react';

function pickSrc() {
    const cssW = window.innerWidth;
    const physW = Math.round(cssW * window.devicePixelRatio);

    const wide = physW >= 2560; // 2K 이상이면 true

    const v = document.createElement('video');
    const canWebm = v.canPlayType?.('video/webm; codecs="vp9"') !== '';

    if (wide) return canWebm ? '/bg/loop-2k-60s.webm' : '/bg/loop-2k-60s.mp4';
    return canWebm ? '/bg/loop-1080p-60s.webm' : '/bg/loop-1080p-60s.mp4';
}

export default function BackgroundVideo({ poster = '/bg/hero-fallback.webp' }) {
    const elRef = useRef(null);
    const [showPoster, setShowPoster] = useState(true);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        el.style.opacity = '0'; // 준비될 때까지 비디오 숨김
        el.preload = 'auto'; // 첫 프레임 빠르게
        el.src = pickSrc();
        el.load();

        const MIN_BUFFER_S = 1.5; // 최소 버퍼 확보(초)
        let timer = null;
        let shown = false;

        const tryShow = () => {
            if (shown) return;
            // 첫 프레임 준비됐는지
            const haveFirstFrame = el.readyState >= 2; // HAVE_CURRENT_DATA
            // 현재 위치 기준으로 최소 버퍼 확보됐는지
            const buf = el.buffered;
            const bufferedSec = buf?.length ? buf.end(buf.length - 1) - el.currentTime : 0;
            if (haveFirstFrame && bufferedSec >= MIN_BUFFER_S) {
                shown = true;
                el.style.opacity = '1';
                setTimeout(() => setShowPoster(false), 80);
                el.play().catch(() => {});
                clearInterval(timer);
            }
        };

        const onLoadedData = () => {
            // 첫 프레임 디코드 후 주기 체크 시작
            timer = setInterval(tryShow, 120);
        };
        const onError = () => {
            // 실패 시 포스터 유지
            clearInterval(timer);
            el.style.opacity = '0';
            setShowPoster(true);
        };

        el.addEventListener('loadeddata', onLoadedData, { once: true });
        el.addEventListener('error', onError);
        // 안전 타임아웃(네트워크 매우 느릴 때 4초 후 강제 전환)
        const bailout = setTimeout(tryShow, 4000);

        return () => {
            clearInterval(timer);
            clearTimeout(bailout);
            el.removeEventListener('error', onError);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
            {showPoster && (
                <img
                    src={poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                />
            )}
            <video
                ref={elRef}
                autoPlay
                muted
                loop
                playsInline
                poster={poster} // 폴백용
                className="h-full w-full object-cover transition-opacity duration-300"
            />
        </div>
    );
}

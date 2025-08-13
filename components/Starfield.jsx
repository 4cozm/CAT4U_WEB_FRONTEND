'use client';

import { useEffect, useRef } from 'react';

export default function Starfield() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let raf = 0;
        const DPR = Math.min(2, window.devicePixelRatio || 1);

        const stars = Array.from({ length: 120 }, () => ({
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
            s: 0.5 + Math.random() * 1.5,
        }));

        function resize() {
            canvas.width = Math.floor(window.innerWidth * DPR);
            canvas.height = Math.floor(window.innerHeight * DPR);
        }

        function draw() {
            const w = canvas.width,
                h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            ctx.globalAlpha = 0.12; // 5~12% 정도의 은은함
            for (const star of stars) {
                star.z += 0.0015;
                if (star.z > 1) star.z = 0;
                const sx = ((star.x - 0.5) * w * 0.6) / (0.2 + star.z) + w / 2;
                const sy = ((star.y - 0.5) * h * 0.6) / (0.2 + star.z) + h / 2;
                const r = star.s * (1.2 - star.z) * DPR;
                const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
                g.addColorStop(0, 'rgba(231,238,246,0.7)');
                g.addColorStop(1, 'rgba(231,238,246,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        }

        const onResize = () => {
            resize();
        };
        window.addEventListener('resize', onResize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <canvas
            ref={ref}
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 opacity-70"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}

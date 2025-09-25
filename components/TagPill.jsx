// 알약 형태의 카테고리 표시기
import clsx from 'clsx';
export default function TagPill({ children, className }) {
    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-full',
                'px-2.5 py-0.5 text-[11px] leading-5',
                'border border-white/12 bg-[rgba(255,255,255,.06)] text-[var(--muted)]',
                // 아주 살짝의 글로우 느낌 (다크 글래스와 조화)
                'shadow-[0_0_6px_rgba(0,0,0,.15)]',
                className
            )}
        >
            {children}
        </span>
    );
}

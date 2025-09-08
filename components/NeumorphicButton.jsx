'use client';

import clsx from 'clsx';

export default function NeumorphicButton({ label, onClick, variant = 'primary' }) {
    const color =
        variant === 'primary' ? 'var(--primary)' : variant === 'secondary' ? 'var(--secondary)' : 'var(--accent)';

    return (
        <button onClick={onClick} className={clsx('btn-neu px-4 py-2 text-sm font-medium')} style={{ color }}>
            {label}
        </button>
    );
}

'use client';

import clsx from 'clsx';
import Link from 'next/link';

export default function NavLink({ href, children, current, className }) {
    return (
        <Link
            href={href}
            aria-current={current ? 'page' : undefined}
            className={clsx(
                'link-underline text-sm transition-colors text-current',
                current ? '' : 'hover:text-[var(--primary)]',
                className
            )}
        >
            {children}
        </Link>
    );
}

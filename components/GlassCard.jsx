import clsx from 'clsx';

export default function GlassCard({ children, className }) {
    return <section className={clsx('glass rounded-2xl p-6', className)}>{children}</section>;
}

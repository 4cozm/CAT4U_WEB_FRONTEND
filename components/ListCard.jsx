import clsx from 'clsx';

export default function ListCard({ as: As = 'section', className, children, ...props }) {
  return (
    <As
      className={clsx(
        'rounded-2xl border backdrop-blur-xl p-4',
        'border-white/10 bg-[rgba(16,20,28,.55)] shadow-[0_6px_20px_rgba(0,0,0,.30)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40',
        'listcard-hover', // ← 여기!
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}

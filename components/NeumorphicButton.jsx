"use client";

import clsx from "clsx";
import Link from "next/link";

export default function NeumorphicButton({ label, onClick, href, variant = "primary", className, disabled = false }) {
  const color =
    variant === "primary" ? "var(--primary)" : variant === "secondary" ? "var(--secondary)" : "var(--accent)";

  const base = clsx("btn-neu px-4 py-2 text-sm font-medium", className, disabled && "opacity-50 pointer-events-none");

  if (href) {
    return (
      <Link href={href} className={base} style={{ color }} aria-disabled={disabled}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base} style={{ color }} disabled={disabled}>
      {label}
    </button>
  );
}

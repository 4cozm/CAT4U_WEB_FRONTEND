
"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGate() {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });
        if (res.ok) setReady(true);
        else router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      } catch {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
    })();
  }, [pathname, router]);

  if (!ready) {
    // 매우 가벼운 프리로더 (Tailwind)
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="animate-pulse text-sm text-neutral-400">checking session…</div>
      </div>
    );
  }
  return null; // 통과되면 아래 children이 렌더됨 (layout.jsx에서 사용)
}
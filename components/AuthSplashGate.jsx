"use client";

import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import { useEffect, useState } from "react";

export default function AuthSplashGate() {
  const [statusText, setStatusText] = useState("인증 확인중...");
  const [phase, setPhase] = useState("active"); // active | leaving | done

  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        await fetchWithAuth("/api/esi/me", { method: "GET", redirectOn401: false });
        if (!alive) return;
        setPhase("leaving");
      } catch (e) {
        if (!alive) return;

        if (e?.status === 401) {
          setStatusText("EVE 로그인 페이지로 이동중...");

          requestAnimationFrame(() => {
            (async () => {
              try {
                const r = await fetch("/api/esi/login", {
                  method: "GET",
                  credentials: "include",
                  cache: "no-store",
                });
                const { url } = await r.json();
                if (url) window.location.replace(url);
                else setStatusText("로그인 URL 생성 실패. 새로고침 해주세요.");
              } catch {
                setStatusText("로그인 URL 생성 실패. 새로고침 해주세요.");
              }
            })();
          });

          return;
        }

        setStatusText("인증 확인 실패. 새로고침 해주세요.");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center",
        "splash-glass",
        phase === "leaving" ? "splash-leave" : "",
      ].join(" ")}
      onAnimationEnd={(e) => {
        if (e.animationName === "splashLift") setPhase("done");
      }}
    >
      <div className="flex items-center justify-center gap-1">
        {["로", "딩", "중", ".", ".", "."].map((ch, i) => (
          <span key={i} className="loading-letter" style={{ animationDelay: `${i * 0.08}s` }}>
            {ch}
          </span>
        ))}
      </div>

      <div className="mt-8 text-white/90 text-sm">{statusText}</div>
    </div>
  );
}

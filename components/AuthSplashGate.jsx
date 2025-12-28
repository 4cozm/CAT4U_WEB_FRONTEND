"use client";

import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import { useEffect, useLayoutEffect, useState } from "react";

const KEY = "auth_splash_shown_v1";

export default function AuthSplashGate() {
  const [statusText, setStatusText] = useState("인증 확인중...");
  const [phase, setPhase] = useState("boot"); // boot | active | leaving | done

  // ✅ 첫 페인트 전에 결정: 이미 봤으면 done, 아니면 active
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === "1") {
        setPhase("done");
        return;
      }
      sessionStorage.setItem(KEY, "1");
      setPhase("active");
    } catch {
      // sessionStorage 막힌 환경이면 일단 1회만 보여주자
      setPhase("active");
    }
  }, []);

  // 스플래시 동안만 스크롤 잠금
  useEffect(() => {
    if (phase === "active" || phase === "leaving") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  // ✅ 인증 체크는 active일 때만 1회
  useEffect(() => {
    if (phase !== "active") return;

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
        setPhase("done");
      }
    })();

    return () => {
      alive = false;
    };
  }, [phase]);

  if (phase === "boot" || phase === "done") return null;

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

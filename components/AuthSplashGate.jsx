"use client";

import { useAuth } from "@/components/AuthProvider.jsx";
import { authEvents } from "@/utils/authEvent.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const KEY = "auth_splash_shown_v1";

export default function AuthSplashGate() {
  const { me, loadingMe, meError } = useAuth();

  const [phase, setPhase] = useState("boot"); // boot | active | done
  const [statusText, setStatusText] = useState("인증 확인중...");
  const [redirecting, setRedirecting] = useState(false);

  const redirectingRef = useRef(false);

  // 스플래시를 "한 번만" 보여줄지 결정
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === "1") {
        setPhase("done");
        return;
      }
      sessionStorage.setItem(KEY, "1");
      setPhase("active");
    } catch {
      setPhase("active");
    }
  }, []);

  // 오버레이 떠 있을 때만 스크롤 잠금
  useEffect(() => {
    const showOverlay = phase === "active" || redirecting;
    if (!showOverlay) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase, redirecting]);

  async function startLoginRedirect() {
    if (redirectingRef.current) return;
    redirectingRef.current = true;

    setRedirecting(true);
    setStatusText("EVE 로그인 페이지로 이동중...");

    try {
      const r = await fetch("/api/esi/login", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const j = await r.json().catch(() => null);
      const url = j?.url;

      if (url) window.location.replace(url);
      else setStatusText("로그인 URL 생성 실패. 새로고침 해주세요.");
    } catch {
      setStatusText("로그인 URL 생성 실패. 새로고침 해주세요.");
    }
  }

  // 401 이벤트 구독. 앱 전체에서 터지는 401을 여기서 1회 처리
  useEffect(() => {
    return authEvents.onUnauthorized(() => {
      startLoginRedirect();
    });
  }, []);

  // 초기 로딩 종료 후 상태에 따라 스플래시 마감 또는 로그인 이동
  useEffect(() => {
    if (phase !== "active") return;
    if (loadingMe) return;

    if (me) {
      setPhase("done");
      return;
    }

    if (meError?.status === 401) {
      startLoginRedirect();
      return;
    }

    // 다른 에러면 스플래시만 닫고 화면은 보여준다
    setPhase("done");
  }, [phase, loadingMe, me, meError]);

  const showOverlay = (phase === "active" && loadingMe) || redirecting;
  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center splash-glass">
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
